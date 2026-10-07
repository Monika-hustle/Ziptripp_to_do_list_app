import React from "react";
import { CheckCircle2, PlusCircle, ArrowLeft } from "lucide-react";

interface HeaderProps {
  onOpenCreate?: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreate, showBack, onBack }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
              title="Back to Todos List"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              Ziptrrip <span className="text-teal-600 font-semibold">TaskManager</span>
            </h1>
            <p className="text-xs text-slate-500">Corporate Travel & Task Operations</p>
          </div>
        </div>

        {onOpenCreate && (
          <button
            onClick={onOpenCreate}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm hover:shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Task</span>
          </button>
        )}
      </div>
    </header>
  );
};
