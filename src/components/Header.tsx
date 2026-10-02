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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
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
    <Box sx={{ mb: 1.5 }} className="no-print">
      <Paper
        elevation={0}
        sx={{
          px: { xs: 1.5, sm: 2 },
          py: 1,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1.5,
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E0D6',
          borderRadius: '14px',
          boxShadow: '0 1px 4px rgba(46,51,47,0.03)',
        }}
      >
        {/* Left: Brand icon + Title & Subtitle (inline editable) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0, flex: 1 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '9px',
              backgroundColor: '#5B7065',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              flexShrink: 0,
            }}
          >
            <CalendarMonthIcon sx={{ fontSize: 18 }} />
          </Box>

          {isEditingTitle ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, maxWidth: 420 }}>
              <TextField
                size="small"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                placeholder="Title"
                slotProps={{
                  input: {
                    sx: {
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 700,
                      py: 0.2,
                    },
                  },
                }}
                autoFocus
              />
              <IconButton size="small" onClick={handleSaveTitle} sx={{ color: '#5B7065' }}>
                <CheckIcon sx={{ fontSize: 16 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => {
                  setTempTitle(routine.title);
                  setIsEditingTitle(false);
                }}
                sx={{ color: '#8C948D' }}
              >
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          ) : (
            <Box
              onClick={() => {
                setTempTitle(routine.title);
                setTempSubtitle(routine.subtitle || '');
                setIsEditingTitle(true);
              }}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 0.75,
                minWidth: 0,
                '&:hover .edit-icon': { opacity: 1 },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 800,
                  color: '#2E332F',
                  fontSize: '14.5px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {routine.title}
              </Typography>
              {routine.subtitle && (
                <Typography
                  variant="caption"
                  sx={{
                    color: '#8C948D',
                    fontSize: '12px',
                    display: { xs: 'none', md: 'inline' },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  • {routine.subtitle}
                </Typography>
              )}
              <EditIcon
                className="edit-icon"
                sx={{
                  fontSize: 13,
                  color: '#8C948D',
                  opacity: 0,
                  transition: 'opacity 0.15s ease',
                  flexShrink: 0,
                }}
              />
            </Box>
          )}
        </Box>

        {/* Right: Actions (Undo/Redo, Templates, Export, Help) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          {/* Undo & Redo */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FAF8F5',
              border: '1px solid #E5E0D6',
              borderRadius: '10px',
              p: 0.2,
            }}
          >
            <Tooltip title="Undo (Ctrl+Z)" arrow>
              <span>
                <IconButton size="small" disabled={!canUndo} onClick={onUndo} sx={{ p: 0.5, color: '#4A534C' }}>
                  <UndoIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </span>
            </Tooltip>
            <Box sx={{ width: '1px', height: 14, backgroundColor: '#E5E0D6' }} />
            <Tooltip title="Redo (Ctrl+Y)" arrow>
              <span>
                <IconButton size="small" disabled={!canRedo} onClick={onRedo} sx={{ p: 0.5, color: '#4A534C' }}>
                  <RedoIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          <Button
            size="small"
            variant="outlined"
            startIcon={<AutoAwesomeIcon sx={{ fontSize: 15, color: '#B87352' }} />}
            onClick={onOpenTemplates}
            sx={{
              borderColor: '#E5E0D6',
              color: '#2E332F',
              fontSize: '12px',
              py: 0.4,
              px: 1.2,
              '&:hover': { borderColor: '#B87352', backgroundColor: '#FAF4F0' },
            }}
          >
            Templates
          </Button>

          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<FileDownloadIcon sx={{ fontSize: 15 }} />}
            onClick={(e) => setExportAnchorEl(e.currentTarget)}
            sx={{
              backgroundColor: '#2E332F',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '12px',
              py: 0.4,
              px: 1.4,
              '&:hover': { backgroundColor: '#444C46' },
            }}
          >
            {isExporting ? '...' : 'Export'}
          </Button>

          <Menu
            anchorEl={exportAnchorEl}
            open={Boolean(exportAnchorEl)}
            onClose={() => setExportAnchorEl(null)}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: '12px',
                  border: '1px solid #E5E0D6',
                  boxShadow: '0 6px 20px rgba(46,51,47,0.08)',
                  minWidth: 180,
                },
              },
            }}
          >
            <MenuItem onClick={handleExportPNG} sx={{ py: 0.8, fontSize: '12.5px', color: '#2E332F' }}>
              <ListItemIcon>
                <ImageIcon sx={{ fontSize: 16, color: '#5B7065' }} />
              </ListItemIcon>
              <ListItemText primary="PNG Image" />
            </MenuItem>
            <MenuItem onClick={handlePrint} sx={{ py: 0.8, fontSize: '12.5px', color: '#2E332F' }}>
              <ListItemIcon>
                <PrintIcon sx={{ fontSize: 16, color: '#5B7A8C' }} />
              </ListItemIcon>
              <ListItemText primary="Print / PDF" />
            </MenuItem>
            <Box sx={{ my: 0.3, borderTop: '1px solid #ECE7DE' }} />
            <MenuItem onClick={handleExportJSON} sx={{ py: 0.8, fontSize: '12.5px', color: '#2E332F' }}>
              <ListItemIcon>
                <DescriptionIcon sx={{ fontSize: 16, color: '#B87352' }} />
              </ListItemIcon>
              <ListItemText primary="Export JSON" />
            </MenuItem>
            <MenuItem
              onClick={() => {
                setExportAnchorEl(null);
                fileInputRef.current?.click();
              }}
              sx={{ py: 0.8, fontSize: '12.5px', color: '#2E332F' }}
            >
              <ListItemIcon>
                <FileUploadIcon sx={{ fontSize: 16, color: '#886F91' }} />
              </ListItemIcon>
              <ListItemText primary="Import JSON" />
            </MenuItem>
          </Menu>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />

          <Tooltip title="Tips" arrow>
            <IconButton
              size="small"
              onClick={() => setShowHelp(true)}
              sx={{
                p: 0.5,
                border: '1px solid #E5E0D6',
                backgroundColor: '#FAF8F5',
                color: '#5B7065',
                '&:hover': { backgroundColor: '#F0ECE4' },
              }}
            >
              <HelpOutlineIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Clean Tips Dialog */}
      <Dialog
        open={showHelp}
        onClose={() => setShowHelp(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              border: '1px solid #E5E0D6',
              p: 1,
            },
          },
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Tips & Controls
          </Typography>
          <IconButton size="small" onClick={() => setShowHelp(false)}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 2, pt: 0, display: 'flex', flexDirection: 'column', gap: 1.5, fontSize: '13px' }}>
          <Box sx={{ p: 1.25, backgroundColor: '#FAF8F5', borderRadius: '10px', border: '1px solid #E5E0D6' }}>
            <strong>Time Slots:</strong> Drag headers horizontally or use arrow buttons to reorder columns.
          </Box>
          <Box sx={{ p: 1.25, backgroundColor: '#FAF8F5', borderRadius: '10px', border: '1px solid #E5E0D6' }}>
            <strong>Days:</strong> Drag day headers vertically to reorder day rows.
          </Box>
          <Box sx={{ p: 1.25, backgroundColor: '#FAF8F5', borderRadius: '10px', border: '1px solid #E5E0D6' }}>
            <strong>Events:</strong> Drag cards anywhere on the routine grid to move or swap.
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
