import type React from 'react';
import type { RoutineData } from '../types/routine';
import { calculateDurationMinutes, formatDuration } from '../utils/time';
import { X, BarChart3, Clock, Calendar, PieChart, CheckCircle2 } from 'lucide-react';

interface StatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  routine: RoutineData;
}

export const StatsDrawer: React.FC<StatsDrawerProps> = ({ isOpen, onClose, routine }) => {
  if (!isOpen) return null;

  // Compute stats
  const totalItems = routine.items.length;
  const timeSlotMap = new Map(routine.timeSlots.map((s) => [s.id, s]));

  let totalScheduledMinutes = 0;
  const categoryCounts: Record<string, number> = {};
  const dayCounts: Record<string, number> = {};

  routine.items.forEach((item) => {
    // category
    const cat = item.category || 'General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

    // day
    dayCounts[item.dayId] = (dayCounts[item.dayId] || 0) + 1;

    // minutes
    const slot = timeSlotMap.get(item.timeSlotId);
    if (slot && !slot.isBreak) {
      totalScheduledMinutes += calculateDurationMinutes(slot.startTime, slot.endTime);
    }
  });

  // Find busiest day
  let busiestDayName = 'None';
  let maxDayCount = 0;
  routine.days.forEach((day) => {
    const count = dayCounts[day.id] || 0;
    if (count > maxDayCount) {
      maxDayCount = count;
      busiestDayName = day.name;
    }
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Routine Analytics & Hours
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Weekly workload summary
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

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                <CheckCircle2 className="w-4 h-4" />
                Total Activities
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalItems}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Across {routine.days.length} days
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                <Clock className="w-4 h-4" />
                Active Hours
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {formatDuration(totalScheduledMinutes) || '0h'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Excludes break periods
              </div>
            </div>
          </div>

          {/* Busiest Day Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-300">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Peak Day
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-white">
                  {busiestDayName}
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300">
                {maxDayCount} items
              </span>
            </div>
          </div>

          {/* Breakdown by Category */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mb-3">
              <PieChart className="w-4 h-4 text-indigo-500" />
              Category Breakdown
            </h4>

            {Object.keys(categoryCounts).length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-4">No activities scheduled yet.</div>
            ) : (
              <div className="space-y-3">
                {Object.entries(categoryCounts).map(([cat, count]) => {
                  const percentage = Math.round((count / totalItems) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <span>{cat}</span>
                        <span>
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
