import { Router } from "express";
import { TodoController } from "../controllers/todo.controller";
import { validateBody, validateQuery } from "../middlewares/validate.middleware";
import { createTodoSchema, updateTodoSchema, todoQuerySchema } from "../validators/todo.validator";

const router = Router();

// GET /api/todos - List all todos with query filters
router.get("/", validateQuery(todoQuerySchema), TodoController.getTodos);

// GET /api/todos/:id - Single todo by ID
router.get("/:id", TodoController.getTodoById);

// POST /api/todos - Create new todo
router.post("/", validateBody(createTodoSchema), TodoController.createTodo);

// PUT /api/todos/:id - Update todo
router.put("/:id", validateBody(updateTodoSchema), TodoController.updateTodo);

// PATCH /api/todos/:id/toggle - Toggle completion status
router.patch("/:id/toggle", TodoController.toggleComplete);

// DELETE /api/todos/:id - Delete todo
router.delete("/:id", TodoController.deleteTodo);

export default router;
