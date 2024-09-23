from django.shortcuts import get_object_or_404
from ninja.errors import AuthenticationError
from ninja.security import HttpBearer
from typing import Union

from project.models import ServerPrivateKey, ClientPublicKey


class ProjectKeyAuthentication(HttpBearer):
    """
    Authenticate the project key (private key or public key)
    """

    def authenticate(self, request, token) -> Union[ServerPrivateKey, ClientPublicKey]:
        if token[:4] == 'pri_':
            # this is a server side private token
            # this allows to use local evaluation and remote evaluation on customer server
            try:
                return get_object_or_404(ServerPrivateKey, private_key=token)
            except ServerPrivateKey.DoesNotExist:
                raise AuthenticationError('Invalid token')

        else:
            # this is a client side token
            # this is for remote evaluation on customer client or server side
            try:
                return get_object_or_404(ClientPublicKey, public_key=token)
            except ClientPublicKey.DoesNotExist:
                raise AuthenticationError('Invalid token')
