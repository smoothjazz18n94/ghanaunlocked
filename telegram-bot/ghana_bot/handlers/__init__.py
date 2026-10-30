from aiogram import Router

from ghana_bot.handlers import discover, help, search, start


def build_root_router() -> Router:
    root = Router(name="root")
    root.include_routers(start.router, help.router, search.router, discover.router)
    return root
