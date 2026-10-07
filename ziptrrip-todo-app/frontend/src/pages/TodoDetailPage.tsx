import React, { useState, useEffect } from "react";
import { Todo, PriorityLevel, TodoStatus } from "../types/todo";
import { todoApi } from "../api/todoApi";
import { Header } from "../components/Header";
import {
  Calendar,
  Clock,
  Tag,
  CheckCircle2,
  Circle,
  Trash2,
  Save,
  AlertCircle,
  Loader2,
  Hash,
  FileText,
  ArrowLeft
} from "lucide-react";

interface TodoDetailPageProps {
  todoId: number;
  onBack: () => void;
}

export const TodoDetailPage: React.FC<TodoDetailPageProps> = ({ todoId, onBack }) => {
  const [todo, setTodo] = useState<Todo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Editable fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<PriorityLevel>("MEDIUM");
  const [status, setStatus] = useState<TodoStatus>("PENDING");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");

  const loadTodo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoApi.getTodoById(todoId);
      setTodo(data);
      setTitle(data.title);
      setDescription(data.description || "");
      setPriority(data.priority);
      setStatus(data.status);
      setCategory(data.category);
      setDueDate(data.due_date || "");
    } catch (err: any) {
      setError(err.message || "Failed to load todo details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodo();
  }, [todoId]);

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 2) {
      setError("Title must be at least 2 characters long.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const updated = await todoApi.updateTodo(todoId, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
        category: category.trim() || "General",
        due_date: dueDate || undefined
      });
      setTodo(updated);
      setSuccessMsg("Task details successfully updated!");
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err: any) {
      setError(err.message || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async () => {
    try {
      const updated = await todoApi.toggleComplete(todoId);
      setTodo(updated);
      setStatus(updated.status);
      setSuccessMsg(`Task marked as ${updated.status.toLowerCase()}!`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError("Failed to toggle status: " + err.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete task #${todoId}?`)) return;
    try {
      await todoApi.deleteTodo(todoId);
      onBack();
    } catch (err: any) {
      setError("Failed to delete task: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header showBack onBack={onBack} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Top Navigation Button */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-teal-600" />
            <span>← Back to Task List</span>
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{successMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-3" />
            <p className="text-sm">Loading task specifications from database...</p>
          </div>
        ) : !todo ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-slate-600 mb-4">Task not found or was removed.</p>
            <button
              onClick={onBack}
              className="text-xs font-semibold text-white bg-teal-600 px-4 py-2 rounded-xl"
            >
              Return to Task List
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Info Banner */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggle}
                  className="text-slate-400 hover:text-teal-600 transition"
                  title="Toggle status"
                >
                  {todo.is_completed === 1 ? (
                    <CheckCircle2 className="w-7 h-7 text-teal-600 fill-teal-50" />
                  ) : (
                    <Circle className="w-7 h-7 text-slate-300 hover:text-teal-500" />
                  )}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 flex items-center gap-0.5">
                      <Hash className="w-3 h-3" />
                      TASK-{todo.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                        todo.status === "COMPLETED"
                          ? "bg-teal-50 text-teal-700 border-teal-200"
                          : todo.status === "IN_PROGRESS"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {todo.status.replace("_", " ")}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">{todo.title}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={handleDelete}
                  className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-slate-200"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Editable Details Form */}
            <form onSubmit={handleSaveChanges} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-600" />
                  Task Configuration & Attributes
                </h3>
                <span className="text-xs text-slate-400">Query Parameter: <code>?id={todo.id}</code></span>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-sm font-medium text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Detailed Description & Associated Notes
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add detailed flight route, traveler credentials, or compliance requirements..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-sm text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-sm text-slate-800 bg-white"
                  >
                    <option value="LOW">Low Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="HIGH">High Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TodoStatus)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-sm text-slate-800 bg-white"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Department / Category Tag
                  </label>
                  <div className="relative">
                    <Tag className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="e.g. Corporate Travel"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-sm text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                    Target Due Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 text-sm text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Readonly Audit Timestamps */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Created At: <strong>{new Date(todo.created_at).toLocaleString()}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Last Updated: <strong>{new Date(todo.updated_at).toLocaleString()}</strong></span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  ← Back to Task List
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
