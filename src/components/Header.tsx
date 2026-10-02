import React, { useState, useRef } from 'react';
import type { RoutineData } from '../types/routine';
import { exportRoutineAsJSON, exportTableAsImage } from '../utils/storage';
import {
  Undo2,
  Redo2,
  Download,
  Printer,
  Upload,
  FileJson,
  Image as ImageIcon,
  Sun,
  Moon,
  Sparkles,
  Edit2,
  Check,
  CalendarDays,
  HelpCircle,
  Clock,
  Layers,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeaderProps {
  routine: RoutineData;
  onUpdateTitle: (title: string, subtitle?: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenTemplates: () => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
  onImportRoutine: (data: RoutineData) => void;
}

export const Header: React.FC<HeaderProps> = ({
  routine,
  onUpdateTitle,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onOpenTemplates,
  onToggleDarkMode,
  isDarkMode,
  onImportRoutine,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(routine.title);
  const [tempSubtitle, setTempSubtitle] = useState(routine.subtitle || '');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveTitle = () => {
    onUpdateTitle(tempTitle.trim() || 'My Routine', tempSubtitle.trim());
    setIsEditingTitle(false);
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    setShowExportMenu(false);
    const success = await exportTableAsImage(
      'routine-export-container',
      routine.title.toLowerCase().replace(/[^a-z0-9]/gi, '_') || 'routine'
    );
    setIsExporting(false);
    if (success) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handlePrint = () => {
    setShowExportMenu(false);
    window.print();
  };

  const handleExportJSON = () => {
    setShowExportMenu(false);
    exportRoutineAsJSON(routine);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.days) && Array.isArray(parsed.timeSlots)) {
          onImportRoutine(parsed);
          confetti({ particleCount: 50, spread: 60 });
        } else {
          alert('Invalid routine JSON file structure.');
        }
      } catch (err) {
        console.error('Failed to parse JSON file:', err);
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="mb-6 space-y-4 no-print">
      {/* Top Navbar Card: Floating Frosted Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 shadow-lg shadow-slate-200/40 dark:shadow-black/20">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 shrink-0 group">
            <CalendarDays className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                RoutineCraft
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Client-Side
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
              Interactive Timetable & Routine Planner • UI/UX Pro Max Engine
            </p>
          </div>
        </div>

        {/* Action Controls: Undo/Redo, Templates, Export, Theme, Help */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Undo & Redo with count & tooltip */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50/80 dark:bg-slate-800/80 shadow-2xs">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                canUndo
                  ? 'text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:text-indigo-600 shadow-2xs'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
              aria-label="Undo change"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                canRedo
                  ? 'text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700 hover:text-indigo-600 shadow-2xs'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Y)"
              aria-label="Redo change"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Templates Button */}
          <button
            onClick={onOpenTemplates}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/80 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold transition-all hover:-translate-y-0.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>Templates</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Exporting...' : 'Export'}</span>
            </button>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={handleExportPNG}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 text-left transition-colors font-semibold cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-indigo-500" />
                    <span>Download Image (.PNG)</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 text-left transition-colors font-semibold cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-emerald-500" />
                    <span>Print / Save as PDF</span>
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  <button
                    onClick={handleExportJSON}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 text-left transition-colors font-semibold cursor-pointer"
                  >
                    <FileJson className="w-4 h-4 text-amber-500" />
                    <span>Backup Data (.JSON)</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 text-left transition-colors font-semibold cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-purple-500" />
                    <span>Restore Data (.JSON)</span>
                  </button>
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105 cursor-pointer shadow-2xs"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Quick Help Guide Button */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105 cursor-pointer shadow-2xs"
            title="Drag & Drop Rules & Tips"
            aria-label="Show help tips"
          >
            <HelpCircle className="w-4 h-4 text-indigo-500" />
          </button>
        </div>
      </div>

      {/* Routine Title & Subtitle Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-50/90 via-purple-50/60 to-pink-50/40 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-pink-950/20 border border-indigo-100 dark:border-indigo-900/40 shadow-sm backdrop-blur-md">
        {isEditingTitle ? (
          <div className="flex-1 space-y-2.5">
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="w-full px-4 py-2 text-xl font-heading font-bold rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              placeholder="Timetable Title"
              autoFocus
            />
            <input
              type="text"
              value={tempSubtitle}
              onChange={(e) => setTempSubtitle(e.target.value)}
              className="w-full px-4 py-1.5 text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              placeholder="Subtitle (e.g. Spring 2026 Semester, Team Focus, Habit Tracker)"
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSaveTitle}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Save
              </button>
              <button
                onClick={() => {
                  setTempTitle(routine.title);
                  setTempSubtitle(routine.subtitle || '');
                  setIsEditingTitle(false);
                }}
                className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => {
              setTempTitle(routine.title);
              setTempSubtitle(routine.subtitle || '');
              setIsEditingTitle(true);
            }}
            className="group cursor-pointer flex-1"
          >
            <div className="flex items-center gap-2.5">
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {routine.title}
              </h1>
              <span className="p-1 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 className="w-3.5 h-3.5" />
              </span>
            </div>
            {routine.subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                {routine.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Layout status & KPI chips */}
        <div className="flex flex-col sm:items-end gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-2xs font-bold text-slate-800 dark:text-slate-200">
              <Clock className="w-3 h-3 text-indigo-500" />
              Upper Row: Time
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-2xs font-bold text-indigo-700 dark:text-indigo-300">
              <Layers className="w-3 h-3 text-purple-500" />
              Rightmost Column: Days
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            {routine.days.length} Days • {routine.timeSlots.length} Slots • {routine.items.length} Active Events
          </div>
        </div>
      </div>

      {/* Interactive Rules & Drag-and-Drop Help Card */}
      {showHelp && (
        <div className="p-5 rounded-2xl sm:rounded-3xl bg-indigo-50/90 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-100 animate-in fade-in slide-in-from-top-2 duration-200 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-heading font-bold flex items-center gap-2 text-sm sm:text-base text-indigo-900 dark:text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Interactive Drag & Drop + Keyboard Rules:
            </h4>
            <button
              onClick={() => setShowHelp(false)}
              className="p-1 rounded-lg text-indigo-500 hover:text-indigo-800 dark:hover:text-indigo-200 cursor-pointer"
            >
              ✕
            </button>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <li className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
              <strong className="block text-indigo-700 dark:text-indigo-300 font-bold mb-1 text-sm">
                ↔ Time Headers
              </strong>
              Drag time headers along the top row to swap columns (time slots only swap with time slots), or click the left/right arrow buttons!
            </li>
            <li className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
              <strong className="block text-indigo-700 dark:text-indigo-300 font-bold mb-1 text-sm">
                ↕ Day Headers
              </strong>
              Drag day headers along the right column to swap rows (days only swap with days), or click the up/down arrow buttons!
            </li>
            <li className="p-3 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-indigo-100 dark:border-indigo-900/50 shadow-2xs">
              <strong className="block text-indigo-700 dark:text-indigo-300 font-bold mb-1 text-sm">
                ✥ Routine Events
              </strong>
              Drag any event card freely to empty slots or drop onto another card to swap positions anywhere across the timetable!
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};
