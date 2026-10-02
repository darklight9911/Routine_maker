import React, { useState } from 'react';
import type { TimeSlot, BreakType } from '../types/routine';
import { BREAK_CONFIGS } from '../constants/presets';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs, { type Dayjs } from 'dayjs';

interface TimeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slot: Omit<TimeSlot, 'id'> | TimeSlot) => void;
  onDelete?: (slotId: string) => void;
  initialSlot?: TimeSlot | null;
  timeFormat?: '12h' | '24h';
}

const parseTimeString = (timeStr: string): Dayjs | null => {
  if (!timeStr) return null;
  const parts = timeStr.split(':');
  if (parts.length < 2) return null;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return null;
  return dayjs().hour(h).minute(m).second(0);
};

const BREAK_OPTIONS: { id: BreakType; label: string; icon: string }[] = [
  { id: 'lunch', label: 'Lunch', icon: '🍱' },
  { id: 'leisure', label: 'Leisure', icon: '☕' },
  { id: 'dinner', label: 'Dinner', icon: '🍲' },
  { id: 'sleep', label: 'Sleep', icon: '🌙' },
  { id: 'snack', label: 'Snack', icon: '🥪' },
  { id: 'other', label: 'Break', icon: '🧘' },
];

const TimeSlotModalContent: React.FC<Omit<TimeSlotModalProps, 'isOpen'>> = ({
  onClose,
  onSave,
  onDelete,
  initialSlot,
  timeFormat = '12h',
}) => {
  const [startTime, setStartTime] = useState(initialSlot?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialSlot?.endTime || '10:00');
  const [label, setLabel] = useState(initialSlot?.label || '');
  const [slotType, setSlotType] = useState<'activity' | 'break'>(
    initialSlot?.isBreak ? 'break' : 'activity'
  );
  const [breakType, setBreakType] = useState<BreakType>(
    initialSlot?.breakType || 'lunch'
  );

  const isBreak = slotType === 'break';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime || !endTime) return;

    const finalLabel = label.trim() || (isBreak ? BREAK_CONFIGS[breakType]?.label || 'Break' : '');

    if (initialSlot) {
      onSave({
        ...initialSlot,
        startTime,
        endTime,
        label: finalLabel,
        isBreak,
        breakType: isBreak ? breakType : undefined,
      });
    } else {
      onSave({
        startTime,
        endTime,
        label: finalLabel,
        isBreak,
        breakType: isBreak ? breakType : undefined,
      });
    }
    onClose();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="xs"
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
            {initialSlot ? (isBreak ? 'Edit Break Intermission' : 'Edit Time Slot') : (isBreak ? 'Add Break Intermission' : 'Add Time Slot')}
          </Typography>
          <Typography variant="caption" sx={{ color: '#7E8780' }}>
            {isBreak ? 'Set leisure, lunch, sleep, or dinner intermission' : 'Set period start and end time'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#8C948D' }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Column vs Break Intermission Toggle */}
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#4A534C', mb: 0.75, display: 'block' }}>
              Column Mode
            </Typography>
            <ToggleButtonGroup
              value={slotType}
              exclusive
              onChange={(_, val) => {
                if (val) setSlotType(val);
              }}
              fullWidth
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  py: 0.75,
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderColor: '#E5E0D6',
                  color: '#637067',
                  '&.Mui-selected': {
                    backgroundColor: '#FAF5EE',
                    color: '#B87352',
                    borderColor: '#B87352',
                    '&:hover': {
                      backgroundColor: '#F7EFE4',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="activity">Regular Column</ToggleButton>
              <ToggleButton value="break">Break Intermission</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* If Break Intermission, show Break Type picker */}
          {isBreak && (
            <Box sx={{ p: 1.5, borderRadius: '12px', backgroundColor: '#FAF8F5', border: '1px solid #E8E2D7' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#4A534C', mb: 1, display: 'block' }}>
                Intermission Style
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                {BREAK_OPTIONS.map((opt) => {
                  const isSelected = breakType === opt.id;
                  return (
                    <Button
                      key={opt.id}
                      type="button"
                      variant={isSelected ? 'contained' : 'outlined'}
                      onClick={() => {
                        setBreakType(opt.id);
                        if (!label || BREAK_OPTIONS.some((o) => o.label === label)) {
                          setLabel(opt.label);
                        }
                      }}
                      sx={{
                        py: 0.75,
                        px: 0.5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.25,
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'none',
                        borderRadius: '10px',
                        backgroundColor: isSelected ? '#5B7065' : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : '#4A534C',
                        borderColor: isSelected ? '#5B7065' : '#E0DACE',
                        '&:hover': {
                          backgroundColor: isSelected ? '#4A5D53' : '#F5F2EC',
                          borderColor: '#5B7065',
                        },
                      }}
                    >
                      <span style={{ fontSize: '16px', lineHeight: 1 }}>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </Button>
                  );
                })}
              </Box>
            </Box>
          )}

          {/* Time Picker Controls */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TimePicker
              label="Start Time"
              value={parseTimeString(startTime)}
              onChange={(newVal: Dayjs | null) => {
                if (newVal && newVal.isValid()) {
                  setStartTime(newVal.format('HH:mm'));
                }
              }}
              ampm={timeFormat === '12h'}
              slotProps={{
                textField: {
                  size: 'small',
                  required: true,
                  fullWidth: true,
                  slotProps: {
                    input: {
                      sx: { borderRadius: '12px', fontFamily: '"JetBrains Mono", monospace' },
                    },
                  },
                },
                popper: {
                  sx: {
                    zIndex: 1400,
                  },
                },
              }}
            />

            <TimePicker
              label="End Time"
              value={parseTimeString(endTime)}
              onChange={(newVal: Dayjs | null) => {
                if (newVal && newVal.isValid()) {
                  setEndTime(newVal.format('HH:mm'));
                }
              }}
              ampm={timeFormat === '12h'}
              slotProps={{
                textField: {
                  size: 'small',
                  required: true,
                  fullWidth: true,
                  slotProps: {
                    input: {
                      sx: { borderRadius: '12px', fontFamily: '"JetBrains Mono", monospace' },
                    },
                  },
                },
                popper: {
                  sx: {
                    zIndex: 1400,
                  },
                },
              }}
            />
          </Box>

          {/* Optional Label */}
          <TextField
            label={isBreak ? 'Break Title (Optional)' : 'Slot Title (Optional)'}
            size="small"
            fullWidth
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={isBreak ? 'e.g. Lunch Recess, Tea Break' : 'Optional label'}
            slotProps={{ input: { sx: { borderRadius: '12px', fontSize: '13px' } } }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            p: 2.5,
            borderTop: '1px solid #EFECE6',
            justifyContent: 'space-between',
          }}
        >
          {initialSlot && onDelete ? (
            <Button
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => {
                onDelete(initialSlot.id);
                onClose();
              }}
              sx={{ color: '#C15C5C', fontSize: '12px' }}
            >
              Delete
            </Button>
          ) : (
            <Box />
          )}

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button variant="outlined" onClick={onClose} sx={{ borderColor: '#D8D2C7', color: '#68726A', fontSize: '12px' }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{ backgroundColor: '#5B7065', fontWeight: 700, fontSize: '12px', '&:hover': { backgroundColor: '#4A5D53' } }}
            >
              {initialSlot ? 'Save Changes' : (isBreak ? 'Add Break' : 'Add Column')}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export const TimeSlotModal: React.FC<TimeSlotModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <TimeSlotModalContent key={props.initialSlot?.id || 'new'} {...props} />;
};

export default TimeSlotModal;
