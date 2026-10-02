import type React from 'react';
import type { TimeSlot } from '../types/routine';
import { BREAK_CONFIGS } from '../constants/presets';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

interface BreakStripCellProps {
  slot: TimeSlot;
  rowSpan?: number;
  onEditSlot: (slot: TimeSlot) => void;
}

export const BreakStripCell: React.FC<BreakStripCellProps> = ({
  slot,
  rowSpan,
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
        rowSpan={rowSpan}
        onClick={() => onEditSlot(slot)}
        style={{
          width: '52px',
          minWidth: '52px',
          maxWidth: '52px',
          padding: '8px 2px',
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
            justifyContent: 'space-between',
            height: '100%',
            minHeight: '120px',
            py: 2,
            borderRadius: '8px',
            transition: 'all 0.15s ease',
            position: 'relative',
            '&:hover': {
              backgroundColor: `${breakConfig.badgeBg}80`,
            },
            '&:hover .break-edit-hint': {
              opacity: 1,
            },
          }}
        >
          {/* Top: Icon in soft pill */}
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              border: `1px solid ${breakConfig.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              flexShrink: 0,
            }}
          >
            {breakConfig.icon}
          </Box>

          {/* Middle: Vertical Title with elegant letter spacing */}
          <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography
              component="span"
              sx={{
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                fontSize: '10px',
                fontWeight: 800,
                color: breakConfig.text,
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                opacity: 0.85,
                lineHeight: 1,
              }}
            >
              {breakTitle}
            </Typography>
          </Box>

          {/* Bottom: Time range or edit indicator */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <Box
              className="break-edit-hint"
              sx={{
                opacity: 0.5,
                transition: 'opacity 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: breakConfig.text,
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 13 }} />
            </Box>
          </Box>
        </Box>
      </td>
    </Tooltip>
  );
};
