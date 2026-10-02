import type React from 'react';
import type { RoutineData, RoutineItem, Day, TimeSlot, DragState } from '../types/routine';
import { TimeSlotHeader } from './TimeSlotHeader';
import { DayHeader } from './DayHeader';
import { RoutineCell } from './RoutineCell';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

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
      <Paper
        elevation={0}
        sx={{
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          my: 4,
          backgroundColor: '#FFFFFF',
          border: '1px dashed #D8D2C7',
          borderRadius: '20px',
        }}
      >
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '16px',
            backgroundColor: '#F0F5F1',
            color: '#5B7065',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 32 }} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2E332F', mb: 1 }}>
          No Days or Time Slots Configured
        </Typography>
        <Typography variant="body2" sx={{ color: '#68726A', mb: 3, maxWidth: 420 }}>
          Add days of the week and time periods to start organizing your timetable routine.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CalendarMonthIcon />}
            onClick={onAddDayClick}
          >
            Add Day
          </Button>
          <Button
            variant="outlined"
            sx={{ borderColor: '#D8D2C7', color: '#2E332F', '&:hover': { borderColor: '#5B7065' } }}
            startIcon={<AccessTimeIcon />}
            onClick={onAddTimeSlotClick}
          >
            Add Time Slot
          </Button>
        </Box>
      </Paper>
    );
  }

  // Pre-index items by `${dayId}_${timeSlotId}` for instant lookup
  const itemsMap = new Map<string, RoutineItem>();
  routine.items.forEach((item) => {
    itemsMap.set(`${item.dayId}_${item.timeSlotId}`, item);
  });

  return (
    <Paper
      elevation={0}
      className="print-area"
      sx={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E0D6',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(46,51,47,0.04)',
      }}
    >
      <Box sx={{ overflowX: 'auto', overflowY: 'visible' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          {/* UPPER ROW: TIME SLOTS & CORNER DAY HEADER */}
          <thead>
            <tr style={{ position: 'sticky', top: 0, zIndex: 20 }}>
              {/* If day column is on LEFT, render corner here */}
              {!isRightDayCol && (
                <th
                  style={{
                    padding: '6px 10px',
                    backgroundColor: '#EFEBE2',
                    borderBottom: '1px solid #E5E0D6',
                    borderRight: '1px solid #E5E0D6',
                    position: 'sticky',
                    left: 0,
                    zIndex: 30,
                    width: '105px',
                    minWidth: '105px',
                    userSelect: 'none',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#2E332F', fontWeight: 700, fontSize: '12px' }}>
                      <CalendarMonthIcon sx={{ fontSize: 16, color: '#5B7065' }} />
                      <span>Days</span>
                    </Box>
                    <Tooltip title="Add Day" arrow>
                      <IconButton size="small" onClick={onAddDayClick} className="no-export" sx={{ p: 0.25, color: '#5B7065' }}>
                        <AddCircleIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
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
                <th
                  style={{
                    padding: '12px 14px',
                    backgroundColor: '#EFEBE2',
                    borderBottom: '1px solid #E5E0D6',
                    borderLeft: '1px solid #E5E0D6',
                    position: 'sticky',
                    right: 0,
                    zIndex: 30,
                    minWidth: '150px',
                    userSelect: 'none',
                    boxShadow: '-3px 0 6px rgba(46,51,47,0.03)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#2E332F', fontWeight: 700, fontSize: '13px' }}>
                      <CalendarMonthIcon sx={{ fontSize: 18, color: '#5B7065' }} />
                      <span>Days</span>
                    </Box>
                    <Tooltip title="Add Day" arrow>
                      <IconButton size="small" onClick={onAddDayClick} className="no-export" sx={{ color: '#5B7065' }}>
                        <AddCircleIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </th>
              )}
            </tr>
          </thead>

          {/* TABLE ROWS: EACH DAY */}
          <tbody>
            {routine.days.map((day, dIdx) => (
              <tr key={day.id}>
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
                      onDropTimeSlot={onDropTimeSlot}
                      onDropDay={onDropDay}
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
      </Box>
    </Paper>
  );
};
