from typing import List

from django.db.models import QuerySet


async def convert_query_set_to_list(query_set: QuerySet) -> List[dict]:
    """
    Convert a queryset to a list
    Because django queryset cannot be used to return as List[dict] directly
    :param query_set:
    :return:
    """
    return [
        item
        async for item in query_set
    ]
