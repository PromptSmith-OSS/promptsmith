from ninja.errors import AuthenticationError
from ninja.security import HttpBearer

from core.models import APIKey


class ProjectKeyAuthentication(HttpBearer):
    """
    Authenticate the project key (private key or public key)
    """

    async def authenticate(self, request, token) -> APIKey:
        try:
            api_key = await APIKey.objects.select_related('project').aget(key=token)
            if not api_key:
                raise AuthenticationError('Invalid token')
            return api_key
        except APIKey.DoesNotExist:
            raise AuthenticationError('Invalid token')

