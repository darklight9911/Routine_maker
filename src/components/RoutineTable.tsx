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
  onDragStartDay: (dayId: string) => void;
  onDragEndDay: () => void;
  onDropDay: (targetDayId: string) => void;
  onEditDay: (day: Day) => void;
  onDeleteDay: (dayId: string) => void;
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
  onDragStartDay,
  onDragEndDay,
  onDropDay,
  onEditDay,
  onDeleteDay,
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
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center my-6">
        <AlertCircle className="w-12 h-12 text-indigo-500 mb-3" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">
          No Days or Time Slots Configured
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md">
          Start by adding days of the week and time periods to organize your routine.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={onAddDayClick}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-xs transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Add Day
          </button>
          <button
            onClick={onAddTimeSlotClick}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-xl shadow-xs transition-colors"
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
    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950 overflow-hidden print-area">
      {/* Scrollable table container */}
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full border-collapse text-left">
          {/* UPPER ROW: TIME SLOTS & CORNER DAY HEADER */}
          <thead>
            <tr className="sticky top-0 z-20">
              {/* If day column is on LEFT, render corner here */}
              {!isRightDayCol && (
                <th className="p-3 sm:p-4 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-200/90 dark:bg-slate-900/95 border-b border-r border-slate-200 dark:border-slate-800 sticky left-0 z-30 backdrop-blur-xs min-w-[130px] sm:min-w-[150px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Days
                    </span>
                    <button
                      onClick={onAddDayClick}
                      className="p-1 rounded hover:bg-slate-300 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 no-export transition-colors"
                      title="Add new day"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </th>
              )}

              {/* Time slot headers across columns */}
              {routine.timeSlots.map((slot) => (
                <TimeSlotHeader
                  key={slot.id}
                  slot={slot}
                  settings={routine.settings}
                  dragState={dragState}
                  onDragStart={onDragStartTimeSlot}
                  onDragEnd={onDragEndTimeSlot}
                  onDrop={onDropTimeSlot}
                  onEdit={onEditTimeSlot}
                  onDelete={onDeleteTimeSlot}
                />
              ))}

              {/* If day column is on RIGHT (Standard as user requested), render corner here */}
              {isRightDayCol && (
                <th className="p-3 sm:p-4 text-xs font-bold uppercase tracking-wider text-indigo-950 dark:text-indigo-200 bg-indigo-100/90 dark:bg-indigo-950/95 border-b border-l border-slate-200 dark:border-slate-800 sticky right-0 z-30 backdrop-blur-xs min-w-[130px] sm:min-w-[150px]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      Days
                    </span>
                    <button
                      onClick={onAddDayClick}
                      className="p-1 rounded hover:bg-indigo-200 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 no-export transition-colors"
                      title="Add new day"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </th>
              )}
            </tr>
          </thead>

          {/* TABLE ROWS: EACH DAY */}
          <tbody>
            {routine.days.map((day) => (
              <tr key={day.id} className="group/row">
                {/* Left day header if toggled */}
                {!isRightDayCol && (
                  <DayHeader
                    day={day}
                    isRightColumn={false}
                    dragState={dragState}
                    onDragStart={onDragStartDay}
                    onDragEnd={onDragEndDay}
                    onDrop={onDropDay}
                    onEdit={onEditDay}
                    onDelete={onDeleteDay}
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
                    isRightColumn={true}
                    dragState={dragState}
                    onDragStart={onDragStartDay}
                    onDragEnd={onDragEndDay}
                    onDrop={onDropDay}
                    onEdit={onEditDay}
                    onDelete={onDeleteDay}
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
