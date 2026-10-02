import type React from 'react';
import type { RoutineData, RoutineItem, Day, TimeSlot, DragState } from '../types/routine';
import { TimeSlotHeader } from './TimeSlotHeader';
import { DayHeader } from './DayHeader';
import { RoutineCell } from './RoutineCell';
import { Calendar, PlusCircle, Clock, AlertCircle } from 'lucide-react';

interface RoutineTableProps {
  routine: RoutineData;
  dragState: DragState;
  onDragStartTimeSlot: (slotId: string) => void;
  onDragEndTimeSlot: () => void;
  onDropTimeSlot: (targetSlotId: string) => void;
  onEditTimeSlot: (slot: TimeSlot) => void;
  onDeleteTimeSlot: (slotId: string) => void;
  onMoveTimeSlot?: (slotId: string, direction: 'left' | 'right') => void;
  onDragStartDay: (dayId: string) => void;
  onDragEndDay: () => void;
  onDropDay: (targetDayId: string) => void;
  onEditDay: (day: Day) => void;
  onDeleteDay: (dayId: string) => void;
  onMoveDay?: (dayId: string, direction: 'up' | 'down') => void;
  onDragStartItem: (itemId: string, dayId: string, timeSlotId: string) => void;
  onDragEndItem: () => void;
  onDropItemToCell: (targetDayId: string, targetTimeSlotId: string) => void;
  onEditItem: (item: RoutineItem) => void;
  onDuplicateItem: (itemId: string) => void;
  onDeleteItem: (itemId: string) => void;
  onAddCellItem: (dayId: string, timeSlotId: string) => void;
  onAddTimeSlotClick: () => void;
  onAddDayClick: () => void;
  searchFilter: string;
  categoryFilter: string;
}

export const RoutineTable: React.FC<RoutineTableProps> = ({
  routine,
  dragState,
  onDragStartTimeSlot,
  onDragEndTimeSlot,
  onDropTimeSlot,
  onEditTimeSlot,
  onDeleteTimeSlot,
  onMoveTimeSlot,
  onDragStartDay,
  onDragEndDay,
  onDropDay,
  onEditDay,
  onDeleteDay,
  onMoveDay,
  onDragStartItem,
  onDragEndItem,
  onDropItemToCell,
  onEditItem,
  onDuplicateItem,
  onDeleteItem,
  onAddCellItem,
  onAddTimeSlotClick,
  onAddDayClick,
  searchFilter,
  categoryFilter,
}) => {
  const isRightDayCol = routine.settings.dayColumnPosition === 'right';

  if (routine.days.length === 0 || routine.timeSlots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center my-6 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h3 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-1.5">
          No Days or Time Slots Configured
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">
          Start by adding days of the week and time periods to organize your routine.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onAddDayClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Add Day
          </button>
          <button
            onClick={onAddTimeSlotClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            Add Time Slot
          </button>
        </div>
      </div>
    );
  }

  // Pre-index items by `${dayId}_${timeSlotId}` for instant lookup
  const itemsMap = new Map<string, RoutineItem>();
  routine.items.forEach((item) => {
    itemsMap.set(`${item.dayId}_${item.timeSlotId}`, item);
  });

  return (
    <div className="relative rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl shadow-slate-200/50 dark:shadow-black/40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl overflow-hidden print-area">
      {/* Scrollable table container */}
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full border-collapse text-left">
          {/* UPPER ROW: TIME SLOTS & CORNER DAY HEADER */}
          <thead>
            <tr className="sticky top-0 z-20">
              {/* If day column is on LEFT, render corner here */}
              {!isRightDayCol && (
                <th className="p-3 sm:p-4 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 bg-slate-200/95 dark:bg-slate-900/95 border-b border-r border-slate-200 dark:border-slate-800 sticky left-0 z-30 backdrop-blur-md min-w-[140px] sm:min-w-[165px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-heading">
                      <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Days
                    </span>
                    <button
                      onClick={onAddDayClick}
                      className="p-1 rounded-md hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 no-export transition-colors cursor-pointer"
                      title="Add new day"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              )}

              {/* Time slot headers across columns */}
              {routine.timeSlots.map((slot, index) => (
                <TimeSlotHeader
                  key={slot.id}
                  slot={slot}
                  index={index}
                  totalSlots={routine.timeSlots.length}
                  settings={routine.settings}
                  dragState={dragState}
                  onDragStart={onDragStartTimeSlot}
                  onDragEnd={onDragEndTimeSlot}
                  onDrop={onDropTimeSlot}
                  onEdit={onEditTimeSlot}
                  onDelete={onDeleteTimeSlot}
                  onMove={onMoveTimeSlot}
                />
              ))}

              {/* If day column is on RIGHT (Standard as user requested: rightmost column will be days) */}
              {isRightDayCol && (
                <th className="p-3 sm:p-4 text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200 bg-indigo-100/95 dark:bg-indigo-950/95 border-b border-l border-slate-200 dark:border-slate-800 sticky right-0 z-30 backdrop-blur-md min-w-[140px] sm:min-w-[165px] shadow-[-4px_0_12px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-heading">
                      <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Days
                    </span>
                    <button
                      onClick={onAddDayClick}
                      className="p-1 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 no-export transition-colors cursor-pointer"
                      title="Add new day"
                    >
                      <PlusCircle className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              )}
            </tr>
          </thead>

          {/* TABLE ROWS: EACH DAY */}
          <tbody>
            {routine.days.map((day, dIdx) => (
              <tr key={day.id} className="group/row">
                {/* Left day header if toggled */}
                {!isRightDayCol && (
                  <DayHeader
                    day={day}
                    index={dIdx}
                    totalDays={routine.days.length}
                    isRightColumn={false}
                    dragState={dragState}
                    onDragStart={onDragStartDay}
                    onDragEnd={onDragEndDay}
                    onDrop={onDropDay}
                    onEdit={onEditDay}
                    onDelete={onDeleteDay}
                    onMove={onMoveDay}
                  />
                )}

                {/* Content cells across all time slots */}
                {routine.timeSlots.map((slot) => {
                  const cellItem = itemsMap.get(`${day.id}_${slot.id}`);
                  return (
                    <RoutineCell
                      key={`${day.id}_${slot.id}`}
                      dayId={day.id}
                      timeSlotId={slot.id}
                      item={cellItem}
                      settings={routine.settings}
                      dragState={dragState}
                      onDragStartItem={onDragStartItem}
                      onDragEndItem={onDragEndItem}
                      onDropItemToCell={onDropItemToCell}
                      onEditItem={onEditItem}
                      onDuplicateItem={onDuplicateItem}
                      onDeleteItem={onDeleteItem}
                      onAddClick={onAddCellItem}
                      searchFilter={searchFilter}
                      categoryFilter={categoryFilter}
                    />
                  );
                })}

                {/* Right day header (Default as user requested: rightmost column will be days) */}
                {isRightDayCol && (
                  <DayHeader
                    day={day}
                    index={dIdx}
                    totalDays={routine.days.length}
                    isRightColumn={true}
                    dragState={dragState}
                    onDragStart={onDragStartDay}
                    onDragEnd={onDragEndDay}
                    onDrop={onDropDay}
                    onEdit={onEditDay}
                    onDelete={onDeleteDay}
                    onMove={onMoveDay}
                  />
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
