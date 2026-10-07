import { Todo, CreateTodoInput, UpdateTodoInput } from "../types/todo";

const API_BASE_URL = "http://localhost:5000/api/todos";

export const todoApi = {
  /**
   * Fetch all todos with optional query filters
   */
  async getTodos(params?: { status?: string; priority?: string; search?: string }): Promise<Todo[]> {
    const url = new URL(API_BASE_URL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "ALL") {
          url.searchParams.append(key, value);
        }
      });
    }

    const response = await fetch(url.toString());
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch todos");
    }
    return data.data;
  },

  /**
   * Fetch single todo by ID
   */
  async getTodoById(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Failed to fetch todo #${id}`);
    }
    return data.data;
  },

  /**
   * Create new todo
   */
  async createTodo(input: CreateTodoInput): Promise<Todo> {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to create todo");
    }
    return data.data;
  },

  /**
   * Update todo
   */
  async updateTodo(id: number, input: UpdateTodoInput): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update todo");
    }
    return data.data;
  },

  /**
   * Toggle completion status
   */
  async toggleComplete(id: number): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
      method: "PATCH"
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to toggle todo status");
    }
    return data.data;
  },

  /**
   * Delete todo
   */
  async deleteTodo(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE"
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to delete todo");
    }
  }
};
