import type React from 'react';
import { PRESET_ROUTINES } from '../constants/presets';
import type { RoutineData } from '../types/routine';
import { X, Sparkles, LayoutTemplate, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (data: RoutineData) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  const handleSelect = (data: RoutineData) => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    onSelectTemplate(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Preset Timetable Templates
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose a ready-to-use template or start fresh
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRESET_ROUTINES.map((preset) => (
            <div
              key={preset.id}
              className="flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg transition-all group bg-slate-50/50 dark:bg-slate-800/40"
            >
              <div>
                <div className="p-2.5 w-fit rounded-xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-110 transition-transform">
                  <LayoutTemplate className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1">
                  {preset.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {preset.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {preset.data.days.length} Days
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {preset.data.timeSlots.length} Slots
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {preset.data.items.length} Items
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleSelect(preset.data)}
                className="mt-5 w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors shadow-2xs"
              >
                <span>Load Template</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 bg-slate-100/60 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Tip: Loading a template will replace current routine. You can always use Undo (Ctrl+Z).</span>
          <button
            type="button"
            onClick={onClose}
            className="font-medium text-slate-700 dark:text-slate-300 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
