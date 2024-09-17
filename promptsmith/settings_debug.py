from .settings import *

# use dump cache when debug
if DEBUG or RUNNING_DEVELOPMENT_SERVER:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.dummy.DummyCache",
        }
    }
    SESSION_ENGINE = "django.contrib.sessions.backends.file"


    CSRF_COOKIE_SECURE = False # not using https

    ACCOUNT_EMAIL_VERIFICATION = 'none'
    CSRF_COOKIE_DOMAIN = 'localhost'

