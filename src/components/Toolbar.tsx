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
import Typography from '@mui/material/Typography';
import ButtonGroup from '@mui/material/ButtonGroup';

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
  totalFilteredCount,
  totalItemsCount,
}) => {
  return (
    <Paper
      elevation={0}
      className="no-print"
      sx={{
        p: { xs: 2, sm: 2.5 },
        mb: 3,
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E0D6',
        borderRadius: '18px',
        boxShadow: '0 2px 8px rgba(46,51,47,0.04)',
      }}
    >
      {/* Upper toolbar row: Search Bar & Primary Actions */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        {/* Search Input */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: '260px', maxWidth: '420px' }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search classes, rooms, professors..."
            value={searchFilter}
            onChange={(e) => onSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#8C948D', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: searchFilter ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => onSearchChange('')} edge="end">
                      <ClearIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </InputAdornment>
                ) : null,
                sx: {
                  borderRadius: '12px',
                  backgroundColor: '#FAF8F5',
                  fontSize: '13.5px',
                  '& fieldset': { borderColor: '#E5E0D6' },
                  '&:hover fieldset': { borderColor: '#BDB6A8' },
                  '&.Mui-focused fieldset': { borderColor: '#5B7065' },
                },
              },
            }}
          />
          {searchFilter && totalFilteredCount !== undefined && totalItemsCount !== undefined && (
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#5B7065', whiteSpace: 'nowrap' }}>
              {totalFilteredCount}/{totalItemsCount}
            </Typography>
          )}
        </Box>

        {/* Primary Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={onAddItemClick}
            sx={{
              backgroundColor: '#5B7065',
              fontWeight: 700,
              fontSize: '13px',
              px: 2.2,
              '&:hover': { backgroundColor: '#485A50' },
            }}
          >
            Add Event
          </Button>

          <Button
            variant="outlined"
            startIcon={<AccessTimeIcon sx={{ color: '#5B7065' }} />}
            onClick={onAddTimeSlotClick}
            sx={{
              borderColor: '#E5E0D6',
              color: '#2E332F',
              fontSize: '13px',
              '&:hover': { borderColor: '#5B7065', backgroundColor: '#F8F6F2' },
            }}
          >
            <span className="hidden sm:inline">Add Time Slot</span>
            <span className="sm:hidden">+ Time</span>
          </Button>

          <Button
            variant="outlined"
            startIcon={<CalendarMonthIcon sx={{ color: '#B87352' }} />}
            onClick={onAddDayClick}
            sx={{
              borderColor: '#E5E0D6',
              color: '#2E332F',
              fontSize: '13px',
              '&:hover': { borderColor: '#B87352', backgroundColor: '#FAF4F0' },
            }}
          >
            <span className="hidden sm:inline">Add Day</span>
            <span className="sm:hidden">+ Day</span>
          </Button>

          <Button
            variant="outlined"
            startIcon={<AnalyticsOutlinedIcon sx={{ color: '#5B7A8C' }} />}
            onClick={onOpenStats}
            sx={{
              borderColor: '#E5E0D6',
              color: '#2E332F',
              fontSize: '13px',
              '&:hover': { borderColor: '#5B7A8C', backgroundColor: '#F2F6F8' },
            }}
          >
            Analytics
          </Button>
        </Box>
      </Box>

      {/* Category Pills Row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mt: 2,
          pt: 1.5,
          borderTop: '1px solid #EFECE6',
          overflowX: 'auto',
          pb: 0.5,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: '#8C948D',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            mr: 0.5,
            flexShrink: 0,
          }}
        >
          Categories:
        </Typography>

        <Chip
          label="All"
          size="small"
          clickable
          onClick={() => onCategoryChange('')}
          sx={{
            backgroundColor: !categoryFilter ? '#2E332F' : '#FAF8F5',
            color: !categoryFilter ? '#FFFFFF' : '#556058',
            border: '1px solid',
            borderColor: !categoryFilter ? '#2E332F' : '#E5E0D6',
            fontWeight: 600,
            fontSize: '12px',
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
                backgroundColor: isSelected ? '#5B7065' : '#FAF8F5',
                color: isSelected ? '#FFFFFF' : '#556058',
                border: '1px solid',
                borderColor: isSelected ? '#5B7065' : '#E5E0D6',
                fontWeight: 600,
                fontSize: '12px',
                '&:hover': {
                  backgroundColor: isSelected ? '#4A5D53' : '#F0ECE4',
                },
              }}
            />
          );
        })}
      </Box>

      {/* Lower toolbar row: Layout toggles (Days on Right, Time format, Density) */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mt: 2,
          pt: 1.5,
          borderTop: '1px solid #EFECE6',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
          {/* Day Column Position Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: '#68726A', fontWeight: 600 }}>
              Days Column:
            </Typography>
            <Button
              size="small"
              variant={settings.dayColumnPosition === 'right' ? 'contained' : 'outlined'}
              onClick={() =>
                onUpdateSettings({
                  dayColumnPosition: settings.dayColumnPosition === 'right' ? 'left' : 'right',
                })
              }
              startIcon={<SwapHorizIcon />}
              sx={{
                fontSize: '11.5px',
                py: 0.4,
                px: 1.2,
                backgroundColor: settings.dayColumnPosition === 'right' ? '#F0F5F1' : 'transparent',
                color: settings.dayColumnPosition === 'right' ? '#3B4E43' : '#68726A',
                border: '1px solid',
                borderColor: settings.dayColumnPosition === 'right' ? '#8FA395' : '#D8D2C7',
                '&:hover': {
                  backgroundColor: '#E2EBE5',
                },
              }}
            >
              {settings.dayColumnPosition === 'right' ? 'Rightmost (Default)' : 'Left'}
            </Button>
          </Box>

          {/* Time Format */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: '#68726A', fontWeight: 600 }}>
              Time:
            </Typography>
            <ButtonGroup size="small" variant="outlined">
              <Button
                onClick={() => onUpdateSettings({ timeFormat: '12h' })}
                sx={{
                  fontSize: '11px',
                  py: 0.3,
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
                  fontSize: '11px',
                  py: 0.3,
                  backgroundColor: settings.timeFormat === '24h' ? '#5B7065' : 'transparent',
                  color: settings.timeFormat === '24h' ? '#FFFFFF' : '#68726A',
                  borderColor: '#D8D2C7',
                  '&:hover': { backgroundColor: settings.timeFormat === '24h' ? '#4A5D53' : '#F0ECE4' },
                }}
              >
                24h
              </Button>
            </ButtonGroup>
          </Box>

          {/* Density */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" sx={{ color: '#68726A', fontWeight: 600 }}>
              Density:
            </Typography>
            <Button
              size="small"
              onClick={() => onUpdateSettings({ compactMode: !settings.compactMode })}
              sx={{
                fontSize: '11px',
                py: 0.3,
                px: 1.2,
                backgroundColor: settings.compactMode ? '#F0F5F1' : '#FAF8F5',
                color: settings.compactMode ? '#3B4E43' : '#68726A',
                border: '1px solid',
                borderColor: settings.compactMode ? '#8FA395' : '#D8D2C7',
              }}
            >
              {settings.compactMode ? 'Compact' : 'Comfortable'}
            </Button>
          </Box>
        </Box>

        {/* Clear Events Button */}
        <Button
          size="small"
          color="error"
          startIcon={<DeleteOutlineIcon />}
          onClick={() => {
            if (window.confirm('Are you sure you want to clear all routine items?')) {
              onClearAll();
            }
          }}
          sx={{ fontSize: '11.5px', textTransform: 'none', color: '#C15C5C' }}
        >
          Clear Events
        </Button>
      </Box>
    </Paper>
  );
};
