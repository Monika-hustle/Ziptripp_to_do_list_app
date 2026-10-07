import { z } from "zod";

export const createTodoSchema = z.object({
  title: z
    .string({ required_error: "Title is required." })
    .min(2, "Title must be at least 2 characters long.")
    .max(100, "Title cannot exceed 100 characters.")
    .trim(),
  description: z.string().max(500, "Description cannot exceed 500 characters.").optional().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM").optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).default("PENDING").optional(),
  category: z.string().max(50, "Category cannot exceed 50 characters.").default("General").optional(),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in YYYY-MM-DD format.")
    .optional()
    .nullable()
});

export const updateTodoSchema = z.object({
  title: z.string().min(2).max(100).trim().optional(),
  description: z.string().max(500).optional().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]).optional(),
  category: z.string().max(50).optional(),
  due_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must be in YYYY-MM-DD format.")
    .optional()
    .nullable(),
  is_completed: z.boolean().optional()
});

export const todoQuerySchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "ALL"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  sort_by: z.enum(["created_at", "due_date", "priority", "title"]).optional().default("created_at"),
  order: z.enum(["asc", "desc"]).optional().default("desc")
});
