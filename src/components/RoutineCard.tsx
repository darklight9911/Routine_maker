import type React from 'react';
import type { RoutineItem, RoutineSettings } from '../types/routine';
import { COLOR_PALETTE } from '../constants/presets';
import { GripVertical, Edit2, Copy, Trash2, MapPin, User, Tag } from 'lucide-react';

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
      className={`group relative rounded-xl border p-2.5 sm:p-3 transition-all duration-200 cursor-grab active:cursor-grabbing select-none text-left shadow-xs hover:shadow-md ${
        colorDef.bgLight
      } ${colorDef.borderLight} ${colorDef.textLight} ${colorDef.bgDark} ${colorDef.borderDark} ${
        colorDef.textDark
      } ${isDragging ? 'opacity-40 scale-95 ring-2 ring-indigo-500 shadow-xl' : 'opacity-100'} ${
        !isHighlighted ? 'opacity-25 grayscale' : ''
      } ${settings.compactMode ? 'p-2 text-xs' : ''}`}
      onClick={(e) => {
        // Prevent clicking child buttons from opening edit
        if ((e.target as HTMLElement).closest('button')) return;
        onEdit(item);
      }}
    >
      {/* Top row: Drag handle & Category badge & Action buttons */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1 min-w-0">
          <span
            className="text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-grab active:cursor-grabbing transition-colors"
            title="Drag to move or swap"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </span>
          {settings.showCategory && item.category && (
            <span
              className="inline-flex items-center gap-0.5 text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-white/70 dark:bg-slate-900/60 shadow-xs backdrop-blur-xs truncate"
            >
              <Tag className="w-2.5 h-2.5 opacity-70 shrink-0" />
              <span className="truncate">{item.category}</span>
            </span>
          )}
        </div>

        {/* Action icons shown on hover or touch */}
        <div className="flex items-center gap-0.5 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity no-export">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="p-1 rounded hover:bg-white/80 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors"
            title="Edit item"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(item.id);
            }}
            className="p-1 rounded hover:bg-white/80 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-emerald-600 transition-colors"
            title="Duplicate item"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="p-1 rounded hover:bg-white/80 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-rose-600 transition-colors"
            title="Delete item"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Title & Subtitle */}
      <div className="font-semibold text-sm sm:text-base leading-tight tracking-tight line-clamp-2">
        {item.title}
      </div>
      {item.subtitle && (
        <div className="text-xs font-mono font-medium opacity-80 mt-0.5 truncate">
          {item.subtitle}
        </div>
      )}

      {/* Meta tags (Location / Instructor) */}
      <div className="mt-2 flex flex-col gap-1 text-[11px] font-medium opacity-85">
        {settings.showLocation && item.location && (
          <div className="flex items-center gap-1 truncate" title={item.location}>
            <MapPin className="w-3 h-3 shrink-0 opacity-70" />
            <span className="truncate">{item.location}</span>
          </div>
        )}
        {settings.showInstructor && item.instructor && (
          <div className="flex items-center gap-1 truncate" title={item.instructor}>
            <User className="w-3 h-3 shrink-0 opacity-70" />
            <span className="truncate">{item.instructor}</span>
          </div>
        )}
      </div>

      {item.notes && !settings.compactMode && (
        <div className="mt-1.5 pt-1.5 border-t border-black/5 dark:border-white/10 text-[10px] italic opacity-75 line-clamp-1">
          {item.notes}
        </div>
      )}
    </div>
  );
};
