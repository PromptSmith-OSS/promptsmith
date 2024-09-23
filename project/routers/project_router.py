from typing import List

from django.db import models
from django.db.models import Q
from django.shortcuts import aget_list_or_404
from ninja import Router
from ninja.pagination import paginate
from ninja.throttling import AnonRateThrottle, AuthRateThrottle

from shared.auth import async_django_ninja_auth
from ..models import Project
from ..schemas.project import ProjectOutSchema

project_router = Router(
    tags=['Project'],
    throttle=[
        AnonRateThrottle('0/s'),
        AuthRateThrottle('100/s'),
    ],
    auth=async_django_ninja_auth
)


@project_router.get('', response=List[ProjectOutSchema])
@paginate
async def get_projects(request):
    user = request.auth
    projects_qs = (Project.objects.filter(organization__users=user).select_related('organization', 'created_by')
                   .annotate(
        orgniation_uuid=models.F('organization__uuid'),
        created_by_username=models.F('created_by__username'),
    ).

                   order_by('created_at').all())
    projects = await aget_list_or_404(projects_qs)
    return projects
