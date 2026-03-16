from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware

from app.models import HandleCreate, HandleResponse, PostCreate, PostUpdate, PostResponse
from app import store

app = FastAPI(title="Posts API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Handles ──────────────────────────────────────────────────────────────────

@app.post("/handles", response_model=HandleResponse, status_code=201)
def create_handle(body: HandleCreate):
    normalized = body.handle if body.handle.startswith("@") else f"@{body.handle}"
    if store.handle_exists(normalized):
        raise HTTPException(status_code=409, detail="Handle already taken")
    handle = store.create_handle(normalized)
    return HandleResponse(handle=handle)


# ── Posts ────────────────────────────────────────────────────────────────────

def _get_current_handle(x_handle: str | None = Header(None)) -> str:
    if not x_handle:
        raise HTTPException(status_code=401, detail="X-Handle header is required")
    if not store.handle_exists(x_handle):
        raise HTTPException(status_code=401, detail="Unknown handle")
    return x_handle


@app.get("/posts", response_model=list[PostResponse])
def list_posts():
    return store.get_all_posts()


@app.post("/posts", response_model=PostResponse, status_code=201)
def create_post(body: PostCreate, x_handle: str | None = Header(None)):
    handle = _get_current_handle(x_handle)
    post = store.create_post(author=handle, content=body.content)
    return post


@app.get("/posts/{post_id}", response_model=PostResponse)
def get_post(post_id: str):
    post = store.get_post(post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return post


@app.put("/posts/{post_id}", response_model=PostResponse)
def update_post(post_id: str, body: PostUpdate, x_handle: str | None = Header(None)):
    handle = _get_current_handle(x_handle)
    post = store.get_post(post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    if post["author"] != handle:
        raise HTTPException(status_code=403, detail="You can only edit your own posts")
    updated = store.update_post(post_id, body.content)
    return updated


@app.delete("/posts/{post_id}", status_code=204)
def delete_post(post_id: str, x_handle: str | None = Header(None)):
    handle = _get_current_handle(x_handle)
    post = store.get_post(post_id)
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    if post["author"] != handle:
        raise HTTPException(status_code=403, detail="You can only delete your own posts")
    store.delete_post(post_id)
