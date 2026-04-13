# Todo List Application

A full-stack task management app built with React, Express, MongoDB, and Firebase Authentication.

---

## Tech Stack

### Frontend
- **React 18** — UI framework
- **Vite + Nx** — build tooling
- **React Router 7** — client-side routing
- **TanStack React Query 5** — server state management
- **Zustand** — client state (auth)
- **TailwindCSS 3** — utility-first styling
- **Lucide React** — icon library
- **Firebase JS SDK** — authentication (email/password, Google OAuth)

### Backend
- **Express 4** — web framework
- **Mongoose 7** — MongoDB ODM
- **Firebase Admin SDK** — server-side token verification
- **Swagger UI** — API docs at `/api-docs`

### Testing
- **Jest** — unit tests
- **Supertest** — HTTP assertions
- **mongodb-memory-server** — in-memory DB for tests
- **Cypress** — E2E tests

---

## Project Structure

```
todo-list/
├── apps/
│   ├── todo/                        # React frontend
│   │   └── src/
│   │       ├── app/
│   │       │   ├── component/
│   │       │   │   ├── auth/        # LoginPage, RegisterPage, ForgotPasswordPage, AuthLayout
│   │       │   │   ├── elements/    # Reusable UI (Button, Input, Header, UserMenu, etc.)
│   │       │   │   ├── todo/        # TodoContainer, TodoLists, TodoList, TodoItem, etc.
│   │       │   │   └── statistics/  # StatisticsPage, statsUtils
│   │       │   ├── fetchers/        # API call functions
│   │       │   ├── hooks/           # Custom React hooks
│   │       │   ├── lib/             # firebase.ts, apiClient.ts
│   │       │   └── store/           # Zustand auth store
│   │       ├── assets/              # bg.webp, man.webp, woman.webp
│   │       └── environments/        # environment.ts / environment.prod.ts
│   └── todo-be/                     # Express backend
│       └── src/app/
│           ├── controllers/         # HTTP handlers
│           ├── integrations/        # Firebase Admin SDK init
│           ├── middleware/          # Auth middleware
│           ├── models/              # Mongoose schemas
│           ├── repositories/        # DB access layer
│           └── services/            # Business logic
├── libs/
│   └── types/                       # Shared TypeScript types + Zod schemas
├── .firebaserc
├── firebase.json
└── .env                             # Never committed — see Environment Variables below
```

---

## Authentication

Auth is handled entirely by **Firebase Authentication** — no custom JWTs or password hashing.

### Supported methods
- Email / password
- Google OAuth (Sign in with popup)

### How it works
1. Firebase issues an **ID token** on the client after sign-in
2. Every API request attaches the token as `Authorization: Bearer <token>`
3. The backend verifies the token using **Firebase Admin SDK**
4. On first Google sign-in, the frontend calls `POST /api/auth/provision` to create a MongoDB user profile

### Backend middleware
| Middleware | Used on | What it does |
|---|---|---|
| `verifyFirebaseToken` | `POST /api/auth/provision` | Verifies Firebase ID token only |
| `authMiddleware` | All other protected routes | Verifies token + loads MongoDB user profile |

### Password reset
Handled natively by Firebase — no custom email service needed. `ForgotPasswordPage` calls `sendPasswordResetEmail()` from the Firebase JS SDK directly.

### Register form validation
Validated client-side with Zod before the request is sent:
- First name, last name — required
- Username — min 2 characters
- Email — valid format
- Password — min 1 uppercase, 1 number, 1 symbol
- Confirm password — must match

---

## API Endpoints

All routes require Firebase auth token unless noted.

```
# Auth
GET  /api/auth/user          — Get authenticated user profile
POST /api/auth/provision     — Create MongoDB profile on first sign-in (verifyFirebaseToken only)

# Users
GET  /api/users/:userId/stats — Get task statistics for a period

# Todolists
GET    /api/users/:userId/todolists                            — List all todolists
POST   /api/users/:userId/todolists                            — Create todolist
PUT    /api/users/:userId/todolists/:todolistId                — Update todolist
DELETE /api/users/:userId/todolists/:todolistId                — Delete todolist

# Todos
POST   /api/users/:userId/todolists/:todolistId/todos          — Create todo
PUT    /api/users/:userId/todolists/:todolistId/todos/:id      — Update todo
DELETE /api/users/:userId/todolists/:todolistId/todos/:id      — Delete todo
```

---

## Environment Variables

Create a `.env` file in the project root:

```bash
# MongoDB
MONGODB_URI=

# Firebase Admin (backend)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Firebase Client (frontend — NX_ prefix required for Nx/Vite)
NX_FIREBASE_API_KEY=
NX_FIREBASE_AUTH_DOMAIN=
NX_FIREBASE_PROJECT_ID=
NX_FIREBASE_STORAGE_BUCKET=
NX_FIREBASE_MESSAGING_SENDER_ID=
NX_FIREBASE_APP_ID=

# App
NX_API_URL=http://localhost:3333/api
PORT=3333
```

> The Firebase client vars (`NX_FIREBASE_*`) are read by `apps/todo/src/environments/environment.ts`.
> The Firebase admin vars are read by `apps/todo-be/src/app/integrations/firebase.ts`.

---

## Running the Project

```bash
# Install dependencies
npm install

# Start MongoDB (Docker)
npm run docker:mongodb

# Start backend (port 3333)
npm run serve:be

# Start frontend (port 4200)
npm run serve:fe

# Start both
npm run all

# Run backend unit tests
npm run test:unit:be

# Run E2E tests
npm run test:e2e:watch
```

---

## Notification System (planned)

The dashboard nav includes a notification bell. Planned implementation uses **Firebase Firestore** for real-time notifications — keeping everything in the Firebase ecosystem already in use.

### Why Firestore
- Real-time listeners (`onSnapshot`) — no polling needed
- No extra backend infrastructure
- Frontend reads/writes Firestore directly with security rules

### Notification types
- Task due today
- Task overdue
- (Future) Task assigned to collaborator

### Document shape
```ts
interface Notification {
  id: string;
  userId: string;           // Firebase UID
  type: 'due_today' | 'overdue' | 'reminder';
  title: string;
  body: string;
  todolistId?: string;
  todoId?: string;
  read: boolean;
  createdAt: Timestamp;
}
```

### Firestore collection path
```
notifications/{firebaseUid}/items/{notifId}
```

### Security rules
```
match /notifications/{userId}/items/{notifId} {
  allow read, write: if request.auth.uid == userId;
}
```

### Files to create
| File | Purpose |
|---|---|
| `apps/todo/src/app/lib/firestore.ts` | Initialize Firestore, export `db` |
| `apps/todo/src/app/hooks/useNotifications.ts` | `onSnapshot` listener, `markRead` helper |
| `apps/todo/src/app/component/elements/NotificationBell.tsx` | Bell icon + unread badge + dropdown |

### How notifications are generated (initial approach)
On app load, the frontend checks todos with `dueDate` matching today or in the past and writes to Firestore if no notification exists yet for that todo. No Cloud Functions needed for the initial version.
