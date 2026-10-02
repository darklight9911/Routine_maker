import type React from 'react';
import { PRESET_ROUTINES } from '../constants/presets';
import type { RoutineData } from '../types/routine';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import confetti from 'canvas-confetti';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (data: RoutineData) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  const handleSelect = (data: RoutineData) => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
    onSelectTemplate(data);
    onClose();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '24px',
            border: '1px solid #E5E0D6',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 20px 48px rgba(46,51,47,0.1)',
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #EFECE6',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              backgroundColor: '#FAF1ED',
              color: '#B87352',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AutoAwesomeIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2E332F' }}>
              Timetable Templates
            </Typography>
            <Typography variant="caption" sx={{ color: '#7E8780' }}>
              Choose a cozy ready-to-use template or start with a clean slate
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#8C948D' }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2.5,
            pt: 1,
          }}
        >
          {PRESET_ROUTINES.map((preset) => (
            <Card
              key={preset.id}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: '16px',
                border: '1px solid #E5E0D6',
                backgroundColor: '#FAF8F5',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                '&:hover': {
                  borderColor: '#5B7065',
                  boxShadow: '0 6px 16px rgba(46,51,47,0.06)',
                },
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2E332F', mb: 0.5 }}>
                  {preset.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#68726A', fontSize: '12.5px', mb: 2, lineHeight: 1.4 }}>
                  {preset.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
                  <Chip
                    label={`${preset.data.days.length} Days`}
                    size="small"
                    sx={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E0D6', fontSize: '11px', fontWeight: 600 }}
                  />
                  <Chip
                    label={`${preset.data.timeSlots.length} Slots`}
                    size="small"
                    sx={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E0D6', fontSize: '11px', fontWeight: 600 }}
                  />
                  <Chip
                    label={`${preset.data.items.length} Events`}
                    size="small"
                    sx={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E0D6', fontSize: '11px', fontWeight: 600 }}
                  />
                </Box>
              </Box>

              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() => handleSelect(preset.data)}
                sx={{
                  mt: 3,
                  borderColor: '#D8D2C7',
                  color: '#2E332F',
                  fontWeight: 700,
                  fontSize: '12.5px',
                  backgroundColor: '#FFFFFF',
                  '&:hover': {
                    borderColor: '#5B7065',
                    backgroundColor: '#5B7065',
                    color: '#FFFFFF',
                  },
                }}
              >
                Load Template
              </Button>
            </Card>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
