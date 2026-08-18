# Pyramid - Task Management System

Pyramid is a task manager built for the Full Stack Developer assessment. It follows the given Figma design and includes a Kanban board, a list view, a task detail page, projects, light/dark themes with accent colors, guest login, and Google login.

---

## Tech stack

- Frontend (`apps/web`): Next.js (App Router), TypeScript, Tailwind CSS v4, lucide-react.
- Backend (`apps/api`): NestJS, Mongoose, JWT.
- Database: MongoDB.
- The project is a monorepo managed with npm workspaces.

---

## Features

- Login: "Continue as Guest" works right away. "Login with Google" uses real Google sign-in.
- Board view: tasks in columns (To Do, Doing, Completed, On Hold). Drag a card to another column to change its status.
- List view: the same tasks in a table, grouped by status.
- Fields button: switch between List and Board, and pick which fields show (Priority, Members, Due Date, Labels, Status, Reporter).
- Search tasks by title, and filter by priority.
- Task detail page: edit the title and description, add labels, links, subtasks, and comments with replies. A side panel sets status, priority, members, dates, teams, and reporter, and every change is logged in an activity feed.
- Projects: a projects list. Open a project to see its tasks.
- Settings: Profile, Theme, and Color pages.
- Themes: light/dark mode and 6 accent colors (Amber, Blue, Pink, Rose, Emerald, Black). Your choice is saved and stays after a refresh.
- Responsive: works on desktop, tablet, and mobile. On small screens the sidebar becomes a slide-in drawer.

---

## Folder structure

```
ablespace/
├── apps/
│   ├── api/                         # NestJS Backend
│   │   └── src/
│   │       ├── auth/                # Guest + Google login, JWT guard
│   │       ├── users/               # User schema and profile endpoints
│   │       ├── tasks/               # Task schema, DTOs, CRUD, comments
│   │       ├── projects/            # Project schema, DTOs, CRUD
│   │       ├── common/              # Shared constants (statuses, priorities)
│   │       ├── app.module.ts        # Root application module configuration
│   │       └── main.ts              # Server entry point & port configuration
│   │
│   └── web/                         # Next.js Frontend
│       └── src/
│           ├── app/                 # Pages (login, tasks, projects, settings)
│           ├── components/          # UI, layout, tasks, task-detail, projects
│           └── lib/                 # API client, contexts, types, utils
│
├── package.json                     # Monorepo workspaces & shared scripts
└── README.md                        # Documentation & setup instructions
```

---

## Getting started

You need Node.js 20+ and MongoDB (a local install, or a free MongoDB Atlas database).

1. Install everything from the repo root:

```bash
npm install
```

2. Add two `.env` files.

`apps/api/.env` (a sample is in `apps/api/.env.example`):

```
PORT=4000
MONGO_URL=mongodb://127.0.0.1:27017/ablespace
JWT_SECRET=change_this_to_a_long_random_string
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
```

`apps/web/.env` (a sample is in `apps/web/.env.example`):

```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

If you use MongoDB Atlas, add your computer's IP to the cluster's IP Access List, or the backend can't connect.

3. Start both apps in two terminals (from the repo root):

```bash
npm run dev:api
```

```bash
npm run dev:web
```

Open http://localhost:3000 and click "Continue as Guest".

---

## Google login (optional)

1. In the Google Cloud Console, create an OAuth Client ID of type "Web application".
2. Add `http://localhost:3000` under Authorized JavaScript origins.
3. Put that client ID in `GOOGLE_CLIENT_ID` (`apps/api/.env`) and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (`apps/web/.env`). Use the same value in both.

Guest login works without this.

---

## How it works

- Login returns a token (JWT). The frontend saves it and sends it with every request. A guard on the backend checks the token, and each user only sees their own data.
- Google login sends a Google token to the backend. The backend checks it with Google, then finds or creates the user.
- Drag and drop uses the browser's built-in drag events, no extra library.
- Shared UI pieces live in `apps/web/src/components/ui` (Button, Input, Modal, Popover, Avatar, Calendar, and so on) and are reused across the app.
- Request data is validated with class-validator, and the API returns clear messages with the right status codes (400 for bad input, 401 when not logged in, 404 when not found).

---

## Notes

- Priority has 5 levels everywhere (No Priority, Urgent, High, Medium, Low).
- On the detail page, the small header icons (lock, watchers, share) are there for looks only.
- You can drag a card between columns to change its status. Reordering cards inside a column was left out to keep things simple.
- The font is Inter, a close match to the design.
- If port 3000 or 4000 is already in use, change the port in both `.env` files (`PORT` and `NEXT_PUBLIC_API_URL`) to the same new value and restart.

---

## Scripts (run from the repo root)

- `npm run dev:api` - start the backend
- `npm run dev:web` - start the frontend
- `npm run build` - build both apps
- `npm run start:api` / `npm run start:web` - run the built apps
- `npm run lint` - check the frontend code

---