from django.core.cache import cache
import functools


def async_cache(ttl=60):
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
