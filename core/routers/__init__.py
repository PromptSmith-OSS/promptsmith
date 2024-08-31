from ninja import Router

from .prompt import prompt_router

core_router = Router()

core_router.add_router("/prompt/", prompt_router)
