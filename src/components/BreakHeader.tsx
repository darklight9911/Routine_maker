import React, { useState } from 'react';
import type { TimeSlot, RoutineSettings, DragState } from '../types/routine';
import { BREAK_CONFIGS } from '../constants/presets';
import { formatTimeOnly } from '../utils/time';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface BreakHeaderProps {
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

export const BreakHeader: React.FC<BreakHeaderProps> = ({
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

  const breakConfig = BREAK_CONFIGS[slot.breakType || 'lunch'] || BREAK_CONFIGS.other;
  const startFmt = formatTimeOnly(slot.startTime, settings.timeFormat);
  const endFmt = formatTimeOnly(slot.endTime, settings.timeFormat);

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
        backgroundColor: breakConfig.bg,
        borderBottom: '1px solid #E5E0D6',
        borderLeft: `1px dashed ${breakConfig.border}`,
        borderRight: `1px dashed ${breakConfig.border}`,
        padding: '4px 3px',
        textAlign: 'center',
        userSelect: 'none',
        width: '52px',
        minWidth: '52px',
        maxWidth: '52px',
        cursor: 'grab',
        transition: 'all 0.15s ease',
        outline: isOver ? '2px dashed #B87352' : 'none',
        outlineOffset: '-2px',
        opacity: isDraggingMe ? 0.35 : 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.25,
          position: 'relative',
          '&:hover .break-actions': {
            opacity: 1,
          },
        }}
      >
        {/* Top grip & icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.2 }}>
          <DragIndicatorIcon
            sx={{
              fontSize: 11,
              color: '#8C948D',
              cursor: 'grab',
              transform: 'rotate(90deg)',
              '&:hover': { color: breakConfig.text },
            }}
          />
          <span style={{ fontSize: '13px', lineHeight: 1 }}>{breakConfig.icon}</span>
        </Box>

        {/* Break Label Badge */}
        <Box
          sx={{
            px: 0.4,
            py: 0.1,
            borderRadius: '4px',
            backgroundColor: breakConfig.badgeBg,
            fontSize: '9px',
            fontWeight: 800,
            color: breakConfig.text,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            maxWidth: '46px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {slot.label || breakConfig.label}
        </Box>

        {/* Time range compact stack */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '8.5px',
              fontWeight: 700,
              color: breakConfig.text,
              lineHeight: 1.1,
            }}
          >
            {startFmt}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: '8px',
              color: '#8A8275',
              lineHeight: 1,
            }}
          >
            {endFmt}
          </Typography>
        </Box>

        {/* Hover Micro Action Buttons */}
        <Box
          className="break-actions no-export"
          sx={{
            position: 'absolute',
            top: -2,
            right: -2,
            display: 'flex',
            alignItems: 'center',
            gap: 0.1,
            opacity: 0,
            transition: 'opacity 0.15s ease',
            backgroundColor: '#FFFFFF',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            p: 0.1,
          }}
        >
          <Tooltip title="Edit break" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(slot);
              }}
              sx={{ p: 0.2, color: '#556058', '&:hover': { color: '#B87352' } }}
            >
              <EditOutlinedIcon sx={{ fontSize: 11 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove break" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(slot.id);
              }}
              sx={{ p: 0.2, color: '#556058', '&:hover': { color: '#C15C5C' } }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 11 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </th>
  );
};
