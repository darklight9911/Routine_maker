import type React from 'react';
import type { RoutineItem, RoutineSettings } from '../types/routine';
import { COLOR_PALETTE } from '../constants/presets';
import { GripVertical, Edit2, Copy, Trash2, MapPin, User } from 'lucide-react';

interface RoutineCardProps {
  item: RoutineItem;
  settings: RoutineSettings;
  isDragging: boolean;
  onEdit: (item: RoutineItem) => void;
  onDuplicate: (itemId: string) => void;
  onDelete: (itemId: string) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  isHighlighted?: boolean;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  item,
  settings,
  isDragging,
  onEdit,
  onDuplicate,
  onDelete,
  onDragStart,
  onDragEnd,
  isHighlighted = true,
}) => {
  const colorDef = COLOR_PALETTE.find((c) => c.id === item.color) || COLOR_PALETTE[0];

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      tabIndex={0}
      role="button"
      aria-label={`Routine event: ${item.title}`}
      className={`group relative rounded-xl border border-slate-200/90 dark:border-slate-800/80 p-3 transition-all duration-200 cursor-grab active:cursor-grabbing select-none text-left shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
        colorDef.bgLight
      } ${colorDef.bgDark} ${
        isDragging ? 'opacity-40 scale-95 ring-2 ring-indigo-500 shadow-xl' : 'opacity-100'
      } ${!isHighlighted ? 'opacity-25 grayscale' : ''} ${
        settings.compactMode ? 'p-2 text-xs' : ''
      }`}
      style={{
        borderLeftWidth: '4px',
        borderLeftColor: colorDef.hex,
      }}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) return;
        onEdit(item);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEdit(item);
        }
      }}
    >
      {/* Top row: Category tag, Color dot, and Micro-actions */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing transition-colors"
            title="Drag anywhere to move or swap"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </span>

          {settings.showCategory && item.category && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-white/10 shadow-2xs backdrop-blur-xs truncate text-slate-700 dark:text-slate-300">
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: colorDef.hex }}
              />
              <span className="truncate">{item.category}</span>
            </span>
          )}
        </div>

        {/* Action icons on hover or focus */}
        <div className="flex items-center gap-0.5 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity no-export">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="p-1 rounded-md bg-white/90 dark:bg-slate-800/90 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-500 hover:text-indigo-600 shadow-2xs transition-colors cursor-pointer"
            title="Edit event"
            aria-label="Edit event"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(item.id);
            }}
            className="p-1 rounded-md bg-white/90 dark:bg-slate-800/90 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-500 hover:text-emerald-600 shadow-2xs transition-colors cursor-pointer"
            title="Duplicate event"
            aria-label="Duplicate event"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="p-1 rounded-md bg-white/90 dark:bg-slate-800/90 hover:bg-rose-50 dark:hover:bg-slate-700 text-slate-500 hover:text-rose-600 shadow-2xs transition-colors cursor-pointer"
            title="Delete event"
            aria-label="Delete event"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <h4 className="font-bold text-sm sm:text-base leading-snug tracking-tight text-slate-900 dark:text-white line-clamp-2">
        {item.title}
      </h4>
      {item.subtitle && (
        <div className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 mt-0.5 tracking-tight truncate">
          {item.subtitle}
        </div>
      )}

      {/* Meta tags (Location / Instructor) with clean pill badges */}
      <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300">
        {settings.showLocation && item.location && (
          <div
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 truncate max-w-full"
            title={item.location}
          >
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{item.location}</span>
          </div>
        )}
        {settings.showInstructor && item.instructor && (
          <div
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 truncate max-w-full"
            title={item.instructor}
          >
            <User className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{item.instructor}</span>
          </div>
        )}
      </div>

      {item.notes && !settings.compactMode && (
        <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-white/10 text-[10px] text-slate-500 dark:text-slate-400 italic line-clamp-1">
          {item.notes}
        </div>
      )}
    </div>
  );
};
