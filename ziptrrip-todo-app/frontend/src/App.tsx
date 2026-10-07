import React, { useState, useEffect } from "react";
import { TodoListPage } from "./pages/TodoListPage";
import { TodoDetailPage } from "./pages/TodoDetailPage";

export const App: React.FC = () => {
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  // Sync state with URL query parameter (e.g. ?id=1) for MPA query param navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get("id");
    if (idParam && !isNaN(parseInt(idParam, 10))) {
      setSelectedTodoId(parseInt(idParam, 10));
    } else {
      setSelectedTodoId(null);
    }

    const handlePopState = () => {
      const updatedParams = new URLSearchParams(window.location.search);
      const updatedId = updatedParams.get("id");
      if (updatedId && !isNaN(parseInt(updatedId, 10))) {
        setSelectedTodoId(parseInt(updatedId, 10));
      } else {
        setSelectedTodoId(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleNavigateToDetail = (id: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set("id", id.toString());
    window.history.pushState({}, "", url.toString());
    setSelectedTodoId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToList = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("id");
    window.history.pushState({}, "", url.pathname);
    setSelectedTodoId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {selectedTodoId !== null ? (
        <TodoDetailPage todoId={selectedTodoId} onBack={handleBackToList} />
      ) : (
        <TodoListPage onNavigateToDetail={handleNavigateToDetail} />
      )}
    </div>
  );
};

export default App;
