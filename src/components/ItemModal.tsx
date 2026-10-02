import React, { useState } from 'react';
import type { RoutineItem, Day, TimeSlot, RoutineSettings } from '../types/routine';
import { COLOR_PALETTE, CATEGORIES } from '../constants/presets';
import { formatTimeRange } from '../utils/time';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<RoutineItem, 'id'> | RoutineItem) => void;
  onDelete?: (itemId: string) => void;
  initialItem?: RoutineItem | null;
  defaultDayId?: string;
  defaultTimeSlotId?: string;
  days: Day[];
  timeSlots: TimeSlot[];
  settings: RoutineSettings;
}

const ItemModalContent: React.FC<Omit<ItemModalProps, 'isOpen'>> = ({
  onClose,
  onSave,
  onDelete,
  initialItem,
  defaultDayId,
  defaultTimeSlotId,
  days,
  timeSlots,
  settings,
}) => {
  const [title, setTitle] = useState(initialItem?.title || '');
  const [subtitle, setSubtitle] = useState(initialItem?.subtitle || '');
  const [instructor, setInstructor] = useState(initialItem?.instructor || '');
  const [location, setLocation] = useState(initialItem?.location || '');
  const [color, setColor] = useState(initialItem?.color || 'sage');
  const [category, setCategory] = useState(initialItem?.category || 'Lecture');
  const [notes, setNotes] = useState(initialItem?.notes || '');
  const [dayId, setDayId] = useState(initialItem?.dayId || defaultDayId || days[0]?.id || '');
  const [timeSlotId, setTimeSlotId] = useState(initialItem?.timeSlotId || defaultTimeSlotId || timeSlots[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dayId || !timeSlotId) return;

    if (initialItem) {
      onSave({
        ...initialItem,
        title: title.trim(),
        subtitle: subtitle.trim(),
        instructor: instructor.trim(),
        location: location.trim(),
        color,
        category,
        notes: notes.trim(),
        dayId,
        timeSlotId,
      });
    } else {
      onSave({
        title: title.trim(),
        subtitle: subtitle.trim(),
        instructor: instructor.trim(),
        location: location.trim(),
        color,
        category,
        notes: notes.trim(),
        dayId,
        timeSlotId,
      });
    }
    onClose();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            border: '1px solid #E5E0D6',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 16px 40px rgba(46,51,47,0.1)',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #EFECE6',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2E332F' }}>
            {initialItem ? 'Edit Routine Event' : 'New Routine Event'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#7E8780' }}>
            Enter subject details, room, and category
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#8C948D' }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Day & Time Slot Select */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Day of Week</InputLabel>
              <Select
                value={dayId}
                label="Day of Week"
                onChange={(e) => setDayId(e.target.value)}
                sx={{ borderRadius: '12px' }}
              >
                {days.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.name} {d.isOffDay ? '(Off Day)' : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>Time Slot</InputLabel>
              <Select
                value={timeSlotId}
                label="Time Slot"
                onChange={(e) => setTimeSlotId(e.target.value)}
                sx={{ borderRadius: '12px' }}
              >
                {timeSlots.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.label ? `${s.label}: ` : ''}
                    {formatTimeRange(s.startTime, s.endTime, settings.timeFormat)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Title */}
          <TextField
            label="Activity / Subject Title"
            required
            size="small"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Data Structures & Algorithms, Design Meeting"
            slotProps={{ input: { sx: { borderRadius: '12px' } } }}
            autoFocus
          />

          {/* Subtitle & Category */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Code / Subtitle"
              size="small"
              fullWidth
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. CS-201, Sprint 24"
              slotProps={{ input: { sx: { borderRadius: '12px' } } }}
            />

            <FormControl size="small" fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
                sx={{ borderRadius: '12px' }}
              >
                {CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Location & Instructor */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Location / Room / Link"
              size="small"
              fullWidth
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Hall 201, Zoom"
              slotProps={{ input: { sx: { borderRadius: '12px' } } }}
            />

            <TextField
              label="Instructor / Speaker"
              size="small"
              fullWidth
              value={instructor}
              onChange={(e) => setInstructor(e.target.value)}
              placeholder="e.g. Prof. Alan Turing"
              slotProps={{ input: { sx: { borderRadius: '12px' } } }}
            />
          </Box>

          {/* Cozy Solid Color Selector (No gradients) */}
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#4B534D', display: 'block', mb: 1 }}>
              Cozy Accent Color
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {COLOR_PALETTE.map((c) => {
                const isSelected = color === c.id;
                return (
                  <Box
                    key={c.id}
                    onClick={() => setColor(c.id)}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      backgroundColor: c.hex,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #2E332F' : '1px solid rgba(0,0,0,0.1)',
                      boxShadow: isSelected ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                      transition: 'all 0.15s ease',
                      '&:hover': { transform: 'scale(1.08)' },
                    }}
                    title={c.name}
                  >
                    {isSelected && <CheckIcon sx={{ fontSize: 16, color: '#FFFFFF' }} />}
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* Notes */}
          <TextField
            label="Notes / Remarks"
            size="small"
            multiline
            rows={2}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Bring laptop, preparation tasks"
            slotProps={{ input: { sx: { borderRadius: '12px' } } }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            p: 2.5,
            borderTop: '1px solid #EFECE6',
            justifyContent: 'space-between',
          }}
        >
          {initialItem && onDelete ? (
            <Button
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => {
                onDelete(initialItem.id);
                onClose();
              }}
              sx={{ color: '#C15C5C' }}
            >
              Delete
            </Button>
          ) : (
            <Box />
          )}

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="outlined" onClick={onClose} sx={{ borderColor: '#D8D2C7', color: '#68726A' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ backgroundColor: '#5B7065', fontWeight: 700 }}
            >
              {initialItem ? 'Save Changes' : 'Add to Routine'}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export const ItemModal: React.FC<ItemModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <ItemModalContent key={props.initialItem?.id || `${props.defaultDayId}_${props.defaultTimeSlotId}`} {...props} />;
};
