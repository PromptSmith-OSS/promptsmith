from django.core.cache import cache
import functools

from django.utils.decorators import method_decorator

from django.core.cache import cache
from asgiref.sync import sync_to_async


def cache_result(ttl=60):
    def decorator(func):
        def wrapper(*args, **kwargs):
            cache_key = f"cache_{func.__name__}_{args}_{kwargs}"
            result = cache.get(cache_key)
            if result is not None:
                return result

            result = func(*args, **kwargs)
            cache.set(cache_key, result, ttl)
            return result

        return wrapper

    return decorator


def async_cache_result(ttl=60):
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            cache_key = f"cache_{func.__name__}_{args}_{kwargs}"

            # Check if the key exists in the cache
            if await cache.ahas_key(cache_key):
                return await cache.aget(cache_key)

            # Call the original async function
            result = await func(*args, **kwargs)

            # Cache the result
            await cache.aset(cache_key, result, ttl)
            return result

        return wrapper
    return decorator

