import { useState, useEffect, useMemo } from 'react';
import { useRoutine } from './hooks/useRoutine';
import type { RoutineItem, Day, TimeSlot } from './types/routine';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { RoutineTable } from './components/RoutineTable';
import { ItemModal } from './components/ItemModal';
import { TimeSlotModal } from './components/TimeSlotModal';
import { DayModal } from './components/DayModal';
import { TemplatesModal } from './components/TemplatesModal';
import { StatsDrawer } from './components/StatsDrawer';

export function App() {
  const {
    routine,
    setFullRoutine,
    updateTitle,
    updateSettings,
    historyLength,
    redoLength,
    undo,
    redo,
    addItem,
    updateItem,
    deleteItem,
    duplicateItem,
    clearAllItems,
    addDay,
    updateDay,
    deleteDay,
    addTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    moveTimeSlot,
    moveDay,
    dragState,
    startDrag,
    endDrag,
    dropTimeSlot,
    dropDay,
    dropRoutineItemToCell,
  } = useRoutine();

  // Search & Filter state
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Calculate filtered count
  const filteredItemsCount = useMemo(() => {
    return routine.items.filter((item) => {
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const match =
          item.title.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
          (item.instructor && item.instructor.toLowerCase().includes(q)) ||
          (item.location && item.location.toLowerCase().includes(q)) ||
          (item.notes && item.notes.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (categoryFilter && item.category !== categoryFilter) {
        return false;
      }
      return true;
    }).length;
  }, [routine.items, searchFilter, categoryFilter]);

  // Modals state
  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RoutineItem | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string>('');
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');

  const [timeSlotModalOpen, setTimeSlotModalOpen] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);

  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [editingDay, setEditingDay] = useState<Day | null>(null);

  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [statsDrawerOpen, setStatsDrawerOpen] = useState(false);

  // Global Keyboard shortcuts (Undo: Ctrl+Z / Cmd+Z, Redo: Ctrl+Y / Cmd+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Handlers for Items
  const handleOpenAddItem = (dayId?: string, timeSlotId?: string) => {
    setEditingItem(null);
    setSelectedDayId(dayId || routine.days[0]?.id || '');
    setSelectedSlotId(timeSlotId || routine.timeSlots[0]?.id || '');
    setItemModalOpen(true);
  };

  const handleEditItem = (item: RoutineItem) => {
    setEditingItem(item);
    setSelectedDayId(item.dayId);
    setSelectedSlotId(item.timeSlotId);
    setItemModalOpen(true);
  };

  const handleSaveItem = (itemData: Omit<RoutineItem, 'id'> | RoutineItem) => {
    if ('id' in itemData) {
      updateItem(itemData as RoutineItem);
    } else {
      addItem(itemData);
    }
  };

  // Handlers for Time Slots
  const handleOpenAddTimeSlot = () => {
    setEditingTimeSlot(null);
    setTimeSlotModalOpen(true);
  };

  const handleEditTimeSlot = (slot: TimeSlot) => {
    setEditingTimeSlot(slot);
    setTimeSlotModalOpen(true);
  };

  const handleSaveTimeSlot = (slotData: Omit<TimeSlot, 'id'> | TimeSlot) => {
    if ('id' in slotData) {
      updateTimeSlot(slotData as TimeSlot);
    } else {
      addTimeSlot(slotData);
    }
  };

  // Handlers for Days
  const handleOpenAddDay = () => {
    setEditingDay(null);
    setDayModalOpen(true);
  };

  const handleEditDay = (day: Day) => {
    setEditingDay(day);
    setDayModalOpen(true);
  };

  const handleSaveDay = (dayData: Omit<Day, 'id'> | Day) => {
    if ('id' in dayData) {
      updateDay(dayData as Day);
    } else {
      addDay(dayData);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 aurora-bg grid-pattern">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Navigation & Header */}
        <Header
          routine={routine}
          onUpdateTitle={updateTitle}
          onUndo={undo}
          onRedo={redo}
          canUndo={historyLength > 0}
          canRedo={redoLength > 0}
          onOpenTemplates={() => setTemplatesModalOpen(true)}
          onToggleDarkMode={() =>
            updateSettings({ darkMode: !routine.settings.darkMode })
          }
          isDarkMode={routine.settings.darkMode}
          onImportRoutine={setFullRoutine}
        />

        {/* Toolbar & Controls */}
        <Toolbar
          settings={routine.settings}
          onUpdateSettings={updateSettings}
          searchFilter={searchFilter}
          onSearchChange={setSearchFilter}
          categoryFilter={categoryFilter}
          onCategoryChange={setCategoryFilter}
          onAddItemClick={() => handleOpenAddItem()}
          onAddTimeSlotClick={handleOpenAddTimeSlot}
          onAddDayClick={handleOpenAddDay}
          onOpenStats={() => setStatsDrawerOpen(true)}
          onClearAll={clearAllItems}
          totalFilteredCount={filteredItemsCount}
          totalItemsCount={routine.items.length}
        />

        {/* Exportable Container */}
        <div id="routine-export-container" className="p-1">
          {/* Header visible when printed or captured as image */}
          <div className="hidden print:block mb-4 text-center">
            <h1 className="text-2xl font-bold text-slate-900">{routine.title}</h1>
            {routine.subtitle && (
              <p className="text-sm text-slate-600 mt-1">{routine.subtitle}</p>
            )}
          </div>

          {/* Interactive Timetable Grid */}
          <RoutineTable
            routine={routine}
            dragState={dragState}
            onDragStartTimeSlot={(slotId) => startDrag('time-slot', slotId)}
            onDragEndTimeSlot={endDrag}
            onDropTimeSlot={dropTimeSlot}
            onEditTimeSlot={handleEditTimeSlot}
            onDeleteTimeSlot={deleteTimeSlot}
            onMoveTimeSlot={moveTimeSlot}
            onDragStartDay={(dayId) => startDrag('day-row', dayId)}
            onDragEndDay={endDrag}
            onDropDay={dropDay}
            onEditDay={handleEditDay}
            onDeleteDay={deleteDay}
            onMoveDay={moveDay}
            onDragStartItem={(itemId, dayId, slotId) =>
              startDrag('routine-item', itemId, dayId, slotId)
            }
            onDragEndItem={endDrag}
            onDropItemToCell={dropRoutineItemToCell}
            onEditItem={handleEditItem}
            onDuplicateItem={duplicateItem}
            onDeleteItem={deleteItem}
            onAddCellItem={handleOpenAddItem}
            onAddTimeSlotClick={handleOpenAddTimeSlot}
            onAddDayClick={handleOpenAddDay}
            searchFilter={searchFilter}
            categoryFilter={categoryFilter}
          />
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">RoutineCraft</span>
            <span>•</span>
            <span>Pure Client-Side (No Backend Required)</span>
            <span>•</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">UI/UX Pro Max Design System</span>
          </div>

          <div className="flex items-center gap-3">
            <span>
              Shortcuts: <kbd className="px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 font-mono text-[10px] shadow-2xs">Ctrl+Z</kbd> Undo / <kbd className="px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 font-mono text-[10px] shadow-2xs">Ctrl+Y</kbd> Redo
            </span>
          </div>
        </footer>
      </div>

      {/* Modals & Drawers */}
      <ItemModal
        isOpen={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        onSave={handleSaveItem}
        onDelete={deleteItem}
        initialItem={editingItem}
        defaultDayId={selectedDayId}
        defaultTimeSlotId={selectedSlotId}
        days={routine.days}
        timeSlots={routine.timeSlots}
        settings={routine.settings}
      />

      <TimeSlotModal
        isOpen={timeSlotModalOpen}
        onClose={() => setTimeSlotModalOpen(false)}
        onSave={handleSaveTimeSlot}
        onDelete={deleteTimeSlot}
        initialSlot={editingTimeSlot}
      />

      <DayModal
        isOpen={dayModalOpen}
        onClose={() => setDayModalOpen(false)}
        onSave={handleSaveDay}
        onDelete={deleteDay}
        initialDay={editingDay}
      />

      <TemplatesModal
        isOpen={templatesModalOpen}
        onClose={() => setTemplatesModalOpen(false)}
        onSelectTemplate={setFullRoutine}
      />

      <StatsDrawer
        isOpen={statsDrawerOpen}
        onClose={() => setStatsDrawerOpen(false)}
        routine={routine}
      />
    </div>
  );
}

export default App;
