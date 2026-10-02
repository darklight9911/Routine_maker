import React, { useState } from 'react';
import type { Day, DragState } from '../types/routine';
import { GripVertical, Edit3, Trash2 } from 'lucide-react';

interface DayHeaderProps {
  day: Day;
  isRightColumn?: boolean;
  dragState: DragState;
  onDragStart: (dayId: string) => void;
  onDragEnd: () => void;
  onDrop: (dayId: string) => void;
  onEdit: (day: Day) => void;
  onDelete: (dayId: string) => void;
}

export const DayHeader: React.FC<DayHeaderProps> = ({
  day,
  isRightColumn = true,
  dragState,
  onDragStart,
  onDragEnd,
  onDrop,
  onEdit,
  onDelete,
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
      className={`group relative p-3 sm:p-4 font-bold select-none transition-all duration-200 border-b border-slate-200 dark:border-slate-800 ${
        isRightColumn
          ? 'border-l border-slate-200 dark:border-slate-800 sticky right-0 z-10'
          : 'border-r border-slate-200 dark:border-slate-800 sticky left-0 z-10'
      } ${
        day.isOffDay
          ? 'bg-slate-100/95 dark:bg-slate-900/95 text-slate-500 dark:text-slate-400'
          : 'bg-indigo-50/95 dark:bg-indigo-950/80 text-indigo-950 dark:text-indigo-100'
      } ${
        isOver
          ? 'ring-2 ring-indigo-500 bg-indigo-100 dark:bg-indigo-900/80 scale-[1.02] z-30'
          : ''
      } ${isDraggingMe ? 'opacity-30' : 'opacity-100'} cursor-grab active:cursor-grabbing w-[130px] sm:w-[150px] min-w-[130px] shadow-xs`}
    >
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors"
            title="Drag vertically to reorder day rows"
          >
            <GripVertical className="w-4 h-4" />
          </span>
          <div className="min-w-0">
            <div className="text-sm sm:text-base font-extrabold tracking-tight truncate flex items-center gap-1">
              <span>{day.name}</span>
            </div>
            {day.isOffDay && (
              <span className="inline-block text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                Off Day
              </span>
            )}
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity no-export">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(day);
            }}
            className="p-1 rounded hover:bg-white/80 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors"
            title="Edit day"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(day.id);
            }}
            className="p-1 rounded hover:bg-white/80 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors"
            title="Delete day"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </td>
  );
};
