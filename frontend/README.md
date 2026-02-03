
# 📁 File Explorer (VS Code–like)

A VS Code–inspired file explorer built using **React + Node.js**, focusing on **correctness, clean architecture, and predictable state management** rather than feature count.

---

## 🚀 Features

- Nested folders & files (unlimited depth)
- Create / rename / delete files and folders
- Expand & collapse folders (persistent across refresh)
- Active file highlighting
- Optimistic UI updates with rollback on failure
- Persistent backend storage (JSON file)
- Dark pink theme (VS Code–inspired)
- Non-blocking notifications (Toastify)
- Modal-based inputs (Ant Design)

---

## 🧠 Design Decisions

### 1. Data Model
The file system is represented as a **flat array**:

```json
{
  "id": "uuid",
  "name": "src",
  "type": "folder | file",
  "parentId": "parent-node-id | null"
}
```

- Parent–child relationships are derived using `parentId`
- A single root node (`id = "root"`) is enforced
- Flat structure simplifies updates, deletes, and persistence

---

### 2. Backend as Source of Truth
All invariants are enforced on the backend:

- Unique file/folder names per folder (case-insensitive)
- Invalid names blocked (empty, `.js`, `.py`, etc.)
- Root folder cannot be renamed or deleted
- Recursive delete handled server-side
- Persistent storage via JSON file

---

### 3. Optimistic UI Updates
All create, rename, and delete actions use **optimistic updates**:

1. UI updates immediately
2. Backend request is sent
3. On failure, UI state is rolled back

This ensures:
- Fast, responsive UX
- Consistent state
- Clear error recovery

---

### 4. Expand / Collapse Handling
- Each folder manages its own expand state
- Collapse state is persisted in `localStorage`
- A global “Collapse All” action resets all folders

---

### 5. UX Improvements
- Replaced blocking `prompt()` calls with **Ant Design Modal**
- Replaced `alert()` with **Toastify** notifications
- Modal and inputs themed using AntD `ConfigProvider`
- Dark pink theme aligned across UI components

---

## 🛠 Tech Stack

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

## ▶️ How to Run

### Backend
```bash
cd backend
npm install
node index.js
```

Runs on:
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

Runs on:
```
http://localhost:3000
```

---

## 📌 API Endpoints

```http
GET    /tree
POST   /folder
POST   /file
PUT    /rename
DELETE /node
```

---

## 🧪 Edge Cases Handled

- Duplicate names in same folder ❌
- Same name in different folders ✅
- Recursive delete of folders ✅
- Invalid file/folder names ❌
- Rename collisions ❌
- Backend persistence across restarts ✅

---

## 🧠 Focus on Code Quality

This project prioritizes:
- Clean separation of concerns
- Predictable state flow
- Backend-enforced correctness
- Readable, maintainable code

Over:
- Excessive features
- Over-engineering
- Unnecessary libraries

---

## 🔮 Possible Improvements

- Real database instead of JSON file
- Inline rename instead of modal
- File content editor
- Drag-and-drop support

---

## ✅ Final Note

**Code quality matters more than the number of features.**

Every design decision reflects this principle.
