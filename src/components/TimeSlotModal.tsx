import React, { useState } from 'react';
import type { TimeSlot } from '../types/routine';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import CoffeeIcon from '@mui/icons-material/Coffee';

interface TimeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (slot: Omit<TimeSlot, 'id'> | TimeSlot) => void;
  onDelete?: (slotId: string) => void;
  initialSlot?: TimeSlot | null;
}

const TimeSlotModalContent: React.FC<Omit<TimeSlotModalProps, 'isOpen'>> = ({
  onClose,
  onSave,
  onDelete,
  initialSlot,
}) => {
  const [startTime, setStartTime] = useState(initialSlot?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialSlot?.endTime || '10:00');
  const [label, setLabel] = useState(initialSlot?.label || '');
  const [isBreak, setIsBreak] = useState(!!initialSlot?.isBreak);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTime || !endTime) return;

    if (initialSlot) {
      onSave({
        ...initialSlot,
        startTime,
        endTime,
        label: label.trim(),
        isBreak,
      });
    } else {
      onSave({
        startTime,
        endTime,
        label: label.trim(),
        isBreak,
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
            {initialSlot ? 'Edit Time Slot' : 'Add Time Slot'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#7E8780' }}>
            Set time range and optional label
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#8C948D' }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Start Time"
              type="time"
              required
              size="small"
              fullWidth
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              slotProps={{
                input: { sx: { borderRadius: '12px', fontFamily: '"JetBrains Mono", monospace' } },
                inputLabel: { shrink: true },
              }}
            />

            <TextField
              label="End Time"
              type="time"
              required
              size="small"
              fullWidth
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              slotProps={{
                input: { sx: { borderRadius: '12px', fontFamily: '"JetBrains Mono", monospace' } },
                inputLabel: { shrink: true },
              }}
            />
          </Box>

          <TextField
            label="Slot Label (Optional)"
            size="small"
            fullWidth
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Period 1, Morning Block"
            slotProps={{ input: { sx: { borderRadius: '12px' } } }}
          />

          <Box
            sx={{
              p: 1.5,
              borderRadius: '12px',
              border: '1px solid #EAE4D8',
              backgroundColor: '#FAF5EE',
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isBreak}
                  onChange={(e) => setIsBreak(e.target.checked)}
                  sx={{ color: '#B87352', '&.Mui-checked': { color: '#B87352' } }}
                />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '13px', fontWeight: 600, color: '#4B382A' }}>
                  <CoffeeIcon sx={{ fontSize: 18, color: '#B87352' }} />
                  <span>Mark as Lunch / Recess Break</span>
                </Box>
              }
            />
          </Box>
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
              {initialSlot ? 'Update Slot' : 'Add Slot'}
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
