import type React from 'react';
import type { RoutineSettings } from '../types/routine';
import { CATEGORIES } from '../constants/presets';
import {
  Search,
  Plus,
  Clock,
  Calendar,
  ArrowRightLeft,
  BarChart2,
  Trash2,
} from 'lucide-react';

interface ToolbarProps {
  settings: RoutineSettings;
  onUpdateSettings: (settings: Partial<RoutineSettings>) => void;
  searchFilter: string;
  onSearchChange: (val: string) => void;
  categoryFilter: string;
  onCategoryChange: (val: string) => void;
  onAddItemClick: () => void;
  onAddTimeSlotClick: () => void;
  onAddDayClick: () => void;
  onOpenStats: () => void;
  onClearAll: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  settings,
  onUpdateSettings,
  searchFilter,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  onAddItemClick,
  onAddTimeSlotClick,
  onAddDayClick,
  onOpenStats,
  onClearAll,
}) => {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs mb-4 no-print">
      {/* Upper toolbar row: Search, Filter, Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search & Category Filter */}
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Search box */}
          <div className="relative flex-1 min-w-[180px] max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search classes, rooms, teachers..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onAddItemClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95"
            title="Add a new class or event"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>

          <button
            onClick={onAddTimeSlotClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-300 dark:border-slate-700 transition-colors"
            title="Add a new time period column"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Add Time Slot</span>
            <span className="sm:hidden">+ Time</span>
          </button>

          <button
            onClick={onAddDayClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-300 dark:border-slate-700 transition-colors"
            title="Add a new day row"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Add Day</span>
            <span className="sm:hidden">+ Day</span>
          </button>

          <button
            onClick={onOpenStats}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium border border-slate-300 dark:border-slate-700 transition-colors"
            title="View workload stats and hour breakdown"
          >
            <BarChart2 className="w-3.5 h-3.5 text-purple-500" />
            <span className="hidden sm:inline">Analytics</span>
          </button>
        </div>
      </div>

      {/* Lower toolbar row: Layout toggles (Days on Right, Compact, Time Format, Visible Fields) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          {/* Day column position toggle (Right / Left) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium">Days Column:</span>
            <button
              onClick={() =>
                onUpdateSettings({
                  dayColumnPosition: settings.dayColumnPosition === 'right' ? 'left' : 'right',
                })
              }
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors border ${
                settings.dayColumnPosition === 'right'
                  ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}
              title="Toggle Day column placement between Right and Left"
            >
              <ArrowRightLeft className="w-3 h-3 text-indigo-500" />
              <span>{settings.dayColumnPosition === 'right' ? 'Rightmost (Default)' : 'Left'}</span>
            </button>
          </div>

          {/* Time format (12h / 24h) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium">Time Format:</span>
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800">
              <button
                onClick={() => onUpdateSettings({ timeFormat: '12h' })}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  settings.timeFormat === '12h'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                12-Hour
              </button>
              <button
                onClick={() => onUpdateSettings({ timeFormat: '24h' })}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  settings.timeFormat === '24h'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                24-Hour
              </button>
            </div>
          </div>

          {/* Density (Compact / Comfortable) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium">Density:</span>
            <button
              onClick={() => onUpdateSettings({ compactMode: !settings.compactMode })}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] border transition-colors ${
                settings.compactMode
                  ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {settings.compactMode ? 'Compact' : 'Comfortable'}
            </button>
          </div>

          {/* Field visibility checkboxes */}
          <div className="hidden lg:flex items-center gap-3 text-[11px]">
            <label className="flex items-center gap-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.showLocation}
                onChange={(e) => onUpdateSettings({ showLocation: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <span>Rooms</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.showInstructor}
                onChange={(e) => onUpdateSettings({ showInstructor: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <span>Instructors</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.showCategory}
                onChange={(e) => onUpdateSettings({ showCategory: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <span>Tags</span>
            </label>
          </div>
        </div>

        {/* Clear all items */}
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all routine items?')) {
              onClearAll();
            }
          }}
          className="text-xs text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          <span>Clear Events</span>
        </button>
      </div>
    </div>
  );
};
