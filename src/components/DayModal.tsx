import React, { useState } from 'react';
import type { Day } from '../types/routine';
import { X, Calendar, Trash2 } from 'lucide-react';

interface DayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (day: Omit<Day, 'id'> | Day) => void;
  onDelete?: (dayId: string) => void;
  initialDay?: Day | null;
}

const DayModalContent: React.FC<Omit<DayModalProps, 'isOpen'>> = ({
  onClose,
  onSave,
  onDelete,
  initialDay,
}) => {
  const [name, setName] = useState(initialDay?.name || '');
  const [shortName, setShortName] = useState(initialDay?.shortName || '');
  const [isOffDay, setIsOffDay] = useState(!!initialDay?.isOffDay);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialDay && !shortName) {
      setShortName(val.slice(0, 3));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const short = shortName.trim() || name.trim().slice(0, 3);

    if (initialDay) {
      onSave({
        ...initialDay,
        name: name.trim(),
        shortName: short,
        isOffDay,
      });
    } else {
      onSave({
        name: name.trim(),
        shortName: short,
        isOffDay,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {initialDay ? 'Edit Day' : 'Add Day'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure day row in your timetable
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Day Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Saturday, Monday, Day 1"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Short Abbreviation
            </label>
            <input
              type="text"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              placeholder="e.g. Sat, Mon, D1"
              maxLength={4}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <input
              type="checkbox"
              checked={isOffDay}
              onChange={(e) => setIsOffDay(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Mark as Weekend / Off Day (muted background)
            </div>
          </label>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {initialDay && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(initialDay.id);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-colors"
              >
                {initialDay ? 'Update Day' : 'Add Day'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export const DayModal: React.FC<DayModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <DayModalContent key={props.initialDay?.id || 'new'} {...props} />;
};
