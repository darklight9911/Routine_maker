import React, { useState } from 'react';
import type { Day, DragState } from '../types/routine';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface DayHeaderProps {
  day: Day;
  index: number;
  totalDays: number;
  isRightColumn?: boolean;
  dragState: DragState;
  onDragStart: (dayId: string) => void;
  onDragEnd: () => void;
  onDrop: (dayId: string) => void;
  onEdit: (day: Day) => void;
  onDelete: (dayId: string) => void;
  onMove?: (dayId: string, direction: 'up' | 'down') => void;
}

export const DayHeader: React.FC<DayHeaderProps> = ({
  day,
  index,
  totalDays,
  isRightColumn = true,
  dragState,
  onDragStart,
  onDragEnd,
  onDrop,
  onEdit,
  onDelete,
  onMove,
}) => {
  const [isOver, setIsOver] = useState(false);
  const isDraggingMe = dragState.type === 'day-row' && dragState.sourceId === day.id;
  const canDropHere = dragState.type === 'day-row' && dragState.sourceId !== day.id;

  return (
    <td
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', day.id);
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(day.id);
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
          onDrop(day.id);
        }
      }}
      style={{
        backgroundColor: day.isOffDay ? '#EFEBE2' : isOver ? '#EBF2ED' : '#F5F1E9',
        borderBottom: '1px solid #E5E0D6',
        borderLeft: isRightColumn ? '1px solid #E5E0D6' : 'none',
        borderRight: !isRightColumn ? '1px solid #E5E0D6' : 'none',
        position: 'sticky',
        right: isRightColumn ? 0 : 'auto',
        left: !isRightColumn ? 0 : 'auto',
        zIndex: 10,
        padding: '12px 14px',
        userSelect: 'none',
        cursor: 'grab',
        width: '150px',
        minWidth: '150px',
        transition: 'all 0.15s ease',
        outline: isOver ? '2px solid #5B7065' : 'none',
        opacity: isDraggingMe ? 0.35 : 1,
        boxShadow: isRightColumn ? '-3px 0 6px rgba(46,51,47,0.03)' : '3px 0 6px rgba(46,51,47,0.03)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
          <DragIndicatorIcon
            sx={{
              fontSize: 16,
              color: '#8C948D',
              cursor: 'grab',
              '&:hover': { color: '#5B7065' },
            }}
          />

          {/* Initial solid circle avatar */}
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '8px',
              backgroundColor: day.isOffDay ? '#DCD6CB' : '#5B7065',
              color: day.isOffDay ? '#556058' : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {day.name.charAt(0)}
          </Box>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                fontSize: '13.5px',
                color: day.isOffDay ? '#68726A' : '#2E332F',
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {day.name}
            </Typography>
            {day.isOffDay && (
              <Box
                sx={{
                  display: 'inline-block',
                  fontSize: '9px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#68726A',
                  backgroundColor: '#E2DCD1',
                  px: 0.75,
                  py: 0.1,
                  borderRadius: '4px',
                  mt: 0.25,
                }}
              >
                Off Day
              </Box>
            )}
          </Box>
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
            <Tooltip title="Shift day up" arrow>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(day.id, 'up');
                }}
                sx={{
                  p: 0.4,
                  color: '#637067',
                  '&:hover': { backgroundColor: '#ECE7DE', color: '#5B7065' },
                }}
              >
                <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}

          {onMove && index < totalDays - 1 && (
            <Tooltip title="Shift day down" arrow>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onMove(day.id, 'down');
                }}
                sx={{
                  p: 0.4,
                  color: '#637067',
                  '&:hover': { backgroundColor: '#ECE7DE', color: '#5B7065' },
                }}
              >
                <KeyboardArrowDownIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Edit day" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(day);
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

          <Tooltip title="Delete day" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(day.id);
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
    </td>
  );
};
