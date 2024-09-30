from datetime import datetime

from ninja import Schema
from pydantic import constr


class PublicKeyOutSchema(Schema):
    key: constr(max_length=4096)
    created_at: datetime
