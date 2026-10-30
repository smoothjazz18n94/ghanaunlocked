"""Telegram Mini App initData validation (PREPARED, not yet wired to any route).

Authentication rule for this project: the backend NEVER trusts a Telegram user ID
sent by the frontend. The frontend sends the raw `initData` string; the backend
verifies its HMAC signature with the bot token and only then reads the user.

Algorithm: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
A later task will add a FastAPI dependency that calls `validate_init_data`.
"""
import hashlib
import hmac
import json
import time
from dataclasses import dataclass
from urllib.parse import parse_qsl


class InitDataError(ValueError):
    """initData is missing, malformed, tampered with, or expired."""


@dataclass(frozen=True)
class ValidatedInitData:
    user: dict
    auth_date: int
    raw: dict[str, str]


def validate_init_data(
    init_data: str, bot_token: str, *, max_age_seconds: int = 86400, now: float | None = None
) -> ValidatedInitData:
    if not init_data or not bot_token:
        raise InitDataError("Missing initData or bot token.")

    pairs = dict(parse_qsl(init_data, keep_blank_values=True))
    received_hash = pairs.pop("hash", None)
    if not received_hash:
        raise InitDataError("initData has no hash.")

    data_check_string = "\n".join(f"{k}={v}" for k, v in sorted(pairs.items()))
    secret_key = hmac.new(b"WebAppData", bot_token.encode(), hashlib.sha256).digest()
    expected = hmac.new(secret_key, data_check_string.encode(), hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected, received_hash):
        raise InitDataError("initData signature is invalid.")

    try:
        auth_date = int(pairs["auth_date"])
    except (KeyError, ValueError) as exc:
        raise InitDataError("initData has no valid auth_date.") from exc

    current = time.time() if now is None else now
    if current - auth_date > max_age_seconds:
        raise InitDataError("initData has expired.")

    try:
        user = json.loads(pairs.get("user", "{}"))
    except json.JSONDecodeError as exc:
        raise InitDataError("initData user is not valid JSON.") from exc

    return ValidatedInitData(user=user, auth_date=auth_date, raw=pairs)
