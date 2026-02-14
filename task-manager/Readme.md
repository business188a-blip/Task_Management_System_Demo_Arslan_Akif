# Task Management System (MERN) - Enhanced Phase (Weeks 4-6)

Project phase covers collaboration, analytics, deployment readiness, and final polishing.

- Duration: Weeks 4-6
- Final submission date: February 15, 2026 (11:59 PM PKT)

## Overview

This application supports multi-user task management with real-time notifications, analytics insights, and production-ready deployment flow.

Core features:
- JWT authentication and protected APIs
- Task CRUD with collaboration (`owner` + `sharedWith`)
- Real-time and persisted notifications
- Analytics dashboard with weekly/monthly trends
- Dark mode, attachments, and responsive layout

## Requirement Mapping (Your Weekly Plan)

### Week 4 - Collaborative Features & Real-Time Notifications

1. User collaboration
- Database schema includes `owner` and `sharedWith` in `backend/models/taskModel.js`
- Implemented endpoints:
- `PUT /api/tasks/:id/share` (share with another user)
- `GET /api/tasks/shared` (retrieve tasks shared with current user)

2. Real-time notifications
- Socket.IO implemented in `backend/server.js` and `frontend/src/components/TaskList.jsx`
- Notifications are triggered when:
- a task is shared
- a task status changes
- Past notifications endpoint:
- `GET /api/notifications`

3. Frontend integration
- Share flow implemented from task item actions (`frontend/src/components/TaskItem.jsx` and `frontend/src/components/TaskList.jsx`)
- Notifications shown in sidebar/panel (`frontend/src/components/Notifications.jsx`)

4. Testing & error handling (functional safeguards)
- Only owners can share tasks
- Shared users can only update task status
- Invalid share attempts are handled with API errors (self-share, invalid user ID, already shared, unauthorized)

Deliverables status:
- Real-time notifications across users: Implemented
- Task sharing: Implemented
- Updated schema + APIs: Implemented
- Code pushed to GitHub: Submit with your final repo link

### Week 5 - Advanced Analytics & Reporting

1. Analytics dashboard
- Dashboard includes:
- totals (total/completed/pending/overdue)
- weekly/monthly completed vs overdue trends
- status breakdown (Pending/In Progress/Completed)
- UI charts are custom visual components bound to backend data

2. Backend enhancements
- Implemented endpoints:
- `GET /api/analytics/overview`
- `GET /api/analytics/trends?range=weekly|monthly`

3. Frontend integration
- Dashboard fetches dynamic backend data (`frontend/src/components/Dashboard.jsx`)
- Range switcher supports weekly/monthly views

4. Data optimization
- MongoDB Aggregation Framework used in analytics controller (`backend/controllers/analyticsController.js`)
- API returns compact summary and trend arrays for fast rendering

Deliverables status:
- Functional analytics dashboard: Implemented
- Analytics endpoints: Implemented
- Optimized queries: Implemented via aggregation
- Dashboard screenshots to upload: `task-manager/docs/screenshots/`

### Week 6 - Deployment, Documentation & Final Enhancements

1. Deployment
- Deployment configs included (`task-manager/render.yaml`, `task-manager/frontend/vercel.json`)
- Recommended final target: one live URL where frontend and backend are both accessible

2. Final enhancements
- Dark mode toggle: Implemented
- Task attachments: Implemented (uploaded to `backend/uploads`, served via `/uploads`)
- Mobile responsiveness: Implemented with responsive layout classes and CSS

3. Documentation
- This README includes setup, API docs, feature mapping, and submission checklist

4. Testing
- End-to-end scenario checklist included below for final validation

Deliverables status:
- Live deployed URL: add before submission
- Complete README: Implemented
- Dark mode + attachments: Implemented
- Video walkthrough: add before submission

## Tech Stack

- Frontend: React (Vite), Axios, Socket.IO Client
- Styling: Tailwind utility classes + custom CSS
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Socket.IO

## Project Structure

```text
task-manager/
  backend/
    controllers/
    middleware/
    models/
    routes/
    server.js
    uploads/
  frontend/
    src/
      components/
      App.jsx
      api.js
      index.css
  docs/
    screenshots/
    walkthrough/
```

## Environment Variables

Create `task-manager/backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=4000
FRONTEND_URL=http://localhost:5173
```

Create `task-manager/frontend/.env`:

```env
VITE_API_URL=http://localhost:4000/api
```

## Local Setup

Backend:

```bash
cd task-manager/backend
npm install
npm run dev
```

Frontend:

```bash
cd task-manager/frontend
npm install
npm run dev
```

Defaults:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## API Documentation

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

Example:

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"user@example.com\",\"password\":\"123456\"}"
```

### Tasks

- `GET /api/tasks` (owned + shared)
- `GET /api/tasks/shared`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PUT /api/tasks/:id/share`

Share example:

```bash
curl -X PUT http://localhost:4000/api/tasks/<TASK_ID>/share \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d "{\"userId\":\"<RECIPIENT_USER_ID>\"}"
```

### Notifications

- `GET /api/notifications`
- `PUT /api/notifications/:id/read`
- `PUT /api/notifications/read-all`

### Analytics

- `GET /api/analytics/overview`
- `GET /api/analytics/trends?range=weekly|monthly`

Trend example:

```bash
curl "http://localhost:4000/api/analytics/trends?range=weekly" \
  -H "Authorization: Bearer <TOKEN>"
```

## End-to-End Testing Checklist

- Register User A and User B
- Login as User A and create task
- Share task to User B
- Confirm User B receives share notification
- Login as User B and update task status
- Confirm User A receives status-change notification
- Open analytics and verify weekly/monthly trends
- Verify dark mode toggle
- Verify attachment upload and file access
- Verify mobile layout behavior

## Deployment Notes

- Option A: Render single service (backend serves frontend build in production)
- Option B: Render backend + Vercel frontend (set correct CORS and `VITE_API_URL`)

## Final Submission Checklist

- GitHub repo link: `PASTE_REPO_LINK_HERE`
- Live URL (single accessible link): `PASTE_LIVE_URL_HERE`
- Video walkthrough URL: `PASTE_VIDEO_LINK_HERE`
- Dashboard screenshots in `task-manager/docs/screenshots/`

## Evaluation Criteria Alignment

- Feature implementation: covered (sharing, notifications, analytics, dark mode, attachments)
- Performance: aggregation-based analytics + lightweight API responses + responsive UI
- Documentation: this README plus structured codebase
- Deployment: finalize with one live link before final submission
