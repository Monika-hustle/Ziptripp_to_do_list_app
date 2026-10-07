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
  is_completed: number; // 0 or 1
  created_at: string;
  updated_at: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  priority?: PriorityLevel;
  status?: TodoStatus;
  category?: string;
  due_date?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  priority?: PriorityLevel;
  status?: TodoStatus;
  category?: string;
  due_date?: string;
  is_completed?: boolean;
}
