
# File Explorer (VS Code–Inspired)

A production-minded, VS Code–inspired file explorer built with **React** and **Node.js**.
The implementation prioritizes **code quality, correctness, and maintainability** over feature volume.

---

## Overview

This project implements a hierarchical file explorer with a clear separation of concerns between frontend UI and backend APIs. The backend acts as the **single source of truth**, while the frontend delivers a responsive and predictable user experience.

---

## Key Features

- Hierarchical folders and files (unlimited depth)
- Create, rename, and delete files and folders
- Expand and collapse folders with persistent state
- Active file highlighting
- Optimistic UI updates with rollback on failure
- Persistent backend storage using a JSON store
- Dark, VS Code–inspired pink theme
- Non-blocking notifications via Toastify
- Modal-based inputs using Ant Design

---

## Architecture & Design Decisions

### Data Model
The file system is represented as a flat list of nodes:

```json
{
  "id": "uuid",
  "name": "example",
  "type": "folder | file",
  "parentId": "parent-node-id | null"
}
```

- Parent–child relationships are derived using `parentId`
- A single immutable root node (`id = "root"`) is enforced
- Flat structure simplifies persistence, updates, and recursive operations

---

### Backend as Source of Truth
All invariants are enforced server-side:

- Unique file and folder names within the same parent (case-insensitive)
- Invalid names are rejected
- Root folder cannot be renamed or deleted
- Recursive deletion is handled safely on the backend
- State persists across server restarts

---

### Optimistic UI Strategy
The frontend applies optimistic updates for create, rename, and delete actions:

1. UI updates immediately
2. API request is executed
3. On failure, UI state is rolled back and the user is notified

This ensures fast UX without sacrificing consistency.

---

### Expand / Collapse Handling
- Folder expansion state is managed locally
- Collapse state is persisted using `localStorage`
- A global “Collapse All” action resets all folders

---

### UX Considerations
- Blocking browser prompts replaced with Ant Design modals
- Alerts replaced with Toastify notifications
- Ant Design components themed using `ConfigProvider`

---

## Technology Stack

### Frontend
- React
- Tailwind CSS
- Ant Design
- Lucide React
- React Toastify

### Backend
- Node.js
- Express
- UUID
- File-based JSON persistence

---

## Running the Project

### Backend
```bash
cd backend
npm install
node index.js
```

Server runs at:
```
http://localhost:4000
```

---

### Frontend
```bash
cd frontend
npm install
npm start
```

Application runs at:
```
http://localhost:3000
```

---

## API Endpoints

```http
GET    /tree
POST   /folder
POST   /file
PUT    /rename
DELETE /node
```
---

## Edge Cases Covered

- Duplicate names within the same folder
- Recursive deletion of nested folders
- Rename collisions
- Invalid file or folder names
- Persistence across server restarts

---

## Future Improvements

- Database-backed persistence
- Inline rename support
- File content editor
- Drag-and-drop interactions
