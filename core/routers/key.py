from django.db import models
from django.shortcuts import aget_object_or_404, aget_list_or_404
# import 404 error
from ninja import Router

from core.models import ClientPublicKey
from core.schemas.sdk import PromptSchema

key_router = Router(
    tags=['API Key'],
)


@key_router.get('/public-key', response=PromptSchema)
async def get_all_keys(request, ):
    """
    Get all keys for the project
    """
    project_uuid = request.auth.project.uuid
    qs = ClientPublicKey.objects.filter(
        project__uuid=project_uuid
    ).annotate(
        project_uuid=models.F('project__uuid'),
    )
    results = await aget_list_or_404(qs)
    return results


@key_router.delete('/public-key/uuid', response=PromptSchema)
async def delete_key(request, uuid: str):
    """
    Delete the key by uuid
    And it will be invalidated
    """
    project_uuid = request.auth.project.uuid
    qs = ClientPublicKey.objects.filter(uuid=uuid, project__uuid=project_uuid)
    obj = await aget_object_or_404(qs)
    await obj.delete()
    return {'status': 'deleted'}


@key_router.post('/public-key', response=PromptSchema)
async def create_key(request):
    """
    Create a new key
    """
    return await ClientPublicKey.objects.acreate(
        project=request.auth.project,
        created_by=request.auth.user,
    )
