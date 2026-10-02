import React, { useState } from 'react';
import type { TimeSlot, RoutineSettings, DragState } from '../types/routine';
import { formatTimeRange, calculateDurationMinutes, formatDuration } from '../utils/time';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import CoffeeIcon from '@mui/icons-material/Coffee';
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
        padding: '12px 14px',
        textAlign: 'left',
        userSelect: 'none',
        minWidth: '180px',
        maxWidth: '240px',
        cursor: 'grab',
        transition: 'all 0.15s ease',
        outline: isOver ? '2px solid #5B7065' : 'none',
        opacity: isDraggingMe ? 0.35 : 1,
      }}
    >
      {/* Top row: Grip, Label, Break Status, Single-pointer arrows */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
          <DragIndicatorIcon
            sx={{
              fontSize: 16,
              color: '#8C948D',
              cursor: 'grab',
              transform: 'rotate(90deg)',
              '&:hover': { color: '#5B7065' },
            }}
          />

          {slot.label && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: '11px',
                color: '#3B423D',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {slot.label}
            </Typography>
          )}

          {slot.isBreak && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.4,
                px: 1,
                py: 0.2,
                borderRadius: '6px',
                backgroundColor: '#F5E6D3',
                color: '#6E451A',
                fontSize: '10px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <CoffeeIcon sx={{ fontSize: 12 }} />
              <span>Break</span>
            </Box>
          )}
        </Box>

        {/* Action icons & WCAG single-pointer reorder buttons */}
        <Box
          className="no-export"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
          }}
        >
          {onMove && index > 0 && (
            <Tooltip title="Move column left" arrow>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(slot.id, 'left');
                }}
                sx={{
                  p: 0.4,
                  color: '#637067',
                  '&:hover': { backgroundColor: '#ECE7DE', color: '#5B7065' },
                }}
              >
                <ChevronLeftIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}

          {onMove && index < totalSlots - 1 && (
            <Tooltip title="Move column right" arrow>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(slot.id, 'right');
                }}
                sx={{
                  p: 0.4,
                  color: '#637067',
                  '&:hover': { backgroundColor: '#ECE7DE', color: '#5B7065' },
                }}
              >
                <ChevronRightIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Edit slot" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(slot);
              }}
              sx={{
                p: 0.4,
                color: '#637067',
                '&:hover': { backgroundColor: '#ECE7DE', color: '#5B7065' },
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete slot" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(slot.id);
              }}
              sx={{
                p: 0.4,
                color: '#637067',
                '&:hover': { backgroundColor: '#ECE7DE', color: '#C15C5C' },
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main Time display */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <AccessTimeIcon sx={{ fontSize: 15, color: '#5B7065' }} />
        <Typography
          variant="body2"
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 700,
            fontSize: '13px',
            color: '#2E332F',
          }}
        >
          {formattedRange}
        </Typography>
      </Box>

      {/* Duration chip */}
      {durationMin > 0 && (
        <Box
          sx={{
            display: 'inline-block',
            mt: 0.75,
            px: 0.8,
            py: 0.15,
            borderRadius: '6px',
            backgroundColor: '#ECE7DE',
            color: '#556058',
            fontSize: '10.5px',
            fontWeight: 600,
          }}
        >
          {formatDuration(durationMin)}
        </Box>
      )}
    </th>
  );
};
