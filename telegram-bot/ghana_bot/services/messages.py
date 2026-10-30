"""User-facing text and placeholder 'business logic'.

Handlers stay thin: they parse the Telegram update and call these functions.
Real discovery/search logic arrives in later tasks and will live in services/,
never inside handlers.
"""

WELCOME = (
    "Welcome to Ghana Unlocked.\n\n"
    "Find trusted places, services and businesses in Accra and Kumasi.\n\n"
    "Use /help to see what I can do."
)

HELP = (
    "Here's what you can do:\n\n"
    "/start - Welcome message\n"
    "/help - Show this list\n"
    "/search <what you need> - Search (coming soon)\n"
    "/discover - Browse what's nearby (coming soon)"
)

DISCOVER_COMING_SOON = (
    "Discovery is coming soon. We're starting with Accra and Kumasi."
)


def search_reply(query: str) -> str:
    query = query.strip()
    if not query:
        return "Tell me what you're looking for, for example: /search plumber in Kumasi"
    return f"Search is coming soon. You asked for: {query}"


def discover_reply() -> str:
    return DISCOVER_COMING_SOON
