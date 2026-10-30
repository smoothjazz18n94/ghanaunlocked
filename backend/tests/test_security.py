import hashlib
import hmac
import json
import time
from urllib.parse import urlencode

import pytest

from app.core.security import InitDataError, validate_init_data

TOKEN = "123456:TEST-TOKEN"


def make_init_data(token=TOKEN, auth_date=None, user=None):
    fields = {
        "auth_date": str(auth_date or int(time.time())),
        "query_id": "AAH",
        "user": json.dumps(user or {"id": 42, "first_name": "Ama"}),
    }
    dcs = "\n".join(f"{k}={v}" for k, v in sorted(fields.items()))
    secret = hmac.new(b"WebAppData", token.encode(), hashlib.sha256).digest()
    fields["hash"] = hmac.new(secret, dcs.encode(), hashlib.sha256).hexdigest()
    return urlencode(fields)


def test_valid_init_data():
    result = validate_init_data(make_init_data(), TOKEN)
    assert result.user["id"] == 42


def test_wrong_token_rejected():
    with pytest.raises(InitDataError):
        validate_init_data(make_init_data(), "999:OTHER")


def test_tampered_user_rejected():
    tampered = make_init_data().replace("42", "43")
    with pytest.raises(InitDataError):
        validate_init_data(tampered, TOKEN)


def test_expired_rejected():
    old = make_init_data(auth_date=int(time.time()) - 10 * 86400)
    with pytest.raises(InitDataError):
        validate_init_data(old, TOKEN)


def test_missing_rejected():
    with pytest.raises(InitDataError):
        validate_init_data("", TOKEN)
