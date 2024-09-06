import os

from ninja.errors import AuthenticationError
from ninja.security import HttpBearer


class SimpleAuthBearer(HttpBearer):
    def authenticate(self, request, token) -> bool:
        if token == os.getenv('SDK_KEY'):
            return True
        else:
            raise AuthenticationError('Invalid token')
