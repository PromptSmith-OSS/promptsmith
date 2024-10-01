from typing import List

from django.db import models
from django.shortcuts import aget_object_or_404, aget_list_or_404
# import 404 error
from ninja import Router
from ninja.pagination import paginate

from core.models import APIKey
from core.schemas.key import APIKeyOutSchema, APIKeyInSchema

key_router = Router(
    tags=['API Key'],
)


@key_router.get('', response=List[APIKeyOutSchema])
@paginate
async def get_all_keys(request, ):
    """
    Get all keys for the project
    """
    project_uuid = request.auth.project.uuid
    qs = APIKey.objects.filter(
        project__uuid=project_uuid
    ).filter(
        is_private=False
    ).order_by(
        '-created_at'
    ).select_related('project','created_by')
    results = await aget_list_or_404(qs)
    return results


@key_router.delete('/uuid', response=APIKeyOutSchema)
async def delete_key(request, uuid: str):
    """
    Delete the key by uuid
    And it will be invalidated
    """
    project_uuid = request.auth.project.uuid
    qs = APIKey.objects.filter(uuid=uuid, project__uuid=project_uuid)
    obj = await aget_object_or_404(qs)
    await obj.delete()
    return {'status': 'deleted'}


@key_router.post('', response=APIKeyOutSchema)
async def create_key(request, key: APIKeyInSchema):
    """
    Create a new key
    """
    return await APIKey.objects.acreate(
        project=request.auth.project,
        created_by=request.auth.user,
        **key.dict()
    )
