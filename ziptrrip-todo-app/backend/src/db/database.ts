import Database from "better-sqlite3";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const dbPath = process.env.DATABASE_PATH || path.resolve(__dirname, "../../todos.db");
const db = new Database(dbPath);

// Enable WAL mode for high concurrent read performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Initialize Todo Table Schema
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
};

initSchema();

export default db;
