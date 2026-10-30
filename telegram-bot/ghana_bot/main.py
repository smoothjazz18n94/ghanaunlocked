"""Entry point. Run from telegram-bot/ with:  python -m ghana_bot.main

Uses long polling (free, no public URL needed for development).
Webhook mode can be added later when the backend is deployed.
"""
import asyncio
import logging

from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties

from ghana_bot.config import get_settings
from ghana_bot.handlers import build_root_router


def build_dispatcher() -> Dispatcher:
    dp = Dispatcher()
    dp.include_router(build_root_router())
    return dp


async def run() -> None:
    settings = get_settings()
    logging.basicConfig(
        level=settings.log_level.upper(),
        format="%(asctime)s %(levelname)-8s %(name)s: %(message)s",
    )
    bot = Bot(token=settings.bot_token.get_secret_value(), default=DefaultBotProperties())
    dp = build_dispatcher()
    logging.getLogger(__name__).info("Starting bot polling")
    try:
        await dp.start_polling(bot)
    finally:
        await bot.session.close()


def main() -> None:
    try:
        get_settings()
    except Exception:
        raise SystemExit(
            "BOT_TOKEN is not set. Copy telegram-bot/.env.example to telegram-bot/.env "
            "and add the token from BotFather."
        )
    asyncio.run(run())


if __name__ == "__main__":
    main()
