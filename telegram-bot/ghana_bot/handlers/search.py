from aiogram import Router
from aiogram.filters import Command, CommandObject
from aiogram.types import Message

from ghana_bot.services import messages

router = Router(name="search")


@router.message(Command("search"))
async def on_search(message: Message, command: CommandObject) -> None:
    await message.answer(messages.search_reply(command.args or ""))
