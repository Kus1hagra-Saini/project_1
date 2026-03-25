import { Package, Gift } from 'lucide-react';
import Button from './ui/Button';

export default function Hero({ onListItem, onBrowseDonations, listItemLoading = false, listItemMessage = '' }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
            Buy, sell & share school items with your{' '}
            <span className="text-primary-600 dark:text-primary-400">community</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            Textbooks, uniforms, and notes — all in one trusted place for students.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={onListItem}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              isLoading={listItemLoading}
            >
              <Package className="w-5 h-5 mr-2" />
              List an Item
            </Button>
            <Button
              onClick={onBrowseDonations}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Gift className="w-5 h-5 mr-2" />
              Browse Donations
            </Button>
          </div>
          {listItemMessage ? (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              {listItemMessage}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
