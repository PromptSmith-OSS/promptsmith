from .settings import *

# use dump cache when debug
if DEBUG or RUNNING_DEVELOPMENT_SERVER:
    CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.dummy.DummyCache",
        }
    }
    SESSION_ENGINE = "django.contrib.sessions.backends.file"
