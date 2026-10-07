import db from "../db/database";
import { Todo, CreateTodoDTO, UpdateTodoDTO, TodoFilterQuery } from "../types/todo.types";

export class TodoService {
  /**
   * Fetch all todos with optional filtering, search, and sorting
   */
  static getAllTodos(filter: TodoFilterQuery): Todo[] {
    let query = `SELECT * FROM todos WHERE 1=1`;
    const params: (string | number)[] = [];

    if (filter.status && filter.status !== "ALL") {
      query += ` AND status = ?`;
      params.push(filter.status);
    }

    if (filter.priority) {
      query += ` AND priority = ?`;
      params.push(filter.priority);
    }

    if (filter.category) {
      query += ` AND LOWER(category) = LOWER(?)`;
      params.push(filter.category);
    }

    if (filter.search) {
      query += ` AND (LOWER(title) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))`;
      params.push(`%${filter.search}%`, `%${filter.search}%`);
    }

    const sortBy = filter.sort_by || "created_at";
    const order = filter.order ? filter.order.toUpperCase() : "DESC";

    query += ` ORDER BY ${sortBy} ${order}`;

    const stmt = db.prepare(query);
    return stmt.all(...params) as Todo[];
  }

  /**
   * Fetch a single todo by ID
   */
  static getTodoById(id: number): Todo | null {
    const stmt = db.prepare(`SELECT * FROM todos WHERE id = ?`);
    const result = stmt.get(id) as Todo | undefined;
    return result || null;
  }

  /**
   * Create a new todo record
   */
  static createTodo(dto: CreateTodoDTO): Todo {
    const isCompleted = dto.status === "COMPLETED" ? 1 : 0;
    const stmt = db.prepare(`
      INSERT INTO todos (title, description, priority, status, category, due_date, is_completed, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    const info = stmt.run(
      dto.title.trim(),
      dto.description ? dto.description.trim() : null,
      dto.priority || "MEDIUM",
      dto.status || "PENDING",
      dto.category ? dto.category.trim() : "General",
      dto.due_date || null,
      isCompleted
    );

    return this.getTodoById(Number(info.lastInsertRowid))!;
  }

  /**
   * Update an existing todo
   */
  static updateTodo(id: number, dto: UpdateTodoDTO): Todo | null {
    const existing = this.getTodoById(id);
    if (!existing) return null;

    const updatedTitle = dto.title !== undefined ? dto.title.trim() : existing.title;
    const updatedDesc = dto.description !== undefined ? (dto.description ? dto.description.trim() : null) : existing.description;
    const updatedPriority = dto.priority !== undefined ? dto.priority : existing.priority;
    let updatedStatus = dto.status !== undefined ? dto.status : existing.status;
    let isCompleted = existing.is_completed;

    if (dto.is_completed !== undefined) {
      isCompleted = dto.is_completed ? 1 : 0;
      updatedStatus = dto.is_completed ? "COMPLETED" : (updatedStatus === "COMPLETED" ? "PENDING" : updatedStatus);
    } else if (dto.status !== undefined) {
      isCompleted = dto.status === "COMPLETED" ? 1 : 0;
    }

    const updatedCategory = dto.category !== undefined ? dto.category.trim() : existing.category;
    const updatedDueDate = dto.due_date !== undefined ? dto.due_date : existing.due_date;

    const stmt = db.prepare(`
      UPDATE todos
      SET title = ?, description = ?, priority = ?, status = ?, category = ?, due_date = ?, is_completed = ?, updated_at = datetime('now')
      WHERE id = ?
    `);

    stmt.run(updatedTitle, updatedDesc, updatedPriority, updatedStatus, updatedCategory, updatedDueDate, isCompleted, id);
    return this.getTodoById(id);
  }

  /**
   * Toggle completion status
   */
  static toggleComplete(id: number): Todo | null {
    const existing = this.getTodoById(id);
    if (!existing) return null;

    const newCompleted = existing.is_completed === 1 ? 0 : 1;
    const newStatus = newCompleted === 1 ? "COMPLETED" : "PENDING";

    const stmt = db.prepare(`
      UPDATE todos
      SET is_completed = ?, status = ?, updated_at = datetime('now')
      WHERE id = ?
    `);

    stmt.run(newCompleted, newStatus, id);
    return this.getTodoById(id);
  }

  /**
   * Delete a todo record
   */
  static deleteTodo(id: number): boolean {
    const stmt = db.prepare(`DELETE FROM todos WHERE id = ?`);
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
