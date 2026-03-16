from pydantic import BaseModel, Field


class HandleCreate(BaseModel):
    handle: str = Field(
        ..., min_length=2, max_length=30, pattern=r"^@?[a-zA-Z0-9_]+$"
    )


class HandleResponse(BaseModel):
    handle: str


class PostCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=256)


class PostUpdate(BaseModel):
    content: str = Field(..., min_length=1, max_length=256)


class PostResponse(BaseModel):
    id: str
    author: str
    content: str
    created_at: str
    updated_at: str
