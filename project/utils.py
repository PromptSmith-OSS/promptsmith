import datetime
import os
import secrets
from uuid import UUID

import jwt
from dotenv import load_dotenv

load_dotenv()

jwt_secret = os.getenv('JWT_SECRET')


def generate_token(user_uuid: UUID | str, project_uuid: UUID | str, days: int = 365) -> str:
    """
    Generate a jwt token valid for 365 days
    """
    payload = {
        'user_uuid': str(user_uuid),
        'project_uuid': str(project_uuid),
        'iat': datetime.datetime.now(datetime.timezone.utc),
        'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=days)
    }
    return jwt.encode(payload, jwt_secret, algorithm='HS256')


def decode_token(token: str) -> dict:
    """
    Decode a token
    """
    return jwt.decode(token, jwt_secret, algorithms=['HS256'])


def generate_secure_token(desired_token_length=64) -> str:
    """
    Generate a secure token of length 64
    :param desired_token_length:
    :return:
    """
    bytes_length = int(desired_token_length / 4 * 3)
    token = secrets.token_urlsafe(bytes_length)  # return a URL-safe text string
    return token
