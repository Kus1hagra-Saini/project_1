import { X } from 'lucide-react';
import FilterSidebar from './FilterSidebar';

export default function FilterDrawer({ open, onClose, filters, onFiltersChange }) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md lg:hidden transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed top-0 left-0 bottom-0 z-50 w-full max-w-sm glass shadow-2xl overflow-y-auto lg:hidden animate-in slide-in-from-left duration-300"
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className="sticky top-0 glass border-b border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between px-6 py-4 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200"
            aria-label="Close filters"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <FilterSidebar
            filters={filters}
            onFiltersChange={(f) => {
              onFiltersChange(f);
            }}
            isDrawer
          />
        </div>
      </div>
    </>
  );
}
