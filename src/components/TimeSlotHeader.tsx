import React, { useState } from 'react';
import type { TimeSlot, RoutineSettings, DragState } from '../types/routine';
import { formatTimeRange, calculateDurationMinutes, formatDuration } from '../utils/time';
import { GripHorizontal, Edit3, Trash2, Coffee, Clock } from 'lucide-react';

interface TimeSlotHeaderProps {
  slot: TimeSlot;
  settings: RoutineSettings;
  dragState: DragState;
  onDragStart: (slotId: string) => void;
  onDragEnd: () => void;
  onDrop: (slotId: string) => void;
  onEdit: (slot: TimeSlot) => void;
  onDelete: (slotId: string) => void;
}

export const TimeSlotHeader: React.FC<TimeSlotHeaderProps> = ({
  slot,
  settings,
  dragState,
  onDragStart,
  onDragEnd,
  onDrop,
  onEdit,
  onDelete,
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
      className={`group relative p-2.5 sm:p-3 font-semibold text-left select-none transition-all duration-200 border-b border-r border-slate-200 dark:border-slate-800 ${
        slot.isBreak
          ? 'bg-amber-50/70 dark:bg-amber-950/30'
          : 'bg-slate-100/90 dark:bg-slate-900/90'
      } ${
        isOver
          ? 'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 scale-[1.02] z-20'
          : ''
      } ${isDraggingMe ? 'opacity-30' : 'opacity-100'} cursor-grab active:cursor-grabbing min-w-[170px] sm:min-w-[195px]`}
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <div className="flex items-center gap-1.5">
          <span
            className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
            title="Drag horizontally to reorder time slots"
          >
            <GripHorizontal className="w-3.5 h-3.5" />
          </span>
          {slot.label && (
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {slot.label}
            </span>
          )}
          {slot.isBreak && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
              <Coffee className="w-2.5 h-2.5" />
              Break
            </span>
          )}
        </div>

        {/* Quick action controls on header */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity no-export">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(slot);
            }}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors"
            title="Edit time slot"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(slot.id);
            }}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors"
            title="Delete time slot"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Time display */}
      <div className="flex items-baseline gap-1 text-xs sm:text-sm font-bold font-mono text-slate-800 dark:text-slate-200 tracking-tight">
        <Clock className="w-3 h-3 text-slate-400 shrink-0 self-center" />
        <span>{formattedRange}</span>
      </div>

      {durationMin > 0 && (
        <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
          {formatDuration(durationMin)}
        </div>
      )}
    </th>
  );
};
