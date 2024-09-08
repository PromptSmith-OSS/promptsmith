import os

from ninja.errors import AuthenticationError
from ninja.security import HttpBearer


class SDKAuthBearer(HttpBearer):
    def authenticate(self, request, token) -> bool:
        if token == os.getenv('SDK_KEY'):
            return True
        else:
            raise AuthenticationError('Invalid token')


class ManagementAuthBearer(HttpBearer):
    def authenticate(self, request, token) -> bool:
        if token == os.getenv('MANAGEMENT_KEY'):
            return True
        else:
            raise AuthenticationError('Invalid token')
