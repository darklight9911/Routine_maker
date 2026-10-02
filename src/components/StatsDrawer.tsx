import type React from 'react';
import type { RoutineData } from '../types/routine';
import { calculateDurationMinutes, formatDuration } from '../utils/time';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import CloseIcon from '@mui/icons-material/Close';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface StatsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  routine: RoutineData;
}

export const StatsDrawer: React.FC<StatsDrawerProps> = ({ isOpen, onClose, routine }) => {
  const totalItems = routine.items.length;
  const timeSlotMap = new Map(routine.timeSlots.map((s) => [s.id, s]));

  let totalScheduledMinutes = 0;
  const categoryCounts: Record<string, number> = {};
  const dayCounts: Record<string, number> = {};

  routine.items.forEach((item) => {
    const cat = item.category || 'General';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

    dayCounts[item.dayId] = (dayCounts[item.dayId] || 0) + 1;

    const slot = timeSlotMap.get(item.timeSlotId);
    if (slot && !slot.isBreak) {
      totalScheduledMinutes += calculateDurationMinutes(slot.startTime, slot.endTime);
    }
  });

  let busiestDayName = 'None';
  let maxDayCount = 0;
  routine.days.forEach((day) => {
    const count = dayCounts[day.id] || 0;
    if (count > maxDayCount) {
      maxDayCount = count;
      busiestDayName = day.name;
    }
  });

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 400 },
            backgroundColor: '#FFFFFF',
            borderLeft: '1px solid #E5E0D6',
            p: 0,
          },
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #EFECE6' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              backgroundColor: '#F0F5F1',
              color: '#5B7065',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AnalyticsOutlinedIcon sx={{ fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2E332F', lineHeight: 1.2 }}>
              Schedule Analytics
            </Typography>
            <Typography variant="caption" sx={{ color: '#7E8780' }}>
              Weekly workload & category summary
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: '#8C948D' }}>
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3, flex: 1, overflowY: 'auto' }}>
        {/* Metric Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box sx={{ p: 2, borderRadius: '14px', backgroundColor: '#F0F5F1', border: '1px solid #DFEBE1' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#4B6353', mb: 0.5 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Total Events
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2C3E31' }}>
              {totalItems}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6B7A6F' }}>
              Across {routine.days.length} days
            </Typography>
          </Box>

          <Box sx={{ p: 2, borderRadius: '14px', backgroundColor: '#FAF1ED', border: '1px solid #F2E3DC' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, color: '#9E5B3A', mb: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                Total Hours
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#572E19' }}>
              {formatDuration(totalScheduledMinutes) || '0h'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#8F6550' }}>
              Excludes breaks
            </Typography>
          </Box>
        </Box>

        {/* Peak Day Card */}
        <Box
          sx={{
            p: 2,
            borderRadius: '14px',
            backgroundColor: '#FAF8F5',
            border: '1px solid #E5E0D6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                backgroundColor: '#EFF4F8',
                color: '#5B7A8C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CalendarMonthIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#7E8780', fontWeight: 600 }}>
                Busiest Day
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2E332F' }}>
                {busiestDayName}
              </Typography>
            </Box>
          </Box>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              backgroundColor: '#EFF4F8',
              color: '#34556B',
              px: 1.25,
              py: 0.5,
              borderRadius: '8px',
            }}
          >
            {maxDayCount} items
          </Typography>
        </Box>

        {/* Breakdown by Category */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2E332F', mb: 2 }}>
            Category Distribution
          </Typography>

          {Object.keys(categoryCounts).length === 0 ? (
            <Typography variant="caption" sx={{ color: '#8C948D', textAlign: 'center', display: 'block', py: 3 }}>
              No activities scheduled yet.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {Object.entries(categoryCounts).map(([cat, count]) => {
                const percentage = Math.round((count / totalItems) * 100);
                return (
                  <Box key={cat}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#3A423D' }}>
                        {cat}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#7E8780', fontWeight: 600 }}>
                        {count} ({percentage}%)
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      sx={{
                        height: 7,
                        borderRadius: 4,
                        backgroundColor: '#FAF5EE',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#5B7065',
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ p: 2.5, borderTop: '1px solid #EFECE6' }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          sx={{ borderColor: '#D8D2C7', color: '#2E332F' }}
        >
          Close Drawer
        </Button>
      </Box>
    </Drawer>
  );
};
