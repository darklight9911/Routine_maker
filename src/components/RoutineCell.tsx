import React, { useState } from 'react';
import type { RoutineItem, RoutineSettings, DragState } from '../types/routine';
import { RoutineCard } from './RoutineCard';
import { Plus } from 'lucide-react';

interface RoutineCellProps {
  dayId: string;
  timeSlotId: string;
  item?: RoutineItem;
  settings: RoutineSettings;
  dragState: DragState;
  onDragStartItem: (itemId: string, dayId: string, timeSlotId: string) => void;
  onDragEndItem: () => void;
  onDropItemToCell: (dayId: string, timeSlotId: string) => void;
  onEditItem: (item: RoutineItem) => void;
  onDuplicateItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onAddClick: (dayId: string, timeSlotId: string) => void;
  searchFilter?: string;
  categoryFilter?: string;
}

export const RoutineCell: React.FC<RoutineCellProps> = ({
  dayId,
  timeSlotId,
  item,
  settings,
  dragState,
  onDragStartItem,
  onDragEndItem,
  onDropItemToCell,
  onEditItem,
  onDuplicateItem,
  onDeleteItem,
  onAddClick,
  searchFilter = '',
  categoryFilter = '',
}) => {
  const [isOver, setIsOver] = useState(false);

  const isRoutineItemDragging = dragState.type === 'routine-item';
  const isThisItemDragging = isRoutineItemDragging && dragState.sourceId === item?.id;

  // Filter check
  let isHighlighted = true;
  if (item) {
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const match =
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
        (item.instructor && item.instructor.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q));
      if (!match) isHighlighted = false;
    }
    if (categoryFilter && item.category !== categoryFilter) {
      isHighlighted = false;
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    // Only allow routine-item drops, never time slots or day rows
    if (isRoutineItemDragging) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setIsOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    if (isRoutineItemDragging) {
      onDropItemToCell(dayId, timeSlotId);
    }
  };

  return (
    <td
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`p-1.5 sm:p-2 border-b border-r border-slate-200 dark:border-slate-800 transition-all duration-200 align-top min-w-[170px] sm:min-w-[195px] max-w-[240px] ${
        isOver
          ? 'bg-indigo-50/80 dark:bg-indigo-950/60 ring-2 ring-indigo-500 ring-inset'
          : 'bg-white dark:bg-slate-950/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/30'
      }`}
    >
      {item ? (
        <RoutineCard
          item={item}
          settings={settings}
          isDragging={isThisItemDragging}
          onEdit={onEditItem}
          onDuplicate={onDuplicateItem}
          onDelete={onDeleteItem}
          onDragStart={(e) => {
            e.dataTransfer.setData('text/plain', item.id);
            e.dataTransfer.effectAllowed = 'move';
            onDragStartItem(item.id, dayId, timeSlotId);
          }}
          onDragEnd={onDragEndItem}
          isHighlighted={isHighlighted}
        />
      ) : (
        <div
          onClick={() => onAddClick(dayId, timeSlotId)}
          className={`h-full min-h-[78px] sm:min-h-[88px] rounded-xl border border-dashed transition-all flex flex-col items-center justify-center cursor-pointer group ${
            isOver
              ? 'border-indigo-500 bg-indigo-100/50 dark:bg-indigo-900/40 text-indigo-600 scale-[0.98]'
              : 'border-slate-200 dark:border-slate-800/80 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 text-slate-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400'
          }`}
        >
          <div className="flex items-center gap-1 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-105">
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </div>
          {isOver && (
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-300">
              Drop here to place
            </span>
          )}
        </div>
      )}
    </td>
  );
};
