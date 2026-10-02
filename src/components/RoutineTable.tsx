import type React from 'react';
import type { RoutineData, RoutineItem, Day, TimeSlot, DragState } from '../types/routine';
import { TimeSlotHeader } from './TimeSlotHeader';
import { DayHeader } from './DayHeader';
import { RoutineCell } from './RoutineCell';
import { DiagonalHeaderCell } from './DiagonalHeaderCell';
import { BreakHeader } from './BreakHeader';
import { BreakStripCell } from './BreakStripCell';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
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
  const itemsMap = new Map<string, RoutineItem[]>();
  routine.items.forEach((item) => {
    const key = `${item.dayId}_${item.timeSlotId}`;
    const list = itemsMap.get(key) || [];
    list.push(item);
    itemsMap.set(key, list);
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
              {/* If day column is on LEFT, render diagonal slope corner cell */}
              {!isRightDayCol && (
                <DiagonalHeaderCell
                  isRightColumn={false}
                  onAddDayClick={onAddDayClick}
                />
              )}

              {/* Time slot headers across columns */}
              {routine.timeSlots.map((slot, index) => {
                if (slot.isBreak) {
                  return (
                    <BreakHeader
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
                  );
                }

                return (
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
                );
              })}

              {/* In-table Add Column action header */}
              <th
                className="no-export no-print"
                style={{
                  padding: '4px 6px',
                  backgroundColor: '#FAF8F5',
                  borderBottom: '1px solid #E5E0D6',
                  [isRightDayCol ? 'borderRight' : 'borderLeft']: '1px solid #E5E0D6',
                  width: '62px',
                  minWidth: '62px',
                  maxWidth: '62px',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                }}
              >
                <Tooltip title="Add Column / Time Slot" arrow>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={onAddTimeSlotClick}
                    sx={{
                      minWidth: 'unset',
                      width: '100%',
                      height: '42px',
                      p: 0,
                      border: '1px dashed #C9C2B5',
                      borderRadius: '8px',
                      color: '#637067',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.2,
                      fontSize: '9.5px',
                      fontWeight: 700,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#5B7065',
                        color: '#5B7065',
                        backgroundColor: '#F0F5F1',
                      },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 15 }} />
                    <span>+ Col</span>
                  </Button>
                </Tooltip>
              </th>

              {/* If day column is on RIGHT, render diagonal slope corner cell */}
              {isRightDayCol && (
                <DiagonalHeaderCell
                  isRightColumn={true}
                  onAddDayClick={onAddDayClick}
                />
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
                  if (slot.isBreak) {
                    if (dIdx !== 0) return null;
                    return (
                      <BreakStripCell
                        key={slot.id}
                        slot={slot}
                        rowSpan={routine.days.length}
                        onEditSlot={onEditTimeSlot}
                      />
                    );
                  }

                  const cellItems = itemsMap.get(`${day.id}_${slot.id}`) || [];
                  return (
                    <RoutineCell
                      key={`${day.id}_${slot.id}`}
                      dayId={day.id}
                      timeSlotId={slot.id}
                      items={cellItems}
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

                {/* In-table Add Column ghost placeholder */}
                <td
                  className="no-export no-print"
                  style={{
                    padding: '4px',
                    borderBottom: '1px solid #F0ECE4',
                    borderLeft: isRightDayCol ? 'none' : '1px solid #F0ECE4',
                    borderRight: isRightDayCol ? '1px solid #F0ECE4' : 'none',
                    backgroundColor: '#FCFAF7',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      minHeight: '44px',
                      borderRadius: '6px',
                      border: '1px dashed #ECE7DE',
                    }}
                  />
                </td>

                {/* Right day header */}
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
