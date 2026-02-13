# Task Management System

Full-stack task manager with collaboration, real-time notifications, analytics, dark mode, and attachments.

## Implemented Features

- Authentication
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - JWT-protected task, analytics, and notification routes

- Collaborative tasks
  - Tasks have `owner` and `sharedWith`
  - Owner can share task with another user: `PUT /api/tasks/:id/share`
  - Shared-user task feed: `GET /api/tasks/shared`

- Real-time notifications (Socket.IO)
  - Share notification when task is shared
  - Status notification when task status changes
  - Persistent notification history in MongoDB

- Analytics dashboard
  - `GET /api/analytics/overview`
  - `GET /api/analytics/trends?range=weekly|monthly`
  - Status breakdown pie chart + completed vs overdue trend chart

- Final enhancements
  - Dark mode toggle
  - Attachments support (base64 upload, stored under `/uploads`)
  - Mobile-responsive UI

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Socket.IO
- Frontend: React, Tailwind CSS, Axios, Recharts, Socket.IO Client

## Project Structure

- `task-manager/backend`
- `task-manager/frontend`

## Environment Variables

Backend `.env` (inside `task-manager/backend`):

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
PORT=4000
FRONTEND_URL=http://localhost:5173
```

Frontend `.env` (inside `task-manager/frontend`, optional):

```env
VITE_API_URL=http://localhost:4000/api
```

## Local Setup

1. Backend

```bash
cd task-manager/backend
npm install
npm run dev
```

2. Frontend

```bash
cd task-manager/frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:4000` by default.

## API Reference

### Auth

- `POST /api/auth/register`
  - Body:

```json
{
  "name": "Ali",
  "email": "ali@example.com",
  "password": "123456"
}
```

- `POST /api/auth/login`
  - Body:

```json
{
  "email": "ali@example.com",
  "password": "123456"
}
```

### Tasks

- `GET /api/tasks` (owned + shared)
- `GET /api/tasks/shared`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id` (owner only)
- `PUT /api/tasks/:id/share` (owner only)

Example create/update payload with attachment:

```json
{
  "title": "Prepare sprint demo",
  "description": "Slides and test run",
  "status": "In Progress",
  "dueDate": "2026-02-14",
  "attachment": {
    "fileName": "demo-plan.pdf",
    "fileType": "application/pdf",
    "size": 15230,
    "contentBase64": "..."
  }
}
```

### Notifications

- `GET /api/notifications`
- `PUT /api/notifications/:id/read`
- `PUT /api/notifications/read-all`

### Analytics

- `GET /api/analytics/overview`
- `GET /api/analytics/trends?range=weekly`
- `GET /api/analytics/trends?range=monthly`

## Deployment (Single Live URL)

Recommended: Render (backend + static frontend in one service) or Render backend + Vercel frontend.

Option A (single service on Render):

1. Build frontend: `npm run build` inside `task-manager/frontend`
2. Serve frontend build from backend (optional extension step)
3. Deploy backend service and expose `/api/*` and static frontend route from same host

Option B (Vercel + Render):

1. Deploy backend on Render
2. Deploy frontend on Vercel
3. Set `VITE_API_URL` to backend URL + `/api`
4. Set backend `FRONTEND_URL` to Vercel domain

## End-to-End Checklist

- Register two users
- User A creates task and shares with User B
- User B receives real-time share notification
- User B updates task status
- User A receives real-time status notification
- Analytics dashboard updates with status/trends
- Dark mode and attachments verified on desktop/mobile

## Submission Checklist

- GitHub repository updated
- Live project URL
- README with setup + API documentation
- Dashboard screenshots
- Video walkthrough
