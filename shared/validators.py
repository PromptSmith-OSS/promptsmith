from django.db import models
from ninja.errors import ValidationError
import re


def validate_uppercase_letters(value):
    if not re.match(r'^[A-Z]+$', value):
        raise ValidationError([
            {
                'msg': 'Only uppercase letters are allowed',
                'type': 'value_error'
            }
        ])
