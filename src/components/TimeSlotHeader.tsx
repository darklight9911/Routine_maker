import React, { useState } from 'react';
import type { TimeSlot, RoutineSettings, DragState } from '../types/routine';
import { formatTimeRange, calculateDurationMinutes, formatDuration } from '../utils/time';
import { GripHorizontal, Edit3, Trash2, Coffee, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface TimeSlotHeaderProps {
  slot: TimeSlot;
  index: number;
  totalSlots: number;
  settings: RoutineSettings;
  dragState: DragState;
  onDragStart: (slotId: string) => void;
  onDragEnd: () => void;
  onDrop: (slotId: string) => void;
  onEdit: (slot: TimeSlot) => void;
  onDelete: (slotId: string) => void;
  onMove?: (slotId: string, direction: 'left' | 'right') => void;
}

export const TimeSlotHeader: React.FC<TimeSlotHeaderProps> = ({
  slot,
  index,
  totalSlots,
  settings,
  dragState,
  onDragStart,
  onDragEnd,
  onDrop,
  onEdit,
  onDelete,
  onMove,
}) => {
  const [isOver, setIsOver] = useState(false);
  const isDraggingMe = dragState.type === 'time-slot' && dragState.sourceId === slot.id;
  const canDropHere = dragState.type === 'time-slot' && dragState.sourceId !== slot.id;

  const durationMin = calculateDurationMinutes(slot.startTime, slot.endTime);
  const formattedRange = formatTimeRange(slot.startTime, slot.endTime, settings.timeFormat);

  return (
    <th
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', slot.id);
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(slot.id);
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
          onDrop(slot.id);
        }
      }}
      className={`group relative p-3 sm:p-3.5 select-none transition-all duration-200 border-b border-r border-slate-200 dark:border-slate-800/80 ${
        slot.isBreak
          ? 'bg-amber-50/80 dark:bg-amber-950/30'
          : 'bg-slate-100/85 dark:bg-slate-900/85 backdrop-blur-md'
      } ${
        isOver
          ? 'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 scale-[1.01] z-20 shadow-md'
          : ''
      } ${isDraggingMe ? 'opacity-30' : 'opacity-100'} cursor-grab active:cursor-grabbing min-w-[175px] sm:min-w-[205px]`}
    >
      {/* Top row: Label, Duration, Break Badge, Single-pointer reorder controls */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 cursor-grab active:cursor-grabbing transition-colors"
            title="Drag horizontally to reorder time column"
          >
            <GripHorizontal className="w-3.5 h-3.5" />
          </span>

          {slot.label && (
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 truncate">
              {slot.label}
            </span>
          )}

          {slot.isBreak && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 shrink-0">
              <Coffee className="w-2.5 h-2.5" />
              Break
            </span>
          )}
        </div>

        {/* Action icons & WCAG single-pointer reorder arrows */}
        <div className="flex items-center gap-0.5 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity no-export">
          {onMove && index > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMove(slot.id, 'left');
              }}
              className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
              title="Shift column left"
              aria-label="Shift column left"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          )}

          {onMove && index < totalSlots - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMove(slot.id, 'right');
              }}
              className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
              title="Shift column right"
              aria-label="Shift column right"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(slot);
            }}
            className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
            title="Edit time slot"
            aria-label="Edit time slot"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(slot.id);
            }}
            className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            title="Delete time slot"
            aria-label="Delete time slot"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Time display */}
      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold font-mono text-slate-900 dark:text-slate-100 tracking-tight">
        <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
        <span>{formattedRange}</span>
      </div>

      {/* Duration chip */}
      {durationMin > 0 && (
        <div className="inline-block mt-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800/60 px-1.5 py-0.2 rounded-md">
          {formatDuration(durationMin)}
        </div>
      )}
    </th>
  );
};
