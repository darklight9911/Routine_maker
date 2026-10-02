import React, { useState } from 'react';
import type { TimeSlot, RoutineSettings, DragState } from '../types/routine';
import { formatTimeRange, calculateDurationMinutes, formatDuration } from '../utils/time';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

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
      style={{
        backgroundColor: slot.isBreak ? '#FAF3E8' : isOver ? '#EBF2ED' : '#F6F3ED',
        borderBottom: '1px solid #E5E0D6',
        borderRight: '1px solid #E5E0D6',
        padding: '6px 8px',
        textAlign: 'left',
        userSelect: 'none',
        minWidth: '130px',
        maxWidth: '180px',
        cursor: 'grab',
        transition: 'all 0.15s ease',
        outline: isOver ? '2px dashed #5B7065' : 'none',
        outlineOffset: '-2px',
        opacity: isDraggingMe ? 0.35 : 1,
      }}
    >
      {/* Top row: Grip & Actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5, gap: 0.5 }}>
        <DragIndicatorIcon
          sx={{
            fontSize: 14,
            color: '#8C948D',
            cursor: 'grab',
            transform: 'rotate(90deg)',
            '&:hover': { color: '#5B7065' },
          }}
        />

        {/* Action icons & WCAG single-pointer reorder buttons */}
        <Box
          className="no-export"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.2,
          }}
        >
          {onMove && index > 0 && (
            <Tooltip title="Left" arrow>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(slot.id, 'left');
                }}
                sx={{
                  p: 0.3,
                  color: '#637067',
                  '&:hover': { backgroundColor: '#ECE7DE', color: '#5B7065' },
                }}
              >
                <ChevronLeftIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
          )}

          {onMove && index < totalSlots - 1 && (
            <Tooltip title="Right" arrow>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(slot.id, 'right');
                }}
                sx={{
                  p: 0.3,
                  color: '#637067',
                  '&:hover': { backgroundColor: '#ECE7DE', color: '#5B7065' },
                }}
              >
                <ChevronRightIcon sx={{ fontSize: 15 }} />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Edit" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(slot);
              }}
              sx={{
                p: 0.3,
                color: '#637067',
                '&:hover': { backgroundColor: '#ECE7DE', color: '#5B7065' },
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(slot.id);
              }}
              sx={{
                p: 0.3,
                color: '#637067',
                '&:hover': { backgroundColor: '#ECE7DE', color: '#C15C5C' },
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main Time display */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AccessTimeIcon sx={{ fontSize: 13, color: '#5B7065' }} />
          <Typography
            variant="body2"
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 700,
              fontSize: '11.5px',
              color: '#2E332F',
            }}
          >
            {formattedRange}
          </Typography>
        </Box>
        {durationMin > 0 && (
          <Typography variant="caption" sx={{ fontSize: '10px', color: '#7E8780', fontFamily: '"JetBrains Mono", monospace' }}>
            {formatDuration(durationMin)}
          </Typography>
        )}
      </Box>
    </th>
  );
};
