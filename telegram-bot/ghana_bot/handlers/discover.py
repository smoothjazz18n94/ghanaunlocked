from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message

from ghana_bot.services import messages

router = Router(name="discover")


@router.message(Command("discover"))
async def on_discover(message: Message) -> None:
    await message.answer(messages.discover_reply())
