from ninja.errors import ValidationError


def raise_duplication_error(field: str, value: str) -> ValidationError:
    return ValidationError([{'type': 'duplication', field: value, 'msg': f'{field} already exists'}])
