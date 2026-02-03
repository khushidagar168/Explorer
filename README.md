# Simple Real-Time File Explorer

This project implements a simple file explorer (similar to the VS Code sidebar) using **React** for the frontend and **Node.js + Express** for the backend.

The purpose of this assignment is to demonstrate:
- Frontend state management
- Backend API design
- Handling asynchronous operations
- Optimistic UI updates
- Clear and structured communication

This is not a UI design–focused project. The emphasis is on correctness and behavior.

---

## Features

- Nested folders and files (unlimited depth)
- Create folder
- Create file
- Rename file or folder
- Delete file or folder
- Expand and collapse folders
- Optimistic UI updates with rollback on failure
- Backend-managed persistent state

---

## Data Model

The file tree is stored as a flat list of nodes:

```json
{
  "id": "uuid",
  "name": "example",
  "type": "folder | file",
  "parentId": "parent-id | null"
}
```

- Each file or folder has a unique `id`
- Each node has exactly one parent (except the root)
- Parent–child relationships are derived using `parentId`
- A single root node (`parentId = null`) is enforced

---

## Backend (Source of Truth)

The backend acts as the single source of truth for the file tree.

Responsibilities handled on the backend:
- Creating files and folders
- Renaming nodes
- Deleting nodes (including recursive deletion)
- Basic input validation
- Persisting data using a JSON store

The frontend always syncs its state with backend responses.

---

## Optimistic UI Updates

The frontend uses optimistic updates for all user actions.

Flow:
1. UI updates immediately after a user action
2. Backend API request runs in the background
3. If the request succeeds, the UI state is kept
4. If the request fails, the UI state is reverted and an error message is shown

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

## Tech Stack

### Frontend
- React
- Ant Design (modals)
- React Toastify (notifications)

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

## Notes

- No page reloads during interactions
- Drag and drop is intentionally not implemented
- Styling is minimal and secondary to logic
- Focus is on correctness, async handling, and clear state management
