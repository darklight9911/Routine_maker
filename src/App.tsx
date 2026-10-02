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
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { cozyTheme } from './theme';

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
    <ThemeProvider theme={cozyTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#FAF8F5',
          color: '#2E332F',
          py: { xs: 3, sm: 4 },
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Header */}
          <Header
            routine={routine}
            onUpdateTitle={updateTitle}
            onUndo={undo}
            onRedo={redo}
            canUndo={historyLength > 0}
            canRedo={redoLength > 0}
            onOpenTemplates={() => setTemplatesModalOpen(true)}
            onImportRoutine={setFullRoutine}
          />

          {/* Toolbar */}
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
          <Box id="routine-export-container">
            {/* Header visible when printed or captured as image */}
            <Box className="hidden print:block" sx={{ mb: 2, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#2E332F' }}>
                {routine.title}
              </Typography>
              {routine.subtitle && (
                <Typography variant="body2" sx={{ color: '#68726A', mt: 0.5 }}>
                  {routine.subtitle}
                </Typography>
              )}
            </Box>

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
          </Box>

          {/* Footer */}
          <Box
            className="no-print"
            sx={{
              mt: 4,
              pt: 3,
              borderTop: '1px solid #EAE6DF',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
              fontSize: '12px',
              color: '#747C76',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#4A534C' }}>
                RoutineCraft
              </Typography>
              <span>•</span>
              <Typography variant="caption" sx={{ color: '#747C76' }}>
                Material UI Cozy Light Theme
              </Typography>
              <span>•</span>
              <Typography variant="caption" sx={{ color: '#747C76' }}>
                Pure Client-Side
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="caption" sx={{ color: '#747C76' }}>
                Shortcuts: <kbd style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#EDE9E1', border: '1px solid #DFDAD0' }}>Ctrl+Z</kbd> Undo / <kbd style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#EDE9E1', border: '1px solid #DFDAD0' }}>Ctrl+Y</kbd> Redo
              </Typography>
            </Box>
          </Box>
        </Container>

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
      </Box>
    </ThemeProvider>
  );
}

export default App;
