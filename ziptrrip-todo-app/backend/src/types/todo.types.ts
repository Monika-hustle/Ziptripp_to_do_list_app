export type PriorityLevel = "LOW" | "MEDIUM" | "HIGH";
export type TodoStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  priority: PriorityLevel;
  status: TodoStatus;
  category: string;
  due_date: string | null;
  is_completed: number; // 0 or 1 for SQLite boolean
  created_at: string;
  updated_at: string;
}

export interface CreateTodoDTO {
  title: string;
  description?: string;
  priority?: PriorityLevel;
  status?: TodoStatus;
  category?: string;
  due_date?: string;
}

export interface UpdateTodoDTO {
  title?: string;
  description?: string;
  priority?: PriorityLevel;
  status?: TodoStatus;
  category?: string;
  due_date?: string;
  is_completed?: boolean;
}

export interface TodoFilterQuery {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
  sort_by?: "created_at" | "due_date" | "priority" | "title";
  order?: "asc" | "desc";
}
