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
  X,
  SlidersHorizontal,
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
  totalFilteredCount?: number;
  totalItemsCount?: number;
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
  totalFilteredCount,
  totalItemsCount,
}) => {
  return (
    <div className="flex flex-col gap-3.5 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 shadow-lg shadow-slate-200/40 dark:shadow-black/20 mb-5 no-print transition-all">
      {/* Upper toolbar row: Search, Category Quick Chips, and Primary Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search input with live clear & count */}
        <div className="flex items-center gap-2 flex-1 min-w-[260px] max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search subjects, rooms, professors..."
              className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {searchFilter && totalFilteredCount !== undefined && totalItemsCount !== undefined && (
            <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
              {totalFilteredCount}/{totalItemsCount} matches
            </span>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onAddItemClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer"
            title="Add a new class or event"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>

          <button
            onClick={onAddTimeSlotClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all hover:-translate-y-0.5 cursor-pointer"
            title="Add a new time period column"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Add Time Slot</span>
            <span className="sm:hidden">+ Time</span>
          </button>

          <button
            onClick={onAddDayClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all hover:-translate-y-0.5 cursor-pointer"
            title="Add a new day row"
          >
            <Calendar className="w-3.5 h-3.5 text-purple-500" />
            <span className="hidden sm:inline">Add Day</span>
            <span className="sm:hidden">+ Day</span>
          </button>

          <button
            onClick={onOpenStats}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all hover:-translate-y-0.5 cursor-pointer"
            title="View workload stats and analytics"
          >
            <BarChart2 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Analytics</span>
          </button>
        </div>
      </div>

      {/* Category Pills Slider / Filter Row */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3" />
          Filter:
        </span>
        <button
          onClick={() => onCategoryChange('')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
            !categoryFilter
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => {
          const isActive = categoryFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(isActive ? '' : cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Lower toolbar row: Layout toggles (Days on Right, Compact, Time Format, Visible Fields) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          {/* Day column position toggle (Right / Left) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-500">Days Column:</span>
            <button
              onClick={() =>
                onUpdateSettings({
                  dayColumnPosition: settings.dayColumnPosition === 'right' ? 'left' : 'right',
                })
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs transition-colors border cursor-pointer ${
                settings.dayColumnPosition === 'right'
                  ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title="Toggle Day column placement between Right (Default) and Left"
            >
              <ArrowRightLeft className="w-3 h-3 text-indigo-500" />
              <span>{settings.dayColumnPosition === 'right' ? 'Rightmost (Default)' : 'Left'}</span>
            </button>
          </div>

          {/* Time format (12h / 24h) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-500">Time:</span>
            <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-100 dark:bg-slate-800">
              <button
                onClick={() => onUpdateSettings({ timeFormat: '12h' })}
                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  settings.timeFormat === '12h'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                12h
              </button>
              <button
                onClick={() => onUpdateSettings({ timeFormat: '24h' })}
                className={`px-2.5 py-0.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  settings.timeFormat === '24h'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                24h
              </button>
            </div>
          </div>

          {/* Density (Compact / Comfortable) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-500">Density:</span>
            <button
              onClick={() => onUpdateSettings({ compactMode: !settings.compactMode })}
              className={`px-2.5 py-1 rounded-lg font-semibold text-xs border transition-colors cursor-pointer ${
                settings.compactMode
                  ? 'bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {settings.compactMode ? 'Compact' : 'Comfortable'}
            </button>
          </div>

          {/* Field visibility checkboxes */}
          <div className="hidden lg:flex items-center gap-3 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.showLocation}
                onChange={(e) => onUpdateSettings({ showLocation: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <span>Rooms</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.showInstructor}
                onChange={(e) => onUpdateSettings({ showInstructor: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <span>Instructors</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.showCategory}
                onChange={(e) => onUpdateSettings({ showCategory: e.target.checked })}
                className="w-3.5 h-3.5 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
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
          className="text-xs font-semibold text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Events</span>
        </button>
      </div>
    </div>
  );
};
