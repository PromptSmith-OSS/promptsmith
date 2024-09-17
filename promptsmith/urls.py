"""
URL configuration for promptsmith project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from .api import api
from allauth.headless.account.views import SignupView, LoginView
from django.http import JsonResponse
from django.conf import settings


def get_csrf_token_view(request):
    return JsonResponse({
        "status": "ok",
    }, status=200)


def overrider_configuration_view(request):
    """
    Do not expose all auth headless congifuration to the public
    Even there is no sensitive data, it is better to hide it
    :param request:
    :return:
    """
    data = {
        "status": "ok"
    }
    # Return the response with a 200 OK status
    return JsonResponse(data, status=200)


urlpatterns = [
    path("api/", api.urls),

    # Even when using headless, the third-party provider endpoints are stil
    # needed for handling e.g. the OAuth handshake. The account views
    # can be disabled using `HEADLESS_ONLY = True`.
    path("accounts/", include("allauth.urls")),

    path("auth/browser/v1/config", overrider_configuration_view),
    path("auth/app/v1/config", overrider_configuration_view),

    path("auth/browser/init/", get_csrf_token_view),

    # Include the API endpoints:
    path("auth/", include("allauth.headless.urls")),
]

if settings.DEBUG:
    urlpatterns += [
        path("admin/", admin.site.urls),
    ]
