import Database from "better-sqlite3";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, "../../todos.db");
const db = new Database(dbPath);

// Enable WAL mode for high concurrent read performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Initialize Todo Table Schema & Initial Seed Data
const initSchema = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT CHECK(priority IN ('LOW', 'MEDIUM', 'HIGH')) DEFAULT 'MEDIUM',
      status TEXT CHECK(status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')) DEFAULT 'PENDING',
      category TEXT DEFAULT 'General',
      due_date TEXT,
      is_completed INTEGER DEFAULT 0 CHECK(is_completed IN (0, 1)),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_todos_status ON todos(status);
    CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
    CREATE INDEX IF NOT EXISTS idx_todos_category ON todos(category);
  `);

  // Auto-seed initial operational tasks if database is empty
  const countStmt = db.prepare("SELECT COUNT(*) as count FROM todos");
  const row = countStmt.get() as { count: number };

  if (row.count === 0) {
    const insertStmt = db.prepare(`
      INSERT INTO todos (title, description, priority, status, category, due_date, is_completed)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const initialTasks = [
      {
        title: "Book Flight Tickets for Corporate Offsite",
        description: "Arrange round-trip flight bookings for the engineering team traveling to Mumbai for Q4 planning.",
        priority: "HIGH",
        status: "PENDING",
        category: "Travel",
        due_date: "2026-10-15",
        is_completed: 0
      },
      {
        title: "Review Corporate Expense & Travel Policy",
        description: "Audit and update allowable daily food & local conveyance allowances for corporate travelers.",
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        category: "Compliance",
        due_date: "2026-10-20",
        is_completed: 0
      },
      {
        title: "Finalize Hotel Reservations in Bengaluru",
        description: "Confirm group booking for executive leadership at the downtown Marriott hotel.",
        priority: "HIGH",
        status: "COMPLETED",
        category: "Accommodation",
        due_date: "2026-10-10",
        is_completed: 1
      },
      {
        title: "Submit Q3 Travel Expense Report",
        description: "Aggregate all cab receipts and boarding passes into the finance portal for approval.",
        priority: "LOW",
        status: "PENDING",
        category: "Finance",
        due_date: "2026-10-25",
        is_completed: 0
      }
    ];

    const seedTx = db.transaction(() => {
      for (const task of initialTasks) {
        insertStmt.run(
          task.title,
          task.description,
          task.priority,
          task.status,
          task.category,
          task.due_date,
          task.is_completed
        );
      }
    });

    seedTx();
  }
};

initSchema();

export default db;
