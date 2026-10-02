import type React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';

interface DiagonalHeaderCellProps {
  isRightColumn?: boolean;
  onAddDayClick?: () => void;
}

export const DiagonalHeaderCell: React.FC<DiagonalHeaderCellProps> = ({
  isRightColumn = false,
  onAddDayClick,
}) => {
  return (
    <th
      style={{
        position: 'sticky',
        top: 0,
        [isRightColumn ? 'right' : 'left']: 0,
        zIndex: 35,
        width: '105px',
        minWidth: '105px',
        maxWidth: '105px',
        height: '52px',
        padding: 0,
        backgroundColor: '#FAF8F5',
        borderBottom: '1px solid #E5E0D6',
        [isRightColumn ? 'borderLeft' : 'borderRight']: '1px solid #E5E0D6',
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '52px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover .add-day-btn': {
            opacity: 1,
          },
        }}
      >
        {/* Diagonal slope dividing line */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {isRightColumn ? (
            <line
              x1="100%"
              y1="0"
              x2="0"
              y2="100%"
              stroke="#D8D1C4"
              strokeWidth="1.25"
            />
          ) : (
            <line
              x1="0"
              y1="0"
              x2="100%"
              y2="100%"
              stroke="#D8D1C4"
              strokeWidth="1.25"
            />
          )}
        </svg>

        {/* TIME / SLOTS Label (Pointing to column headers) */}
        <Typography
          component="span"
          sx={{
            position: 'absolute',
            top: '6px',
            [isRightColumn ? 'left' : 'right']: '8px',
            fontSize: '10px',
            fontWeight: 800,
            color: '#5B7065',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
          }}
        >
          {isRightColumn ? '← TIME' : 'TIME →'}
        </Typography>

        {/* DAYS Label (Pointing to row headers) */}
        <Typography
          component="span"
          sx={{
            position: 'absolute',
            bottom: '7px',
            [isRightColumn ? 'right' : 'left']: '8px',
            fontSize: '10px',
            fontWeight: 800,
            color: '#B87352',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
          }}
        >
          {isRightColumn ? 'DAYS ↓' : '↓ DAYS'}
        </Typography>

        {/* Quick add day hover button */}
        {onAddDayClick && (
          <Tooltip title="Add Day" arrow>
            <IconButton
              size="small"
              onClick={onAddDayClick}
              className="add-day-btn no-export"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                opacity: 0,
                transition: 'opacity 0.15s ease',
                p: 0.2,
                backgroundColor: '#FFFFFF',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #E5E0D6',
                color: '#5B7065',
                '&:hover': {
                  backgroundColor: '#F0F5F1',
                  color: '#43544B',
                },
              }}
            >
              <AddIcon sx={{ fontSize: 13 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </th>
  );
};
