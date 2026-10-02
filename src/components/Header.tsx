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
        console.error('Failed to import JSON file:', err);
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <header className="mb-6 space-y-4 no-print">
      {/* Top Navbar Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-slate-200 dark:border-slate-800">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                RoutineCraft
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
                Client-Only
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              Interactive drag-and-drop timetable & routine builder
            </p>
          </div>
        </div>

        {/* Action Controls: Undo/Redo, Templates, Export, Theme, Help */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Undo & Redo */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-900 shadow-2xs">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className={`p-1.5 rounded-lg transition-colors ${
                canUndo
                  ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className={`p-1.5 rounded-lg transition-colors ${
                canRedo
                  ? 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Templates Button */}
          <button
            onClick={onOpenTemplates}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50/70 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Templates</span>
          </button>

          {/* Export Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Exporting...' : 'Export'}</span>
            </button>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs">
                  <button
                    onClick={handleExportPNG}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 text-left transition-colors font-medium"
                  >
                    <ImageIcon className="w-4 h-4 text-indigo-500" />
                    <span>Download Image (.PNG)</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 text-left transition-colors font-medium"
                  >
                    <Printer className="w-4 h-4 text-emerald-500" />
                    <span>Print / Save as PDF</span>
                  </button>
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  <button
                    onClick={handleExportJSON}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 text-left transition-colors font-medium"
                  >
                    <FileJson className="w-4 h-4 text-amber-500" />
                    <span>Export Data (.JSON)</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 text-left transition-colors font-medium"
                  >
                    <Upload className="w-4 h-4 text-purple-500" />
                    <span>Import Data (.JSON)</span>
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
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Quick Help Guide Button */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Drag & Drop Rules & Tips"
          >
            <HelpCircle className="w-4 h-4 text-indigo-500" />
          </button>
        </div>
      </div>

      {/* Routine Title & Subtitle Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-purple-50/50 to-pink-50/30 dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-pink-950/10 border border-indigo-100 dark:border-indigo-900/40">
        {isEditingTitle ? (
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="w-full px-3 py-1.5 text-lg font-bold rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              placeholder="Timetable Title"
              autoFocus
            />
            <input
              type="text"
              value={tempSubtitle}
              onChange={(e) => setTempSubtitle(e.target.value)}
              className="w-full px-3 py-1 text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              placeholder="Subtitle (e.g. Semester, department or project)"
            />
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleSaveTitle}
                className="flex items-center gap-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors"
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
                className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-300 transition-colors"
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
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {routine.title}
              </h1>
              <Edit2 className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {routine.subtitle && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                {routine.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Quick layout status badge */}
        <div className="text-right text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5 justify-end">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Upper Row: Time • Rightmost Column: Days</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {routine.days.length} Days • {routine.timeSlots.length} Time Slots • {routine.items.length} Activities
          </div>
        </div>
      </div>

      {/* Interactive Rules & Drag-and-Drop Help Card */}
      {showHelp && (
        <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold flex items-center gap-1.5 text-sm text-indigo-900 dark:text-indigo-200">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              How Drag & Drop Works in RoutineCraft:
            </h4>
            <button
              onClick={() => setShowHelp(false)}
              className="text-indigo-500 hover:text-indigo-800 dark:hover:text-indigo-200"
            >
              ✕
            </button>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <li className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-indigo-100 dark:border-indigo-900/50">
              <strong className="block text-indigo-700 dark:text-indigo-300 font-bold mb-1">
                ↔ Time Headers
              </strong>
              Drag time headers along the top row to swap/reorder columns. Time slots can only swap with other time slots.
            </li>
            <li className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-indigo-100 dark:border-indigo-900/50">
              <strong className="block text-indigo-700 dark:text-indigo-300 font-bold mb-1">
                ↕ Day Headers
              </strong>
              Drag day headers along the right column to swap/reorder rows. Days can only swap with other days.
            </li>
            <li className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/50 border border-indigo-100 dark:border-indigo-900/50">
              <strong className="block text-indigo-700 dark:text-indigo-300 font-bold mb-1">
                ✥ Routine Events
              </strong>
              Drag any event card freely to empty slots or swap positions with any other routine card anywhere in the grid!
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};
