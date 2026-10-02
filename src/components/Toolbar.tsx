import type React from 'react';
import type { RoutineSettings } from '../types/routine';
import { CATEGORIES } from '../constants/presets';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import ButtonGroup from '@mui/material/ButtonGroup';
import Tooltip from '@mui/material/Tooltip';

interface ToolbarProps {
  settings: RoutineSettings;
  onUpdateSettings: (settings: Partial<RoutineSettings>) => void;
  searchFilter: string;
  onSearchChange: (val: string) => void;
  categoryFilter: string;
  onCategoryChange: (val: string) => void;
  onAddItemClick: () => void;
  onAddTimeSlotClick: () => void;
  onAddDayClick: () => void;
  onOpenStats: () => void;
  onClearAll: () => void;
  totalFilteredCount?: number;
  totalItemsCount?: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  settings,
  onUpdateSettings,
  searchFilter,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  onAddItemClick,
  onAddTimeSlotClick,
  onAddDayClick,
  onOpenStats,
  onClearAll,
  totalFilteredCount: _totalFilteredCount,
  totalItemsCount: _totalItemsCount,
}) => {
  return (
    <Paper
      elevation={0}
      className="no-print"
      sx={{
        px: { xs: 1.5, sm: 2 },
        py: 1,
        mb: 1.5,
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E0D6',
        borderRadius: '14px',
        boxShadow: '0 1px 4px rgba(46,51,47,0.03)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
      }}
    >
      {/* Left side: Compact Search & Category Pills */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', flex: 1, minWidth: 240 }}>
        {/* Search */}
        <TextField
          size="small"
          placeholder="Search..."
          value={searchFilter}
          onChange={(e) => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#8C948D', fontSize: 16 }} />
                </InputAdornment>
              ),
              endAdornment: searchFilter ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => onSearchChange('')} edge="end" sx={{ p: 0.25 }}>
                    <ClearIcon sx={{ fontSize: 13 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
              sx: {
                borderRadius: '8px',
                backgroundColor: '#FAF8F5',
                fontSize: '12px',
                height: 30,
                width: { xs: '100%', sm: 150 },
                '& fieldset': { borderColor: '#E5E0D6' },
                '&:hover fieldset': { borderColor: '#BDB6A8' },
                '&.Mui-focused fieldset': { borderColor: '#5B7065' },
              },
            },
          }}
        />

        {/* Category Pills (Direct, without verbose "CATEGORIES:" text) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
          <Chip
            label="All"
            size="small"
            clickable
            onClick={() => onCategoryChange('')}
            sx={{
              height: 24,
              fontSize: '11px',
              backgroundColor: !categoryFilter ? '#2E332F' : '#FAF8F5',
              color: !categoryFilter ? '#FFFFFF' : '#556058',
              border: '1px solid',
              borderColor: !categoryFilter ? '#2E332F' : '#E5E0D6',
              fontWeight: 600,
            }}
          />
          {CATEGORIES.map((cat) => {
            const isSelected = categoryFilter === cat;
            return (
              <Chip
                key={cat}
                label={cat}
                size="small"
                clickable
                onClick={() => onCategoryChange(isSelected ? '' : cat)}
                sx={{
                  height: 24,
                  fontSize: '11px',
                  backgroundColor: isSelected ? '#5B7065' : '#FAF8F5',
                  color: isSelected ? '#FFFFFF' : '#556058',
                  border: '1px solid',
                  borderColor: isSelected ? '#5B7065' : '#E5E0D6',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: isSelected ? '#4A5D53' : '#F0ECE4',
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>

      {/* Right side: Action Buttons & Layout Toggles */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
        {/* Add Event */}
        <Button
          size="small"
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          onClick={onAddItemClick}
          sx={{
            backgroundColor: '#5B7065',
            fontWeight: 700,
            fontSize: '12px',
            py: 0.35,
            px: 1.25,
            '&:hover': { backgroundColor: '#485A50' },
          }}
        >
          Event
        </Button>

        {/* Add Time Slot */}
        <Button
          size="small"
          variant="outlined"
          startIcon={<AccessTimeIcon sx={{ fontSize: 15, color: '#5B7065' }} />}
          onClick={onAddTimeSlotClick}
          sx={{
            borderColor: '#E5E0D6',
            color: '#2E332F',
            fontSize: '12px',
            py: 0.35,
            px: 1.1,
            '&:hover': { borderColor: '#5B7065', backgroundColor: '#F8F6F2' },
          }}
        >
          Slot
        </Button>

        {/* Add Day */}
        <Button
          size="small"
          variant="outlined"
          startIcon={<CalendarMonthIcon sx={{ fontSize: 15, color: '#B87352' }} />}
          onClick={onAddDayClick}
          sx={{
            borderColor: '#E5E0D6',
            color: '#2E332F',
            fontSize: '12px',
            py: 0.35,
            px: 1.1,
            '&:hover': { borderColor: '#B87352', backgroundColor: '#FAF4F0' },
          }}
        >
          Day
        </Button>

        <Box sx={{ width: '1px', height: 18, backgroundColor: '#E5E0D6', mx: 0.25 }} />

        {/* 12h / 24h Toggle */}
        <ButtonGroup size="small" variant="outlined" sx={{ height: 26 }}>
          <Button
            onClick={() => onUpdateSettings({ timeFormat: '12h' })}
            sx={{
              fontSize: '10.5px',
              px: 0.75,
              py: 0,
              backgroundColor: settings.timeFormat === '12h' ? '#5B7065' : 'transparent',
              color: settings.timeFormat === '12h' ? '#FFFFFF' : '#68726A',
              borderColor: '#D8D2C7',
              '&:hover': { backgroundColor: settings.timeFormat === '12h' ? '#4A5D53' : '#F0ECE4' },
            }}
          >
            12h
          </Button>
          <Button
            onClick={() => onUpdateSettings({ timeFormat: '24h' })}
            sx={{
              fontSize: '10.5px',
              px: 0.75,
              py: 0,
              backgroundColor: settings.timeFormat === '24h' ? '#5B7065' : 'transparent',
              color: settings.timeFormat === '24h' ? '#FFFFFF' : '#68726A',
              borderColor: '#D8D2C7',
              '&:hover': { backgroundColor: settings.timeFormat === '24h' ? '#4A5D53' : '#F0ECE4' },
            }}
          >
            24h
          </Button>
        </ButtonGroup>

        {/* Days Column flip */}
        <Tooltip title={`Days: ${settings.dayColumnPosition === 'left' ? 'Left' : 'Right'} (Click to flip)`} arrow>
          <IconButton
            size="small"
            onClick={() =>
              onUpdateSettings({
                dayColumnPosition: settings.dayColumnPosition === 'left' ? 'right' : 'left',
              })
            }
            sx={{
              border: '1px solid #E5E0D6',
              borderRadius: '8px',
              p: 0.4,
              color: '#5B7065',
              backgroundColor: '#FAF8F5',
            }}
          >
            <SwapHorizIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        {/* Analytics Drawer Button */}
        <Tooltip title="Statistics" arrow>
          <IconButton
            size="small"
            onClick={onOpenStats}
            sx={{
              border: '1px solid #E5E0D6',
              borderRadius: '8px',
              p: 0.4,
              color: '#5B7A8C',
              backgroundColor: '#FAF8F5',
            }}
          >
            <AnalyticsOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>

        {/* Clear All */}
        <Tooltip title="Clear all events" arrow>
          <IconButton
            size="small"
            onClick={() => {
              if (window.confirm('Clear all routine items?')) {
                onClearAll();
              }
            }}
            sx={{
              border: '1px solid #E5E0D6',
              borderRadius: '8px',
              p: 0.4,
              color: '#C15C5C',
              backgroundColor: '#FAF8F5',
            }}
          >
            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  );
};
