import { Request, Response, NextFunction } from "express";

export interface CustomAppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomAppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Detailed error logging in non-test environments
  if (process.env.NODE_ENV !== "test") {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} - ${statusCode}: ${message}`);
    if (statusCode === 500) {
      console.error(err.stack);
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Endpoint not found: ${req.method} ${req.originalUrl}`
  });
};
