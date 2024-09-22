from typing import Optional, Any

from django.http import HttpRequest
from django.shortcuts import aget_object_or_404
from ninja.errors import ValidationError

from project.models import Project
from shared.auth import AsyncDjangoNinjaAuth

from django.conf import settings


class AsyncCoreResourceAuthenticationAndAuthorization(AsyncDjangoNinjaAuth):
    """
    Reusing Django session authentication
    This decouple the authentication from Ninja routers and Django All Auth
    https://docs.allauth.org/en/latest/headless/openapi-specification/
    """

    async def authenticate(self, request: HttpRequest, key: Optional[str]) -> Optional[Any]:
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
            project_uuid = request.COOKIES.get(settings.SHARED_CONFIGURATION.get('project_cookie_name'), None)

        if not project_uuid:
            raise ValidationError([{'Project-UUID': 'Project UUID is required'}])

        # get the project
        qs = Project.objects.filter(uuid=project_uuid)
        project = await aget_object_or_404(qs)

        # check if user has view permission
        if not await project.is_viewable_to_user_organization(user):
            return None
        return project


async_core_resource_auth = AsyncCoreResourceAuthenticationAndAuthorization()
