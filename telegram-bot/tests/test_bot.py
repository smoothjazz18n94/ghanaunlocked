import asyncio
from unittest.mock import AsyncMock

import pytest
from aiogram.filters import CommandObject
from pydantic import ValidationError

from ghana_bot.config import Settings, get_settings
from ghana_bot.handlers import discover, help as help_handler, search, start
from ghana_bot.keyboards import open_app_keyboard
from ghana_bot.main import build_dispatcher
from ghana_bot.services import messages


def run(coro):
    return asyncio.run(coro)


def test_search_reply_logic():
    assert "coming soon" in messages.search_reply("plumber").lower()
    assert "plumber" in messages.search_reply("plumber")
    assert "/search" in messages.search_reply("   ")


def test_keyboard_requires_https():
    assert open_app_keyboard("") is None
    assert open_app_keyboard("http://insecure.example") is None
    kb = open_app_keyboard("https://ghana-unlocked.vercel.app")
    assert kb.inline_keyboard[0][0].web_app.url == "https://ghana-unlocked.vercel.app"


def test_start_without_mini_app_url_sends_no_button():
    msg = AsyncMock()
    run(start.on_start(msg))
    args, kwargs = msg.answer.call_args
    assert args[0] == messages.WELCOME
    assert kwargs["reply_markup"] is None


def test_start_with_mini_app_url_sends_button(monkeypatch):
    monkeypatch.setenv("MINI_APP_URL", "https://ghana-unlocked.vercel.app")
    get_settings.cache_clear()
    msg = AsyncMock()
    run(start.on_start(msg))
    assert msg.answer.call_args.kwargs["reply_markup"] is not None


def test_help_search_discover_handlers():
    msg = AsyncMock()
    run(help_handler.on_help(msg))
    assert msg.answer.call_args.args[0] == messages.HELP

    msg = AsyncMock()
    run(search.on_search(msg, CommandObject(command="search", args="chop bar Accra")))
    assert "chop bar Accra" in msg.answer.call_args.args[0]

    msg = AsyncMock()
    run(search.on_search(msg, CommandObject(command="search", args=None)))
    assert "/search" in msg.answer.call_args.args[0]

    msg = AsyncMock()
    run(discover.on_discover(msg))
    assert "coming soon" in msg.answer.call_args.args[0].lower()


def test_dispatcher_builds_with_all_routers():
    dp = build_dispatcher()
    names = {r.name for r in dp.sub_routers[0].sub_routers}
    assert names == {"start", "help", "search", "discover"}


def test_missing_token_fails_loudly(monkeypatch):
    monkeypatch.delenv("BOT_TOKEN", raising=False)
    with pytest.raises(ValidationError):
        Settings(_env_file=None)


def test_token_not_exposed_in_repr():
    assert "FAKE-TEST-TOKEN" not in repr(get_settings())
