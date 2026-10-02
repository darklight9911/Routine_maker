import React, { useState } from 'react';
import type { TimeSlot } from '../types/routine';
import { X, Clock, Trash2, Coffee } from 'lucide-react';

interface TimeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slot: Omit<TimeSlot, 'id'> | TimeSlot) => void;
  onDelete?: (slotId: string) => void;
  initialSlot?: TimeSlot | null;
}

const TimeSlotModalContent: React.FC<Omit<TimeSlotModalProps, 'isOpen'>> = ({
  onClose,
  onSave,
  onDelete,
  initialSlot,
}) => {
  const [startTime, setStartTime] = useState(initialSlot?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialSlot?.endTime || '10:00');
  const [label, setLabel] = useState(initialSlot?.label || '');
  const [isBreak, setIsBreak] = useState(!!initialSlot?.isBreak);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime || !endTime) return;

    if (initialSlot) {
      onSave({
        ...initialSlot,
        startTime,
        endTime,
        label: label.trim(),
        isBreak,
      });
    } else {
      onSave({
        startTime,
        endTime,
        label: label.trim(),
        isBreak,
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
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {initialSlot ? 'Edit Time Slot' : 'Add Time Slot'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Define the timing and label for this column
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Start Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                End Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Slot Label (Optional)
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Period 1, Block A, Recess"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <input
              type="checkbox"
              checked={isBreak}
              onChange={(e) => setIsBreak(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
            />
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
              <Coffee className="w-4 h-4 text-amber-500" />
              <span>Mark as Break / Lunch Recess</span>
            </div>
          </label>

          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            {initialSlot && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(initialSlot.id);
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
                {initialSlot ? 'Update Slot' : 'Add Slot'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export const TimeSlotModal: React.FC<TimeSlotModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <TimeSlotModalContent key={props.initialSlot?.id || 'new'} {...props} />;
};
