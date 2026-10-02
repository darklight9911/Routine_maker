import type React from 'react';
import type { TimeSlot, Day } from '../types/routine';
import { BREAK_CONFIGS } from '../constants/presets';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface BreakStripCellProps {
  slot: TimeSlot;
  day: Day;
  onEditSlot: (slot: TimeSlot) => void;
}

export const BreakStripCell: React.FC<BreakStripCellProps> = ({
  slot,
  onEditSlot,
}) => {
  const breakConfig = BREAK_CONFIGS[slot.breakType || 'lunch'] || BREAK_CONFIGS.other;
  const breakTitle = slot.label || breakConfig.label;

  return (
    <Tooltip
      title={`${breakTitle} (${slot.startTime} – ${slot.endTime}) • Click to customize`}
      arrow
      placement="top"
    >
      <td
        onClick={() => onEditSlot(slot)}
        style={{
          width: '52px',
          minWidth: '52px',
          maxWidth: '52px',
          padding: '4px 2px',
          backgroundColor: breakConfig.bg,
          borderLeft: `1px dashed ${breakConfig.border}`,
          borderRight: `1px dashed ${breakConfig.border}`,
          borderBottom: '1px solid #EAE6DF',
          textAlign: 'center',
          verticalAlign: 'middle',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'all 0.15s ease',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minHeight: '52px',
            borderRadius: '6px',
            transition: 'background-color 0.15s ease',
            '&:hover': {
              backgroundColor: `${breakConfig.badgeBg}90`,
            },
          }}
        >
          {/* Subtle vertical dotted line & icon */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.3,
            }}
          >
            <span style={{ fontSize: '11px', opacity: 0.85, lineHeight: 1 }}>{breakConfig.icon}</span>

            {/* Vertical orientation text */}
            <Typography
              component="span"
              sx={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                fontSize: '8px',
                fontWeight: 800,
                color: breakConfig.text,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                opacity: 0.65,
                lineHeight: 1,
              }}
            >
              {breakTitle}
            </Typography>
          </Box>
        </Box>
      </td>
    </Tooltip>
  );
};
