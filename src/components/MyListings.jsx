import { useCallback } from 'react';
import { Trash2, CheckCircle, Plus, Loader2 } from 'lucide-react';

export default function MyListings({ items, loading, onListItem, onDelete, onMarkSold, onItemClick, user }) {
  const handleDelete = useCallback((e, item) => {
    e.stopPropagation();
    onDelete?.(item);
  }, [onDelete]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100">My Listings</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Items you&apos;ve listed on the marketplace</p>
        </div>
        <button
          type="button"
          onClick={onListItem}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          List an Item
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-600 dark:text-slate-300 text-lg font-semibold">No listings yet</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Click &quot;List an Item&quot; to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className={`flex items-center gap-4 p-4 rounded-2xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 transition-all cursor-pointer ${
                item.status === 'SOLD' ? 'opacity-60' : 'hover:border-primary-300 dark:hover:border-primary-700'
              }`}
            >
              {/* Thumbnail */}
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-2xl">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  item.imagePlaceholder
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{item.title}</p>
                  {item.status === 'SOLD' && (
                    <span className="shrink-0 px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">SOLD</span>
                  )}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.isDonation ? 'Free' : `₹${item.price}`} · {item.condition} · {item.category}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {item.status !== 'SOLD' && onMarkSold && (
                  <button
                    onClick={() => onMarkSold(item)}
                    title="Mark as Sold"
                    className="p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => handleDelete(e, item)}
                    title="Delete listing"
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
