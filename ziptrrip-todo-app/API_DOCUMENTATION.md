# API Documentation

This document outlines the RESTful API contract for the **Ziptrrip Todo Application Backend**.

Base URL: `http://localhost:5000`

---

## 1. Health Check

### `GET /health`
Returns system operational status and server uptime.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "uptime": 45.21,
  "timestamp": "2026-10-07T15:00:00.000Z"
}
```

---

## 2. List & Filter Todos

### `GET /api/todos`
Fetch all todo items. Supports optional query parameters for filtering, search, and sorting.

**Query Parameters:**
| Parameter | Type | Allowed Values | Description |
| :--- | :--- | :--- | :--- |
| `status` | string | `PENDING`, `IN_PROGRESS`, `COMPLETED`, `ALL` | Filter by task status |
| `priority` | string | `LOW`, `MEDIUM`, `HIGH` | Filter by priority |
| `category` | string | string | Filter by department/category tag |
| `search` | string | string | Substring search across title & description |
| `sort_by` | string | `created_at`, `due_date`, `priority`, `title` | Sort column (default: `created_at`) |
| `order` | string | `asc`, `desc` | Sort direction (default: `desc`) |

**Sample Request:**
`GET /api/todos?status=PENDING&priority=HIGH&search=flight`

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "title": "Book flight tickets to Mumbai",
      "description": "Flight booking for quarterly corporate review",
      "priority": "HIGH",
      "status": "PENDING",
      "category": "Travel",
      "due_date": "2026-10-15",
      "is_completed": 0,
      "created_at": "2026-10-07 09:30:00",
      "updated_at": "2026-10-07 09:30:00"
    }
  ]
}
```

---

## 3. Get Single Todo by ID

### `GET /api/todos/:id`
Retrieves full details for a specific todo item.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Book flight tickets to Mumbai",
    "description": "Flight booking for quarterly corporate review",
    "priority": "HIGH",
    "status": "PENDING",
    "category": "Travel",
    "due_date": "2026-10-15",
    "is_completed": 0,
    "created_at": "2026-10-07 09:30:00",
    "updated_at": "2026-10-07 09:30:00"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Todo with ID 9999 not found."
}
```

---

## 4. Create Todo

### `POST /api/todos`
Creates a new todo item. Request body is strictly validated using Zod schemas.

**Request Body:**
```json
{
  "title": "Corporate Travel Policy Audit",
  "description": "Review and update enterprise travel expense allowances for Q4",
  "priority": "HIGH",
  "status": "PENDING",
  "category": "Compliance",
  "due_date": "2026-10-20"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Todo created successfully.",
  "data": {
    "id": 2,
    "title": "Corporate Travel Policy Audit",
    "description": "Review and update enterprise travel expense allowances for Q4",
    "priority": "HIGH",
    "status": "PENDING",
    "category": "Compliance",
    "due_date": "2026-10-20",
    "is_completed": 0,
    "created_at": "2026-10-07 10:00:00",
    "updated_at": "2026-10-07 10:00:00"
  }
}
```

---

## 5. Update Todo

### `PUT /api/todos/:id`
Updates an existing todo's fields.

**Request Body:**
```json
{
  "title": "Corporate Travel Policy Audit (Approved)",
  "priority": "MEDIUM",
  "status": "IN_PROGRESS"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo updated successfully.",
  "data": {
    "id": 2,
    "title": "Corporate Travel Policy Audit (Approved)",
    "priority": "MEDIUM",
    "status": "IN_PROGRESS",
    "updated_at": "2026-10-07 10:15:00"
  }
}
```

---

## 6. Toggle Completion Status

### `PATCH /api/todos/:id/toggle`
Toggles `is_completed` between `0` and `1` (and updates `status` between `COMPLETED` and `PENDING`).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo marked as completed.",
  "data": {
    "id": 2,
    "is_completed": 1,
    "status": "COMPLETED"
  }
}
```

---

## 7. Delete Todo

### `DELETE /api/todos/:id`
Deletes a todo item permanently.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Todo deleted successfully."
}
```
