import React, { useState, useEffect, useCallback } from "react";
import { createHandle, fetchPosts, createPost, updatePost, deletePost } from "./api";

/* ── Styles ─────────────────────────────────────────────────────────────── */

const styles = {
  body: {
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    maxWidth: 600,
    margin: "0 auto",
    padding: "24px 16px",
    background: "#f7f9fb",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: "#1a1a2e",
    margin: 0,
  },
  subtitle: {
    color: "#666",
    fontSize: 14,
    marginTop: 4,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: 8,
    fontSize: 15,
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: 8,
    fontSize: 15,
    resize: "vertical",
    minHeight: 80,
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  btnPrimary: {
    background: "#4361ee",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 15,
    cursor: "pointer",
    fontWeight: 600,
  },
  btnDanger: {
    background: "transparent",
    color: "#e63946",
    border: "1px solid #e63946",
    borderRadius: 6,
    padding: "4px 12px",
    fontSize: 13,
    cursor: "pointer",
  },
  btnSmall: {
    background: "transparent",
    color: "#4361ee",
    border: "1px solid #4361ee",
    borderRadius: 6,
    padding: "4px 12px",
    fontSize: 13,
    cursor: "pointer",
    marginRight: 8,
  },
  postAuthor: {
    fontWeight: 700,
    color: "#4361ee",
    marginRight: 8,
  },
  postTime: {
    fontSize: 12,
    color: "#999",
  },
  postContent: {
    margin: "8px 0",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  charCount: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  error: {
    color: "#e63946",
    fontSize: 14,
    marginTop: 8,
  },
  handleBadge: {
    display: "inline-block",
    background: "#eef1ff",
    color: "#4361ee",
    borderRadius: 20,
    padding: "4px 14px",
    fontSize: 14,
    fontWeight: 600,
  },
};

/* ── Handle Screen ──────────────────────────────────────────────────────── */

function HandleForm({ onLogin }) {
  const [handle, setHandle] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await createHandle(handle);
      onLogin(res.handle);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.card}>
      <h2 style={{ marginTop: 0 }}>Pick a handle</h2>
      <form onSubmit={submit}>
        <input
          style={styles.input}
          placeholder="@coolguy"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          maxLength={30}
        />
        <div style={{ marginTop: 12 }}>
          <button type="submit" style={styles.btnPrimary}>
            Join
          </button>
        </div>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

/* ── Compose Box ────────────────────────────────────────────────────────── */

function ComposeBox({ handle, onPosted }) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createPost(handle, content);
      setContent("");
      onPosted();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.card}>
      <form onSubmit={submit}>
        <textarea
          style={styles.textarea}
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={256}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <button
            type="submit"
            style={{
              ...styles.btnPrimary,
              opacity: content.trim().length === 0 ? 0.5 : 1,
            }}
            disabled={content.trim().length === 0}
          >
            Post
          </button>
          <span style={styles.charCount}>{content.length}/256</span>
        </div>
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

/* ── Single Post ────────────────────────────────────────────────────────── */

function Post({ post, currentHandle, onChanged }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.content);
  const [error, setError] = useState("");
  const isOwner = post.author === currentHandle;

  const save = async () => {
    setError("");
    try {
      await updatePost(currentHandle, post.id, draft);
      setEditing(false);
      onChanged();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async () => {
    setError("");
    try {
      await deletePost(currentHandle, post.id);
      onChanged();
    } catch (err) {
      setError(err.message);
    }
  };

  const ts = new Date(post.created_at).toLocaleString();
  const edited =
    post.updated_at !== post.created_at
      ? ` (edited ${new Date(post.updated_at).toLocaleString()})`
      : "";

  return (
    <div style={styles.card}>
      <div>
        <span style={styles.postAuthor}>{post.author}</span>
        <span style={styles.postTime}>
          {ts}
          {edited}
        </span>
      </div>
      {editing ? (
        <>
          <textarea
            style={{ ...styles.textarea, marginTop: 8 }}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={256}
          />
          <div style={{ marginTop: 8 }}>
            <button style={styles.btnSmall} onClick={save}>
              Save
            </button>
            <button
              style={styles.btnSmall}
              onClick={() => {
                setEditing(false);
                setDraft(post.content);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p style={styles.postContent}>{post.content}</p>
      )}
      {isOwner && !editing && (
        <div>
          <button
            style={styles.btnSmall}
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
          <button style={styles.btnDanger} onClick={remove}>
            Delete
          </button>
        </div>
      )}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

/* ── App ────────────────────────────────────────────────────────────────── */

export default function App() {
  const [handle, setHandle] = useState(null);
  const [posts, setPosts] = useState([]);

  const refresh = useCallback(async () => {
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch {
      /* silently retry next interval */
    }
  }, []);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  return (
    <div style={styles.body}>
      <header style={styles.header}>
        <h1 style={styles.title}>Posts</h1>
        <p style={styles.subtitle}>A micro-blogging platform</p>
        {handle && <span style={styles.handleBadge}>{handle}</span>}
      </header>

      {!handle ? (
        <HandleForm onLogin={setHandle} />
      ) : (
        <ComposeBox handle={handle} onPosted={refresh} />
      )}

      <div>
        {posts.map((p) => (
          <Post
            key={p.id}
            post={p}
            currentHandle={handle}
            onChanged={refresh}
          />
        ))}
        {posts.length === 0 && (
          <p style={{ textAlign: "center", color: "#999" }}>
            No posts yet. Be the first!
          </p>
        )}
      </div>
    </div>
  );
}
