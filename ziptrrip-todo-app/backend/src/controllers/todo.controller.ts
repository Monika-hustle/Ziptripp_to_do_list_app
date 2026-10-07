import { Request, Response, NextFunction } from "express";
import { TodoService } from "../services/todo.service";
import { TodoFilterQuery } from "../types/todo.types";

export class TodoController {
  /**
   * GET /api/todos - Get all todos with filters
   */
  static getTodos = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filters = req.query as unknown as TodoFilterQuery;
      const todos = TodoService.getAllTodos(filters);

      return res.status(200).json({
        success: true,
        count: todos.length,
        data: todos
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/todos/:id - Get a single todo by ID
   */
  static getTodoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Todo ID format. Must be an integer."
        });
      }

      const todo = TodoService.getTodoById(id);
      if (!todo) {
        return res.status(404).json({
          success: false,
          message: `Todo with ID ${id} not found.`
        });
      }

      return res.status(200).json({
        success: true,
        data: todo
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/todos - Create a new todo
   */
  static createTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newTodo = TodoService.createTodo(req.body);

      return res.status(201).json({
        success: true,
        message: "Todo created successfully.",
        data: newTodo
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/todos/:id - Update an existing todo
   */
  static updateTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Todo ID format."
        });
      }

      const updated = TodoService.updateTodo(id, req.body);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: `Todo with ID ${id} not found.`
        });
      }

      return res.status(200).json({
        success: true,
        message: "Todo updated successfully.",
        data: updated
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/todos/:id/toggle - Toggle completion status
   */
  static toggleComplete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Todo ID format."
        });
      }

      const updated = TodoService.toggleComplete(id);
      if (!updated) {
        return res.status(404).json({
          success: false,
          message: `Todo with ID ${id} not found.`
        });
      }

      return res.status(200).json({
        success: true,
        message: `Todo marked as ${updated.is_completed === 1 ? "completed" : "pending"}.`,
        data: updated
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/todos/:id - Delete a todo
   */
  static deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Todo ID format."
        });
      }

      const deleted = TodoService.deleteTodo(id);
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: `Todo with ID ${id} not found.`
        });
      }

      return res.status(200).json({
        success: true,
        message: "Todo deleted successfully."
      });
    } catch (error) {
      next(error);
    }
  };
}
