# Ziptrrip Tech Assessment: Full-Stack Task Management System

**Candidate:** Monika R T  
**Target Role:** Backend Engineer / Full-Stack Engineer  
**Tech Stack:** TypeScript, Node.js (Express), SQLite (`better-sqlite3`), React, Tailwind CSS, Jest, Supertest

---

## Overview

This repository contains an enterprise-grade, scalable Full-Stack Task Management System developed for the Ziptrrip Tech Assessment. The application is built with strict TypeScript type safety, a layered backend architecture, an optimized embedded database with indexing, and a responsive Multi-Page Application (MPA) frontend flow.

### Key Highlights

* **End-to-End TypeScript:** Complete type safety across models, API contracts, DTOs, and frontend state.
* **Layered Architecture:** Strict separation of concerns across Routes, Middlewares, Controllers, Services, and Data Access Layers.
* **High-Performance SQLite Storage:** Embedded SQLite database running in Write-Ahead Logging (WAL) mode with B-Tree indexes on `status`, `priority`, and `category`.
* **Multi-Page Application (MPA) Routing:**
  * **Task List View:** Instant filtering by status (`PENDING`, `IN_PROGRESS`, `COMPLETED`), priority, search querying, and metrics overview.
  * **Task Detail View (`?id=...`):** Full detail inspection, audit timestamps, and real-time attribute management synced with URL parameters.
* **Automated Testing & Quality Assurance:** Comprehensive integration and unit test suite built with Jest and Supertest.
* **API Testing Assets:** Postman Collection (`ziptrrip_todos_postman.json`) and VS Code REST Client specification (`requests.http`).

---

## Project Structure

```
Ziptripp_to_do_list_app/
└── ziptrrip-todo-app/
    ├── backend/
    │   ├── src/
    │   │   ├── controllers/            # Request processing & status handling
    │   │   ├── services/               # Business logic & SQL query execution
    │   │   ├── db/                     # Database initialization & B-Tree indexing
    │   │   ├── middlewares/            # Zod validation & centralized error handler
    │   │   ├── routes/                 # REST endpoint routing
    │   │   ├── types/                  # TypeScript Interfaces & DTO definitions
    │   │   ├── validators/             # Zod schema definitions
    │   │   ├── __tests__/              # Jest & Supertest integration tests
    │   │   ├── app.ts                  # Express application configuration
    │   │   └── server.ts               # Server bootstrap & listener
    │   ├── requests.http               # REST Client file for VS Code
    │   ├── ziptrrip_todos_postman.json # Postman Collection export
    │   ├── jest.config.js              # Test suite configuration
    │   ├── tsconfig.json               # Backend TypeScript configuration
    │   └── package.json
    │
    ├── frontend/
    │   ├── src/
    │   │   ├── api/                    # API service layer
    │   │   ├── components/             # Reusable UI components & modals
    │   │   ├── pages/                  # MPA views (Task List & Task Detail)
    │   │   ├── types/                  # Shared frontend types
    │   │   ├── App.tsx                 # Query parameter router
    │   │   └── main.tsx                # Entry point
    │   ├── vite.config.ts              # Vite bundle configuration
    │   ├── tailwind.config.js          # Tailwind CSS styling configuration
    │   └── package.json
    │
    ├── API_DOCUMENTATION.md            # Comprehensive REST API reference
    ├── ARCHITECTURE.md                 # System architecture & design decisions
    └── README.md                       # Inner workspace README
```

---

## Quick Start Guide

### Prerequisites
* Node.js (v18.0.0 or higher)
* npm (v9.0.0 or higher)

---

### 1. Backend Setup & Startup

```bash
# Navigate to the backend directory
cd ziptrrip-todo-app/backend

# Install dependencies
npm install

# Start development server
npm run dev
```

* **Server URL:** `http://localhost:5000`
* **Health Check:** `http://localhost:5000/health`
* **Database Note:** SQLite database file (`todos.db`) is automatically initialized with schema and indexes on server launch.

---

### 2. Run Integration & Unit Tests

```bash
# From the backend directory
npm test
```

Executes the automated **Jest + Supertest** suite to verify API endpoints, edge cases, error handlers, and input validations.

---

### 3. Frontend Setup & Startup

```bash
# Open a new terminal and navigate to the frontend directory
cd ziptrrip-todo-app/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

* **Frontend Application URL:** `http://localhost:3000`

---

## Technical Features & Assessment Requirements

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Multi-Page Application (MPA)** | Page 1 for Todo List, Page 2 for single Todo receiving `?id=...` parameter | Complete |
| **Backend REST CRUD APIs** | Full CRUD + status toggle + filtering in Node.js / Express | Complete |
| **Database Integration** | SQLite with WAL mode and B-Tree indexing | Complete |
| **TypeScript Usage** | Strict type-safety in both Backend and Frontend | Complete |
| **Unit & Integration Tests** | Jest + Supertest covering endpoints, validation & edge cases | Complete |
| **API Testing Specifications** | Postman Collection JSON + `requests.http` file included | Complete |
| **Comprehensive Documentation** | System `README.md`, `API_DOCUMENTATION.md`, and `ARCHITECTURE.md` | Complete |

---

## REST API Summary

| HTTP Method | Endpoint Path | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Server status and uptime health check |
| `GET` | `/api/todos` | Fetch all tasks with optional search, status, and priority parameters |
| `GET` | `/api/todos/:id` | Retrieve single task record by ID |
| `POST` | `/api/todos` | Create a new task item with Zod schema validation |
| `PUT` | `/api/todos/:id` | Update task details (title, description, status, priority, category) |
| `PATCH` | `/api/todos/:id/toggle` | Toggle completion status |
| `DELETE` | `/api/todos/:id` | Delete task record permanently |

*Refer to [API_DOCUMENTATION.md](./ziptrrip-todo-app/API_DOCUMENTATION.md) for full request/response payloads and schemas.*

---

## Technical Architecture & Engineering Decisions

For in-depth technical details on schema design, B-Tree index performance, error handling pipelines, and architectural patterns, see [ARCHITECTURE.md](./ziptrrip-todo-app/ARCHITECTURE.md).
