from ninja.security import HttpBearer
from models import ClientPublicKey, ServerPrivateKey
from django.shortcuts import get_object_or_404
from ninja.errors import AuthenticationError


class AuthBearer(HttpBearer):
    def authenticate(self, request, token) -> ServerPrivateKey or ClientPublicKey:
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
