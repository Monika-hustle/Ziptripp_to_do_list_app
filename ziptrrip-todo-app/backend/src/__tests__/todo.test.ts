import request from "supertest";
import app from "../app";
import db from "../db/database";

describe("Todo API Integration & Unit Tests", () => {
  let createdTodoId: number;

  beforeAll(() => {
    // Clear todos table for a clean test run
    db.prepare("DELETE FROM todos").run();
  });

  afterAll(() => {
    // Clean up test records and close DB connection
    db.prepare("DELETE FROM todos").run();
  });

  describe("GET /health", () => {
    it("should return healthy status", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body.status).toBe("healthy");
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe("POST /api/todos (Create Todo)", () => {
    it("should successfully create a valid todo with default values", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({
          title: "Book flight tickets to Mumbai",
          description: "Flight booking for quarterly corporate review",
          priority: "HIGH",
          category: "Travel",
          due_date: "2026-10-15"
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.title).toBe("Book flight tickets to Mumbai");
      expect(res.body.data.priority).toBe("HIGH");
      expect(res.body.data.status).toBe("PENDING");
      expect(res.body.data.is_completed).toBe(0);

      createdTodoId = res.body.data.id;
    });

    it("should reject creation if title is missing or too short", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({
          title: "A" // Less than 2 characters
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Validation Error");
      expect(res.body.errors).toBeDefined();
    });

    it("should reject creation if due_date has invalid format", async () => {
      const res = await request(app)
        .post("/api/todos")
        .send({
          title: "Hotel booking",
          due_date: "15-10-2026" // Invalid format (should be YYYY-MM-DD)
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("GET /api/todos (List & Filter Todos)", () => {
    beforeAll(async () => {
      // Add a couple more todos for filtering tests
      await request(app).post("/api/todos").send({
        title: "Submit reimbursement claims",
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        category: "Finance"
      });

      await request(app).post("/api/todos").send({
        title: "Review hotel partner contracts",
        priority: "LOW",
        status: "COMPLETED",
        category: "Legal"
      });
    });

    it("should return all todos", async () => {
      const res = await request(app).get("/api/todos");
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBeGreaterThanOrEqual(3);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it("should filter todos by priority", async () => {
      const res = await request(app).get("/api/todos?priority=HIGH");
      expect(res.status).toBe(200);
      expect(res.body.data.every((t: any) => t.priority === "HIGH")).toBe(true);
    });

    it("should filter todos by status", async () => {
      const res = await request(app).get("/api/todos?status=IN_PROGRESS");
      expect(res.status).toBe(200);
      expect(res.body.data.every((t: any) => t.status === "IN_PROGRESS")).toBe(true);
    });

    it("should search todos by keyword in title", async () => {
      const res = await request(app).get("/api/todos?search=reimbursement");
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].title).toContain("reimbursement");
    });
  });

  describe("GET /api/todos/:id (Get Single Todo)", () => {
    it("should return the requested todo item by valid ID", async () => {
      const res = await request(app).get(`/api/todos/${createdTodoId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(createdTodoId);
      expect(res.body.data.title).toBe("Book flight tickets to Mumbai");
    });

    it("should return 404 for a non-existent ID", async () => {
      const res = await request(app).get("/api/todos/999999");
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should return 400 for an invalid non-numeric ID", async () => {
      const res = await request(app).get("/api/todos/abc");
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("PUT /api/todos/:id (Update Todo)", () => {
    it("should update title, priority, and category of an existing todo", async () => {
      const res = await request(app)
        .put(`/api/todos/${createdTodoId}`)
        .send({
          title: "Book premium flight tickets to Mumbai (Updated)",
          priority: "MEDIUM",
          category: "Executive Travel"
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe("Book premium flight tickets to Mumbai (Updated)");
      expect(res.body.data.priority).toBe("MEDIUM");
      expect(res.body.data.category).toBe("Executive Travel");
    });

    it("should return 404 when updating non-existent todo", async () => {
      const res = await request(app)
        .put("/api/todos/999999")
        .send({ title: "Non existent" });

      expect(res.status).toBe(404);
    });
  });

  describe("PATCH /api/todos/:id/toggle (Toggle Completion)", () => {
    it("should toggle pending todo to completed", async () => {
      const res = await request(app).patch(`/api/todos/${createdTodoId}/toggle`);
      expect(res.status).toBe(200);
      expect(res.body.data.is_completed).toBe(1);
      expect(res.body.data.status).toBe("COMPLETED");
    });

    it("should toggle completed todo back to pending", async () => {
      const res = await request(app).patch(`/api/todos/${createdTodoId}/toggle`);
      expect(res.status).toBe(200);
      expect(res.body.data.is_completed).toBe(0);
      expect(res.body.data.status).toBe("PENDING");
    });
  });

  describe("DELETE /api/todos/:id (Delete Todo)", () => {
    it("should delete an existing todo", async () => {
      const res = await request(app).delete(`/api/todos/${createdTodoId}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify it no longer exists
      const checkRes = await request(app).get(`/api/todos/${createdTodoId}`);
      expect(checkRes.status).toBe(404);
    });

    it("should return 404 when deleting an already deleted or non-existent todo", async () => {
      const res = await request(app).delete(`/api/todos/${createdTodoId}`);
      expect(res.status).toBe(404);
    });
  });
});
