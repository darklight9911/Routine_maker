import React, { useState } from 'react';
import type { Day } from '../types/routine';
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

interface DayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (day: Omit<Day, 'id'> | Day) => void;
  onDelete?: (dayId: string) => void;
  initialDay?: Day | null;
}

const DayModalContent: React.FC<Omit<DayModalProps, 'isOpen'>> = ({
  onClose,
  onSave,
  onDelete,
  initialDay,
}) => {
  const [name, setName] = useState(initialDay?.name || '');
  const [shortName, setShortName] = useState(initialDay?.shortName || '');
  const [isOffDay, setIsOffDay] = useState(!!initialDay?.isOffDay);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialDay && !shortName) {
      setShortName(val.slice(0, 3));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const short = shortName.trim() || name.trim().slice(0, 3);

    if (initialDay) {
      onSave({
        ...initialDay,
        name: name.trim(),
        shortName: short,
        isOffDay,
      });
    } else {
      onSave({
        name: name.trim(),
        shortName: short,
        isOffDay,
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
            {initialDay ? 'Edit Day' : 'Add Day'}
          </Typography>
          <Typography variant="caption" sx={{ color: '#7E8780' }}>
            Configure timetable day row
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#8C948D' }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Day Name"
            required
            size="small"
            fullWidth
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Saturday, Monday, Day 1"
            slotProps={{ input: { sx: { borderRadius: '12px' } } }}
            autoFocus
          />

          <TextField
            label="Short Abbreviation"
            size="small"
            fullWidth
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
            placeholder="e.g. Sat, Mon"
            slotProps={{
              htmlInput: { maxLength: 4 },
              input: { sx: { borderRadius: '12px', fontFamily: '"JetBrains Mono", monospace' } },
            }}
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
                  checked={isOffDay}
                  onChange={(e) => setIsOffDay(e.target.checked)}
                  sx={{ color: '#5B7065', '&.Mui-checked': { color: '#5B7065' } }}
                />
              }
              label={
                <Box sx={{ fontSize: '13px', fontWeight: 600, color: '#3A423D' }}>
                  Mark as Weekend / Off Day (muted background)
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
          {initialDay && onDelete ? (
            <Button
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => {
                onDelete(initialDay.id);
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
              {initialDay ? 'Update Day' : 'Add Day'}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export const DayModal: React.FC<DayModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <DayModalContent key={props.initialDay?.id || 'new'} {...props} />;
};
