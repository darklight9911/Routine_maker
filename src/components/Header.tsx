import React, { useState, useRef } from 'react';
import type { RoutineData } from '../types/routine';
import { exportRoutineAsJSON, exportTableAsImage } from '../utils/storage';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PrintIcon from '@mui/icons-material/Print';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import ImageIcon from '@mui/icons-material/Image';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/Help';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import confetti from 'canvas-confetti';

interface HeaderProps {
  routine: RoutineData;
  onUpdateTitle: (title: string, subtitle?: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenTemplates: () => void;
  onImportRoutine: (data: RoutineData) => void;
}

export const Header: React.FC<HeaderProps> = ({
  routine,
  onUpdateTitle,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onOpenTemplates,
  onImportRoutine,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(routine.title);
  const [tempSubtitle, setTempSubtitle] = useState(routine.subtitle || '');
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveTitle = () => {
    onUpdateTitle(tempTitle.trim() || 'My Routine', tempSubtitle.trim());
    setIsEditingTitle(false);
  };

  const handleExportPNG = async () => {
    setExportAnchorEl(null);
    setIsExporting(true);
    const success = await exportTableAsImage(
      'routine-export-container',
      routine.title.toLowerCase().replace(/[^a-z0-9]/gi, '_') || 'routine'
    );
    setIsExporting(false);
    if (success) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
  };

  const handlePrint = () => {
    setExportAnchorEl(null);
    window.print();
  };

  const handleExportJSON = () => {
    setExportAnchorEl(null);
    exportRoutineAsJSON(routine);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed && Array.isArray(parsed.days) && Array.isArray(parsed.timeSlots)) {
          onImportRoutine(parsed);
          confetti({ particleCount: 50, spread: 60 });
        } else {
          alert('Invalid routine JSON file structure.');
        }
      } catch (err) {
        console.error('Failed to parse JSON file:', err);
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Box sx={{ mb: 3.5 }} className="no-print">
      {/* Top Navbar */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 1.5, sm: 2 },
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E0D6',
          borderRadius: '18px',
          mb: 2.5,
          boxShadow: '0 2px 8px rgba(46,51,47,0.04)',
        }}
      >
        {/* Brand identity */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '14px',
              backgroundColor: '#5B7065',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 6px rgba(91,112,101,0.2)',
            }}
          >
            <CalendarMonthIcon sx={{ fontSize: 24 }} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2E332F', lineHeight: 1.2 }}>
                RoutineCraft
              </Typography>
              <Box
                sx={{
                  fontSize: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  px: 1,
                  py: 0.2,
                  borderRadius: '6px',
                  backgroundColor: '#EAE6DF',
                  color: '#4B534D',
                }}
              >
                No Backend
              </Box>
            </Box>
            <Typography variant="caption" sx={{ color: '#747C76', display: { xs: 'none', sm: 'block' } }}>
              Cozy Timetable & Routine Creator
            </Typography>
          </Box>
        </Box>

        {/* Action Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {/* Undo & Redo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FAF8F5',
              border: '1px solid #E5E0D6',
              borderRadius: '12px',
              p: 0.25,
            }}
          >
            <Tooltip title="Undo (Ctrl+Z)" arrow>
              <span>
                <IconButton
                  size="small"
                  disabled={!canUndo}
                  onClick={onUndo}
                  sx={{ color: '#4A534C' }}
                >
                  <UndoIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Box sx={{ width: '1px', height: 16, backgroundColor: '#E5E0D6', my: 'auto' }} />
            <Tooltip title="Redo (Ctrl+Y)" arrow>
              <span>
                <IconButton
                  size="small"
                  disabled={!canRedo}
                  onClick={onRedo}
                  sx={{ color: '#4A534C' }}
                >
                  <RedoIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          {/* Templates Button */}
          <Button
            variant="outlined"
            startIcon={<AutoAwesomeIcon sx={{ color: '#B87352' }} />}
            onClick={onOpenTemplates}
            sx={{
              borderColor: '#E5E0D6',
              color: '#2E332F',
              fontSize: '13px',
              '&:hover': { borderColor: '#B87352', backgroundColor: '#FAF4F0' },
            }}
          >
            Templates
          </Button>

          {/* Export Dropdown */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<FileDownloadIcon />}
            onClick={(e) => setExportAnchorEl(e.currentTarget)}
            sx={{
              backgroundColor: '#2E332F',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '13px',
              '&:hover': { backgroundColor: '#444C46' },
            }}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>

          <Menu
            anchorEl={exportAnchorEl}
            open={Boolean(exportAnchorEl)}
            onClose={() => setExportAnchorEl(null)}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: '14px',
                  border: '1px solid #E5E0D6',
                  boxShadow: '0 8px 24px rgba(46,51,47,0.08)',
                  minWidth: 200,
                },
              },
            }}
          >
            <MenuItem onClick={handleExportPNG} sx={{ py: 1, fontSize: '13px', color: '#2E332F' }}>
              <ListItemIcon>
                <ImageIcon sx={{ fontSize: 18, color: '#5B7065' }} />
              </ListItemIcon>
              <ListItemText primary="Download PNG Image" />
            </MenuItem>
            <MenuItem onClick={handlePrint} sx={{ py: 1, fontSize: '13px', color: '#2E332F' }}>
              <ListItemIcon>
                <PrintIcon sx={{ fontSize: 18, color: '#5B7A8C' }} />
              </ListItemIcon>
              <ListItemText primary="Print / Save PDF" />
            </MenuItem>
            <Box sx={{ my: 0.5, borderTop: '1px solid #ECE7DE' }} />
            <MenuItem onClick={handleExportJSON} sx={{ py: 1, fontSize: '13px', color: '#2E332F' }}>
              <ListItemIcon>
                <DescriptionIcon sx={{ fontSize: 18, color: '#B87352' }} />
              </ListItemIcon>
              <ListItemText primary="Backup Data (JSON)" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                setExportAnchorEl(null);
                fileInputRef.current?.click();
              }}
              sx={{ py: 1, fontSize: '13px', color: '#2E332F' }}
            >
              <ListItemIcon>
                <FileUploadIcon sx={{ fontSize: 18, color: '#886F91' }} />
              </ListItemIcon>
              <ListItemText primary="Restore Data (JSON)" />
            </MenuItem>
          </Menu>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />

          {/* Help Button */}
          <Tooltip title="Drag & Drop Rules" arrow>
            <IconButton
              onClick={() => setShowHelp(!showHelp)}
              sx={{
                border: '1px solid #E5E0D6',
                backgroundColor: '#FAF8F5',
                color: '#5B7065',
                '&:hover': { backgroundColor: '#F0ECE4' },
              }}
            >
              <HelpOutlineIcon sx={{ fontSize: 19 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Routine Title Banner (Cozy solid tone, NO gradients) */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 3 },
          backgroundColor: '#F5F1E8',
          border: '1px solid #E6E0D4',
          borderRadius: '18px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {isEditingTitle ? (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <TextField
              size="small"
              fullWidth
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              placeholder="Timetable Title"
              slotProps={{
                input: {
                  sx: {
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '16px',
                  },
                },
              }}
              autoFocus
            />
            <TextField
              size="small"
              fullWidth
              value={tempSubtitle}
              onChange={(e) => setTempSubtitle(e.target.value)}
              placeholder="Subtitle (e.g. Semester, department or project)"
              slotProps={{
                input: {
                  sx: {
                    backgroundColor: '#FFFFFF',
                    borderRadius: '10px',
                    fontSize: '13px',
                  },
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                startIcon={<CheckIcon />}
                onClick={handleSaveTitle}
                sx={{ backgroundColor: '#5B7065' }}
              >
                Save
              </Button>
              <Button
                size="small"
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={() => {
                  setTempTitle(routine.title);
                  setTempSubtitle(routine.subtitle || '');
                  setIsEditingTitle(false);
                }}
                sx={{ borderColor: '#D8D2C7', color: '#68726A' }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            onClick={() => {
              setTempTitle(routine.title);
              setTempSubtitle(routine.subtitle || '');
              setIsEditingTitle(true);
            }}
            sx={{ cursor: 'pointer', flex: 1, '&:hover .edit-icon': { opacity: 1 } }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#2E332F', letterSpacing: '-0.01em' }}>
                {routine.title}
              </Typography>
              <EditIcon
                className="edit-icon"
                sx={{
                  fontSize: 16,
                  color: '#5B7065',
                  opacity: 0,
                  transition: 'opacity 0.15s ease',
                }}
              />
            </Box>
            {routine.subtitle && (
              <Typography variant="body2" sx={{ color: '#68726A', mt: 0.5, fontWeight: 500 }}>
                {routine.subtitle}
              </Typography>
            )}
          </Box>
        )}

        {/* Status badges */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.25,
                py: 0.35,
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E0D6',
                color: '#2E332F',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 13, color: '#5B7065' }} />
              <span>Upper Row: Time</span>
            </Box>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.25,
                py: 0.35,
                borderRadius: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E0D6',
                color: '#2E332F',
                fontSize: '11px',
                fontWeight: 700,
              }}
            >
              <ViewWeekIcon sx={{ fontSize: 13, color: '#B87352' }} />
              <span>{routine.settings.dayColumnPosition === 'left' ? 'Leftmost Column: Days' : 'Rightmost Column: Days'}</span>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ color: '#7E8780', fontFamily: '"JetBrains Mono", monospace' }}>
            {routine.days.length} Days • {routine.timeSlots.length} Time Slots • {routine.items.length} Activities
          </Typography>
        </Box>
      </Paper>

      {/* Interactive Rules & Drag-and-Drop Help Card */}
      {showHelp && (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            mt: 2,
            backgroundColor: '#FAF5EE',
            border: '1px solid #EAE0D0',
            borderRadius: '16px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2E332F' }}>
              Drag & Drop Guidelines:
            </Typography>
            <IconButton size="small" onClick={() => setShowHelp(false)}>
              <CloseIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 2,
              fontSize: '12.5px',
              color: '#4B534D',
            }}
          >
            <Box sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EAE0D0' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#5B7065', display: 'block', mb: 0.5 }}>
                Time Slots (Upper Row)
              </Typography>
              Drag time headers horizontally to swap columns, or use the left/right arrow buttons. Only swaps with other time slots.
            </Box>
            <Box sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EAE0D0' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#B87352', display: 'block', mb: 0.5 }}>
                Days (Rightmost Column)
              </Typography>
              Drag day headers vertically to swap day rows, or use the up/down arrow buttons. Only swaps with other days.
            </Box>
            <Box sx={{ p: 1.5, backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #EAE0D0' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#5B7A8C', display: 'block', mb: 0.5 }}>
                Routine Events
              </Typography>
              Drag any event card freely to empty slots or drop on another card to swap positions anywhere on the routine grid.
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
};
