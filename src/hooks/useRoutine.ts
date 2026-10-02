import { useState, useEffect, useCallback, useRef } from 'react';
import type { RoutineData, RoutineItem, Day, TimeSlot, RoutineSettings, DragState, DragItemType } from '../types/routine';
import { loadRoutineFromStorage, saveRoutineToStorage } from '../utils/storage';

export function useRoutine() {
  const [routine, setRoutine] = useState<RoutineData>(() => {
    const loaded = loadRoutineFromStorage();
    if (!loaded.settings || loaded.settings.dayColumnPosition !== 'left' || loaded.settings.compactMode === false) {
      return {
        ...loaded,
        settings: {
          ...loaded.settings,
          dayColumnPosition: 'left',
          compactMode: true,
        },
      };
    }
    return loaded;
  });
  const [history, setHistory] = useState<RoutineData[]>([]);
  const [redoStack, setRedoStack] = useState<RoutineData[]>([]);
  
  // Drag state
  const [dragState, setDragState] = useState<DragState>({
    type: null,
    sourceId: null,
  });

  const [activeDropTarget, setActiveDropTarget] = useState<string | null>(null);

  // Sync to local storage
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    saveRoutineToStorage(routine);
  }, [routine]);

  // Apply dark mode class to html document
  useEffect(() => {
    if (routine.settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [routine.settings.darkMode]);

  // Record history snapshot before mutating
  const pushHistory = useCallback((currentData: RoutineData) => {
    setHistory((prev) => [...prev.slice(-30), currentData]); // keep last 30 states
    setRedoStack([]);
  }, []);

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, prev.length - 1));
    setRedoStack((prev) => [...prev, routine]);
    setRoutine(previous);
  }, [history, routine]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    setHistory((prev) => [...prev, routine]);
    setRoutine(next);
  }, [redoStack, routine]);

  // Update whole routine (e.g. from preset or import)
  const setFullRoutine = useCallback((newData: RoutineData) => {
    pushHistory(routine);
    setRoutine(newData);
  }, [routine, pushHistory]);

  const updateTitle = useCallback((title: string, subtitle?: string) => {
    pushHistory(routine);
    setRoutine((prev) => ({
      ...prev,
      title,
      subtitle: subtitle !== undefined ? subtitle : prev.subtitle,
    }));
  }, [routine, pushHistory]);

  const updateSettings = useCallback((newSettings: Partial<RoutineSettings>) => {
    setRoutine((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }, []);

  // --- ITEM CRUD ---
  const addItem = useCallback((itemData: Omit<RoutineItem, 'id'>) => {
    pushHistory(routine);
    const newItem: RoutineItem = {
      ...itemData,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setRoutine((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    return newItem;
  }, [routine, pushHistory]);

  const updateItem = useCallback((updated: RoutineItem) => {
    pushHistory(routine);
    setRoutine((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === updated.id ? updated : it)),
    }));
  }, [routine, pushHistory]);

  const deleteItem = useCallback((itemId: string) => {
    pushHistory(routine);
    setRoutine((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== itemId),
    }));
  }, [routine, pushHistory]);

  const duplicateItem = useCallback((itemId: string) => {
    const itemToClone = routine.items.find((it) => it.id === itemId);
    if (!itemToClone) return;
    pushHistory(routine);
    const cloned: RoutineItem = {
      ...itemToClone,
      id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `${itemToClone.title} (Copy)`,
    };
    setRoutine((prev) => ({
      ...prev,
      items: [...prev.items, cloned],
    }));
  }, [routine, pushHistory]);

  const clearAllItems = useCallback(() => {
    pushHistory(routine);
    setRoutine((prev) => ({
      ...prev,
      items: [],
    }));
  }, [routine, pushHistory]);

  // --- DAY CRUD ---
  const addDay = useCallback((dayData: Omit<Day, 'id'>) => {
    pushHistory(routine);
    const newDay: Day = {
      ...dayData,
      id: `day-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setRoutine((prev) => ({
      ...prev,
      days: [...prev.days, newDay],
    }));
  }, [routine, pushHistory]);

  const updateDay = useCallback((updated: Day) => {
    pushHistory(routine);
    setRoutine((prev) => ({
      ...prev,
      days: prev.days.map((d) => (d.id === updated.id ? updated : d)),
    }));
  }, [routine, pushHistory]);

  const deleteDay = useCallback((dayId: string) => {
    if (routine.days.length <= 1) return; // Keep at least 1 day
    pushHistory(routine);
    setRoutine((prev) => ({
      ...prev,
      days: prev.days.filter((d) => d.id !== dayId),
      items: prev.items.filter((it) => it.dayId !== dayId),
    }));
  }, [routine, pushHistory]);

  // --- TIME SLOT CRUD ---
  const addTimeSlot = useCallback((slotData: Omit<TimeSlot, 'id'>) => {
    pushHistory(routine);
    const newSlot: TimeSlot = {
      ...slotData,
      id: `slot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setRoutine((prev) => ({
      ...prev,
      timeSlots: [...prev.timeSlots, newSlot],
    }));
  }, [routine, pushHistory]);

  const updateTimeSlot = useCallback((updated: TimeSlot) => {
    pushHistory(routine);
    setRoutine((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.map((s) => (s.id === updated.id ? updated : s)),
    }));
  }, [routine, pushHistory]);

  const deleteTimeSlot = useCallback((slotId: string) => {
    if (routine.timeSlots.length <= 1) return; // Keep at least 1 slot
    pushHistory(routine);
    setRoutine((prev) => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((s) => s.id !== slotId),
      items: prev.items.filter((it) => it.timeSlotId !== slotId),
    }));
  }, [routine, pushHistory]);

  // --- DRAG AND DROP HANDLERS ---
  const startDrag = useCallback((type: DragItemType, sourceId: string, sourceDayId?: string, sourceTimeSlotId?: string) => {
    setDragState({
      type,
      sourceId,
      sourceDayId,
      sourceTimeSlotId,
    });
  }, []);

  const endDrag = useCallback(() => {
    setDragState({ type: null, sourceId: null });
    setActiveDropTarget(null);
  }, []);

  // 1. Time slots can only be dragged with time slots
  const dropTimeSlot = useCallback((targetSlotId: string) => {
    if (dragState.type !== 'time-slot' || !dragState.sourceId || dragState.sourceId === targetSlotId) {
      endDrag();
      return;
    }

    pushHistory(routine);
    setRoutine((prev) => {
      const sourceIndex = prev.timeSlots.findIndex((s) => s.id === dragState.sourceId);
      const targetIndex = prev.timeSlots.findIndex((s) => s.id === targetSlotId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;

      const newSlots = [...prev.timeSlots];
      const [removed] = newSlots.splice(sourceIndex, 1);
      newSlots.splice(targetIndex, 0, removed);

      return {
        ...prev,
        timeSlots: newSlots,
      };
    });

    endDrag();
  }, [dragState, routine, pushHistory, endDrag]);

  // 2. Days can only be switched by dragging with days
  const dropDay = useCallback((targetDayId: string) => {
    if (dragState.type !== 'day-row' || !dragState.sourceId || dragState.sourceId === targetDayId) {
      endDrag();
      return;
    }

    pushHistory(routine);
    setRoutine((prev) => {
      const sourceIndex = prev.days.findIndex((d) => d.id === dragState.sourceId);
      const targetIndex = prev.days.findIndex((d) => d.id === targetDayId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;

      const newDays = [...prev.days];
      const [removed] = newDays.splice(sourceIndex, 1);
      newDays.splice(targetIndex, 0, removed);

      return {
        ...prev,
        days: newDays,
      };
    });

    endDrag();
  }, [dragState, routine, pushHistory, endDrag]);

  // Single-pointer alternatives to dragging (WCAG 2.2 AA requirement)
  const moveTimeSlot = useCallback((slotId: string, direction: 'left' | 'right') => {
    const idx = routine.timeSlots.findIndex((s) => s.id === slotId);
    if (idx === -1) return;
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= routine.timeSlots.length) return;

    pushHistory(routine);
    setRoutine((prev) => {
      const newSlots = [...prev.timeSlots];
      const [removed] = newSlots.splice(idx, 1);
      newSlots.splice(targetIdx, 0, removed);
      return { ...prev, timeSlots: newSlots };
    });
  }, [routine, pushHistory]);

  const moveDay = useCallback((dayId: string, direction: 'up' | 'down') => {
    const idx = routine.days.findIndex((d) => d.id === dayId);
    if (idx === -1) return;
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= routine.days.length) return;

    pushHistory(routine);
    setRoutine((prev) => {
      const newDays = [...prev.days];
      const [removed] = newDays.splice(idx, 1);
      newDays.splice(targetIdx, 0, removed);
      return { ...prev, days: newDays };
    });
  }, [routine, pushHistory]);

  // 3. Routine contents can be dragged and switched anywhere among routine contents
  const dropRoutineItemToCell = useCallback((targetDayId: string, targetTimeSlotId: string) => {
    if (dragState.type !== 'routine-item' || !dragState.sourceId) {
      endDrag();
      return;
    }

    const sourceItem = routine.items.find((it) => it.id === dragState.sourceId);
    if (!sourceItem) {
      endDrag();
      return;
    }

    // Check if dropping onto same cell
    if (sourceItem.dayId === targetDayId && sourceItem.timeSlotId === targetTimeSlotId) {
      endDrag();
      return;
    }

    pushHistory(routine);

    // Find any item currently occupying target cell
    const targetItem = routine.items.find(
      (it) => it.dayId === targetDayId && it.timeSlotId === targetTimeSlotId
    );

    setRoutine((prev) => {
      let updatedItems = [...prev.items];

      if (targetItem) {
        // Swap: target item gets source item's dayId & timeSlotId,
        // and source item gets target cell coordinates!
        updatedItems = updatedItems.map((item) => {
          if (item.id === sourceItem.id) {
            return { ...item, dayId: targetDayId, timeSlotId: targetTimeSlotId };
          }
          if (item.id === targetItem.id) {
            return { ...item, dayId: sourceItem.dayId, timeSlotId: sourceItem.timeSlotId };
          }
          return item;
        });
      } else {
        // Move to empty cell
        updatedItems = updatedItems.map((item) => {
          if (item.id === sourceItem.id) {
            return { ...item, dayId: targetDayId, timeSlotId: targetTimeSlotId };
          }
          return item;
        });
      }

      return {
        ...prev,
        items: updatedItems,
      };
    });

    endDrag();
  }, [dragState, routine, pushHistory, endDrag]);

  return {
    routine,
    setFullRoutine,
    updateTitle,
    updateSettings,
    historyLength: history.length,
    redoLength: redoStack.length,
    undo,
    redo,
    // Item CRUD
    addItem,
    updateItem,
    deleteItem,
    duplicateItem,
    clearAllItems,
    // Day CRUD
    addDay,
    updateDay,
    deleteDay,
    // TimeSlot CRUD
    addTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    moveTimeSlot,
    moveDay,
    // DnD
    dragState,
    activeDropTarget,
    setActiveDropTarget,
    startDrag,
    endDrag,
    dropTimeSlot,
    dropDay,
    dropRoutineItemToCell,
  };
}
