import { X } from 'lucide-react';
import FilterSidebar from './FilterSidebar';

export default function FilterDrawer({ open, onClose, filters, onFiltersChange }) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed top-0 left-0 bottom-0 z-50 w-full max-w-sm bg-white shadow-xl overflow-y-auto lg:hidden animate-in slide-in-from-left duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-semibold text-slate-800">Filters</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:bg-sage-100 hover:text-slate-700 transition"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
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
