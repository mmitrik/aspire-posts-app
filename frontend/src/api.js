const API_BASE = window.__RUNTIME_CONFIG__?.API_URL || process.env.REACT_APP_API_URL || "http://localhost:8000";

export async function createHandle(handle) {
  const res = await fetch(`${API_BASE}/handles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ handle }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to create handle");
  }
  return res.json();
}

export async function fetchPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function createPost(handle, content) {
  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Handle": handle,
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to create post");
  }
  return res.json();
}

export async function updatePost(handle, postId, content) {
  const res = await fetch(`${API_BASE}/posts/${encodeURIComponent(postId)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Handle": handle,
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to update post");
  }
  return res.json();
}

export async function deletePost(handle, postId) {
  const res = await fetch(`${API_BASE}/posts/${encodeURIComponent(postId)}`, {
    method: "DELETE",
    headers: { "X-Handle": handle },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to delete post");
  }
}
