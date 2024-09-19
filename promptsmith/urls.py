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
from django.urls import path, include, re_path
from .api import api
from allauth.headless.account.views import SignupView, LoginView
from django.http import JsonResponse
from django.conf import settings

from django.middleware.csrf import get_token


def get_csrf_token_view(request, client):
    # Ensure the CSRF token is set
    get_token(request)

    return JsonResponse({
        "status": "ok",
        "client": client,  # Include the client parameter in the response
    },
        status=200,
    )


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


def not_found_view(request, *args, **kwargs):
    return JsonResponse(
        {'error': 'Not found'},
        status=404  # Or another appropriate status code
    )


from django.http import JsonResponse


def unsupported_view(request, *args, **kwargs):
    return JsonResponse(
        {'error': 'Unsupported'},
        status=405  # Or another appropriate status code
    )


urlpatterns = [
    path("api/", api.urls),

    # Even when using headless, the third-party provider endpoints are stil
    # needed for handling e.g. the OAuth handshake. The account views
    # can be disabled using `HEADLESS_ONLY = True`.
    path("accounts/", include("allauth.urls")),

    # override url start with 'app' to unsupported
    # re_path(r'^auth/app/.*$', unsupported_view),  # disable app related url for now

    path("auth/browser/v1/config", overrider_configuration_view),

    re_path(r'^auth/(?P<client>browser|app)/init/$', get_csrf_token_view),

    # Include the API endpoints:
    path("auth/", include("allauth.headless.urls")),

]

if settings.DEBUG:
    urlpatterns += [
        path("admin/", admin.site.urls),
    ]

urlpatterns += [
    # Catch all other URLs and return a RESTful 404
    re_path(r".*", not_found_view),
]
