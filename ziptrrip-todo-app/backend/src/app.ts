import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todo.routes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.middleware";

const app = express();

// Global Middlewares
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/todos", todoRoutes);

// 404 & Global Error Handling Middleware (must be at the bottom)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
