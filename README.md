# Posts — A Micro-Blogging Platform

A lightweight Twitter-style app with a **FastAPI** backend and a **React** frontend, fully containerized with Docker.

## Architecture

```
┌──────────┐        ┌──────────┐
│ Frontend │ ──────▶│ Backend  │
│ (React)  │  HTTP  │ (FastAPI)│
│ :3000    │        │ :8000    │
└──────────┘        └──────────┘
```

- **Backend** – Python / FastAPI REST API (in-memory data store)
- **Frontend** – React SPA served via Nginx

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed

## Running Locally with Docker

From the repository root:

```bash
docker compose up --build
```

This builds both images and starts the containers. Once everything is up:

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000       |
| Backend  | http://localhost:8000       |
| API Docs | http://localhost:8000/docs  |

To stop the app:

```bash
docker compose down
```

## How to Use

1. Open **http://localhost:3000** in your browser.
2. Enter a handle (e.g. `@coolguy`) and click **Join**.
3. Write a post (up to 256 characters) and click **Post**.
4. Your post appears in the global feed. You can **Edit** or **Delete** your own posts.

## API Endpoints

| Method   | Path               | Description               |
|----------|--------------------|---------------------------|
| `POST`   | `/handles`         | Create/register a handle  |
| `GET`    | `/posts`           | List all posts (newest first) |
| `POST`   | `/posts`           | Create a new post         |
| `GET`    | `/posts/{post_id}` | Get a single post         |
| `PUT`    | `/posts/{post_id}` | Edit a post               |
| `DELETE` | `/posts/{post_id}` | Delete a post             |

Authenticated endpoints require the `X-Handle` header (e.g. `X-Handle: @coolguy`).

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application & routes
│   │   ├── models.py         # Pydantic request/response models
│   │   └── store.py          # In-memory data store
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api.js            # API client functions
│   │   ├── App.js            # Main React component
│   │   └── index.js          # Entry point
│   ├── .env
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
└── README.md
```
