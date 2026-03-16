"""In-memory data store for posts and handles."""

import uuid
from datetime import datetime, timezone

_handles: set[str] = set()
_posts: list[dict] = []


# ── Handles ──────────────────────────────────────────────────────────────────

def handle_exists(handle: str) -> bool:
    return handle in _handles


def create_handle(handle: str) -> str:
    normalized = handle if handle.startswith("@") else f"@{handle}"
    _handles.add(normalized)
    return normalized


# ── Posts ────────────────────────────────────────────────────────────────────

def get_all_posts() -> list[dict]:
    return sorted(_posts, key=lambda p: p["created_at"], reverse=True)


def get_post(post_id: str) -> dict | None:
    return next((p for p in _posts if p["id"] == post_id), None)


def create_post(author: str, content: str) -> dict:
    now = datetime.now(timezone.utc).isoformat()
    post = {
        "id": str(uuid.uuid4()),
        "author": author,
        "content": content,
        "created_at": now,
        "updated_at": now,
    }
    _posts.append(post)
    return post


def update_post(post_id: str, content: str) -> dict | None:
    post = get_post(post_id)
    if post is None:
        return None
    post["content"] = content
    post["updated_at"] = datetime.now(timezone.utc).isoformat()
    return post


def delete_post(post_id: str) -> bool:
    post = get_post(post_id)
    if post is None:
        return False
    _posts.remove(post)
    return True
