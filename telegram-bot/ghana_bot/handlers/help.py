from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message

from ghana_bot.services import messages

router = Router(name="help")


@router.message(Command("help"))
async def on_help(message: Message) -> None:
    await message.answer(messages.HELP)
