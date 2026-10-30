from aiogram import Router
from aiogram.filters import CommandStart
from aiogram.types import Message

from ghana_bot.config import get_settings
from ghana_bot.keyboards import open_app_keyboard
from ghana_bot.services import messages

router = Router(name="start")


@router.message(CommandStart())
async def on_start(message: Message) -> None:
    keyboard = open_app_keyboard(get_settings().mini_app_url)
    await message.answer(messages.WELCOME, reply_markup=keyboard)
