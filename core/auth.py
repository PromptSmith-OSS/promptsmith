from typing import Optional, Union
from typing import TypedDict

from django.conf import settings
from django.contrib.auth.models import User
from django.http import HttpRequest
from django.shortcuts import aget_object_or_404, get_object_or_404
from ninja.errors import ValidationError, AuthenticationError
from ninja.security import HttpBearer

from core.models import APIKey
from project.models import Project
from shared.auth import AsyncDjangoNinjaAuth


class UserProject:
    user: User
    project: Project


class AsyncCoreResourceAuthenticationAndAuthorization(AsyncDjangoNinjaAuth):
    """
    Reusing Django session authentication
    This decouple the authentication from Ninja routers and Django All Auth
    https://docs.allauth.org/en/latest/headless/openapi-specification/
    """

    async def authenticate(self, request: HttpRequest, key: Optional[str]) -> Optional[UserProject]:
        """
        Authenticate the user
        Get session id from cookies
        Or get from headers X-Session-Token
        :param request:
        :param key:
        :return:
        """
        # Authentication
        user = await super().authenticate(request, key)
        if not user:
            return None

        # Authorization of project and related resources
        # get the project uuid from headers
        project_uuid = request.headers.get('X-Project-UUID')

        if not project_uuid:
            # try get from cookies
            project_uuid = request.COOKIES.get(settings.SHARED_CONFIGURATION.get('project_cookie_key'), None)

        if not project_uuid:
            raise ValidationError([{'Project-UUID': 'Project UUID is required'}])

        # get the project
        qs = Project.objects.filter(uuid=project_uuid)
        project = await aget_object_or_404(qs)

        # check if user has view permission
        if not await project.is_viewable_to_user_organization(user):
            return None
        use_project = UserProject()
        use_project.user = user
        use_project.project = project
        return use_project


async_core_resource_auth = AsyncCoreResourceAuthenticationAndAuthorization()


class ProjectKeyAuthentication(HttpBearer):
    """
    Authenticate the project key (private key or public key)
    """

    def authenticate(self, request, token) -> APIKey:
        # this is a client side token
        # this is for remote evaluation on customer client or server side
        try:
            return get_object_or_404(APIKey, key=token)
        except APIKey.DoesNotExist:
            raise AuthenticationError('Invalid token')
