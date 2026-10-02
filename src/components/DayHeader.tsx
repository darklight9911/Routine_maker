import React, { useState } from 'react';
import type { Day, DragState } from '../types/routine';
import { GripVertical, Edit3, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface DayHeaderProps {
  day: Day;
  index: number;
  totalDays: number;
  isRightColumn?: boolean;
  dragState: DragState;
  onDragStart: (dayId: string) => void;
  onDragEnd: () => void;
  onDrop: (dayId: string) => void;
  onEdit: (day: Day) => void;
  onDelete: (dayId: string) => void;
  onMove?: (dayId: string, direction: 'up' | 'down') => void;
}

export const DayHeader: React.FC<DayHeaderProps> = ({
  day,
  index,
  totalDays,
  isRightColumn = true,
  dragState,
  onDragStart,
  onDragEnd,
  onDrop,
  onEdit,
  onDelete,
  onMove,
}) => {
  const [isOver, setIsOver] = useState(false);
  const isDraggingMe = dragState.type === 'day-row' && dragState.sourceId === day.id;
  const canDropHere = dragState.type === 'day-row' && dragState.sourceId !== day.id;

  return (
    <td
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', day.id);
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(day.id);
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        if (canDropHere) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          setIsOver(true);
        }
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        if (canDropHere) {
          onDrop(day.id);
        }
      }}
      className={`group relative p-3 sm:p-4 select-none transition-all duration-200 border-b border-slate-200 dark:border-slate-800/80 ${
        isRightColumn
          ? 'border-l border-slate-200 dark:border-slate-800 sticky right-0 z-10 shadow-[-4px_0_12px_rgba(0,0,0,0.03)]'
          : 'border-r border-slate-200 dark:border-slate-800 sticky left-0 z-10 shadow-[4px_0_12px_rgba(0,0,0,0.03)]'
      } ${
        day.isOffDay
          ? 'bg-slate-100/95 dark:bg-slate-900/95 text-slate-500 dark:text-slate-400'
          : 'bg-indigo-50/95 dark:bg-indigo-950/85 text-indigo-950 dark:text-indigo-100'
      } ${
        isOver
          ? 'ring-2 ring-indigo-500 bg-indigo-100 dark:bg-indigo-900/90 scale-[1.01] z-30 shadow-md'
          : ''
      } ${isDraggingMe ? 'opacity-30' : 'opacity-100'} cursor-grab active:cursor-grabbing w-[140px] sm:w-[165px] min-w-[140px]`}
    >
      <div className="flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 cursor-grab active:cursor-grabbing transition-colors"
            title="Drag vertically to reorder day row"
          >
            <GripVertical className="w-4 h-4" />
          </span>

          {/* Initial badge circle */}
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
              day.isOffDay
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
            }`}
          >
            {day.name.charAt(0)}
          </div>

          <div className="min-w-0">
            <div className="font-heading font-bold text-sm sm:text-base tracking-tight truncate">
              {day.name}
            </div>
            {day.isOffDay && (
              <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Weekend / Off
              </span>
            )}
          </div>
        </div>

        {/* Action icons & WCAG single-pointer reorder arrows */}
        <div className="flex items-center gap-0.5 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity no-export">
          {onMove && index > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMove(day.id, 'up');
              }}
              className="p-1 rounded-md hover:bg-white/80 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
              title="Shift row up"
              aria-label="Shift row up"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}

          {onMove && index < totalDays - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMove(day.id, 'down');
              }}
              className="p-1 rounded-md hover:bg-white/80 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
              title="Shift row down"
              aria-label="Shift row down"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(day);
            }}
            className="p-1 rounded-md hover:bg-white/80 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Edit day"
            aria-label="Edit day"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(day.id);
            }}
            className="p-1 rounded-md hover:bg-white/80 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete day"
            aria-label="Delete day"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </td>
  );
};
