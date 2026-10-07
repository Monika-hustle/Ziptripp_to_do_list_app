import React, { useState, useEffect } from "react";
import { Todo, CreateTodoInput, PriorityLevel } from "../types/todo";
import { todoApi } from "../api/todoApi";
import { Header } from "../components/Header";
import { CreateTodoModal } from "../components/CreateTodoModal";
import {
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  ChevronRight,
  Filter,
  Calendar,
  Tag,
  AlertCircle,
  Loader2,
  ListTodo,
  Hourglass,
  FileX
} from "lucide-react";

interface TodoListPageProps {
  onNavigateToDetail: (id: number) => void;
}

export const TodoListPage: React.FC<TodoListPageProps> = ({ onNavigateToDetail }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoApi.getTodos({
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        priority: priorityFilter !== "ALL" ? priorityFilter : undefined,
        search: search.trim() || undefined
      });
      setTodos(data);
    } catch (err: any) {
      setError(err.message || "Failed to load tasks from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTodos();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, statusFilter, priorityFilter]);

  const handleToggle = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      const updated = await todoApi.toggleComplete(id);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err: any) {
      alert("Failed to toggle task status: " + err.message);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await todoApi.deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert("Failed to delete task: " + err.message);
    }
  };

  const handleCreateTodo = async (input: CreateTodoInput) => {
    const created = await todoApi.createTodo(input);
    setTodos((prev) => [created, ...prev]);
  };

  // Metrics
  const totalTasks = todos.length;
  const completedTasks = todos.filter((t) => t.is_completed === 1).length;
  const pendingTasks = totalTasks - completedTasks;

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case "HIGH":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "MEDIUM":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "LOW":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onOpenCreate={() => setIsModalOpen(true)} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Tasks</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalTasks}</h3>
            </div>
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 font-bold">
              <ListTodo className="w-6 h-6 text-slate-600" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Pending</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{pendingTasks}</h3>
            </div>
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center font-bold">
              <Hourglass className="w-6 h-6 text-amber-600" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">Completed</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{completedTasks}</h3>
            </div>
            <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
              {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg transition capitalize ${
                    statusFilter === tab
                      ? "bg-white text-teal-700 shadow-sm font-semibold"
                      : "hover:text-slate-900"
                  }`}
                >
                  {tab.replace("_", " ").toLowerCase()}
                </button>
              ))}
            </div>

            {/* Priority Selector */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs bg-transparent border-none text-slate-600 font-medium focus:ring-0 cursor-pointer"
              >
                <option value="ALL">All Priorities</option>
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task List Section */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-3" />
            <p className="text-sm">Fetching task records from SQLite database...</p>
          </div>
        ) : todos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileX className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">No tasks found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              {search || statusFilter !== "ALL" || priorityFilter !== "ALL"
                ? "No tasks match your current filter or search criteria."
                : "Your todo list is empty. Click below to add your first operational task."}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 px-4 py-2 rounded-xl transition"
            >
              + Create First Task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => {
              const isDone = todo.is_completed === 1;
              return (
                <div
                  key={todo.id}
                  onClick={() => onNavigateToDetail(todo.id)}
                  className={`group bg-white p-4 sm:p-5 rounded-2xl border transition shadow-sm hover:shadow-md cursor-pointer flex items-center justify-between gap-4 ${
                    isDone
                      ? "border-slate-200 bg-slate-50/50 opacity-75"
                      : "border-slate-200 hover:border-teal-500/40"
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={(e) => handleToggle(e, todo.id)}
                      className="text-slate-400 hover:text-teal-600 transition shrink-0"
                      title={isDone ? "Mark as Pending" : "Mark as Completed"}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 text-teal-600 fill-teal-50" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 group-hover:text-teal-500" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className={`text-sm font-semibold truncate ${
                            isDone ? "line-through text-slate-400" : "text-slate-900"
                          }`}
                        >
                          {todo.title}
                        </span>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getPriorityBadge(
                            todo.priority
                          )}`}
                        >
                          {todo.priority}
                        </span>

                        {todo.category && (
                          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" />
                            {todo.category}
                          </span>
                        )}
                      </div>

                      {todo.description && (
                        <p className="text-xs text-slate-500 line-clamp-1 mb-1">
                          {todo.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        {todo.due_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Due: {todo.due_date}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Created: {new Date(todo.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => handleDelete(e, todo.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <CreateTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTodo}
      />
    </div>
  );
};
