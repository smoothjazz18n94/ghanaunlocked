from aiogram.types import InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo


def open_app_keyboard(mini_app_url: str) -> InlineKeyboardMarkup | None:
    """Mini App buttons require HTTPS. Returns None when not configured/valid."""
    url = (mini_app_url or "").strip()
    if not url.lower().startswith("https://"):
        return None
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [InlineKeyboardButton(text="Open Ghana Unlocked", web_app=WebAppInfo(url=url))]
        ]
    )
