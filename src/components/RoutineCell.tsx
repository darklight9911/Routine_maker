import React, { useState } from 'react';
import type { RoutineItem, RoutineSettings, DragState } from '../types/routine';
import { RoutineCard } from './RoutineCard';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';

interface RoutineCellProps {
  dayId: string;
  timeSlotId: string;
  item?: RoutineItem;
  settings: RoutineSettings;
  dragState: DragState;
  onDragStartItem: (itemId: string, dayId: string, timeSlotId: string) => void;
  onDragEndItem: () => void;
  onDropItemToCell: (dayId: string, timeSlotId: string) => void;
  onDropTimeSlot?: (targetSlotId: string) => void;
  onDropDay?: (targetDayId: string) => void;
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
  onDropTimeSlot,
  onDropDay,
  onEditItem,
  onDuplicateItem,
  onDeleteItem,
  onAddClick,
  searchFilter = '',
  categoryFilter = '',
}) => {
  const [isOver, setIsOver] = useState(false);

  const isRoutineItemDragging = dragState.type === 'routine-item';
  const isTimeSlotDragging = dragState.type === 'time-slot' && dragState.sourceId !== timeSlotId;
  const isDayDragging = dragState.type === 'day-row' && dragState.sourceId !== dayId;
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
    if (isRoutineItemDragging || isTimeSlotDragging || isDayDragging) {
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
    if (isTimeSlotDragging && onDropTimeSlot) {
      onDropTimeSlot(timeSlotId);
    } else if (isDayDragging && onDropDay) {
      onDropDay(dayId);
    } else if (isRoutineItemDragging) {
      onDropItemToCell(dayId, timeSlotId);
    }
  };

  return (
    <td
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        padding: '4px',
        borderBottom: '1px solid #EAE6DF',
        borderRight: '1px solid #EAE6DF',
        verticalAlign: 'top',
        minWidth: '130px',
        maxWidth: '180px',
        backgroundColor: isOver
          ? isTimeSlotDragging
            ? '#E6EFE9'
            : isDayDragging
            ? '#F4EFEB'
            : '#EBF2ED'
          : '#FFFFFF',
        outline: isOver ? '2px solid #5B7065' : 'none',
        outlineOffset: '-2px',
        transition: 'background-color 0.15s ease',
      }}
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
        <Box
          onClick={() => onAddClick(dayId, timeSlotId)}
          sx={{
            height: '100%',
            minHeight: '60px',
            borderRadius: '10px',
            border: '1px dashed',
            borderColor: isOver ? '#5B7065' : isRoutineItemDragging ? '#A4B8AB' : '#E8E3DA',
            backgroundColor: isOver ? '#E2EBE5' : isRoutineItemDragging ? '#F4F8F5' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'all 0.15s ease',
            '&:hover': {
              borderColor: '#5B7065',
              backgroundColor: '#F5F8F6',
              '& .add-icon': {
                color: '#5B7065',
                transform: 'scale(1.15)',
              },
            },
          }}
        >
          <AddIcon className="add-icon" sx={{ fontSize: 16, color: '#C5BEB4', transition: 'all 0.15s ease' }} />
        </Box>
      )}
    </td>
  );
};
