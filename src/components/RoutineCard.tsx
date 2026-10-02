import type React from 'react';
import type { RoutineItem, RoutineSettings } from '../types/routine';
import { COLOR_PALETTE } from '../constants/presets';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PersonOutlineIcon from '@mui/icons-material/Person';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface RoutineCardProps {
  item: RoutineItem;
  settings: RoutineSettings;
  isDragging: boolean;
  onEdit: (item: RoutineItem) => void;
  onDuplicate: (itemId: string) => void;
  onDelete: (itemId: string) => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: (e: React.DragEvent) => void;
  isHighlighted?: boolean;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  item,
  settings,
  isDragging,
  onEdit,
  onDuplicate,
  onDelete,
  onDragStart,
  onDragEnd,
  isHighlighted = true,
}) => {
  const colorDef = COLOR_PALETTE.find((c) => c.id === item.color) || COLOR_PALETTE[0];

  return (
    <Box
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      tabIndex={0}
      role="button"
      aria-label={`Routine event: ${item.title}`}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) return;
        onEdit(item);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEdit(item);
        }
      }}
      sx={{
        backgroundColor: colorDef.bg,
        border: '1px solid',
        borderColor: `${colorDef.border}50`,
        borderLeft: `4px solid ${colorDef.hex}`,
        borderRadius: '12px',
        p: settings.compactMode ? 1 : 1.5,
        cursor: 'grab',
        userSelect: 'none',
        textAlign: 'left',
        transition: 'all 0.15s ease',
        boxShadow: '0 1px 3px rgba(46, 51, 47, 0.05)',
        opacity: isDragging ? 0.35 : !isHighlighted ? 0.25 : 1,
        transform: isDragging ? 'scale(0.96)' : 'none',
        '&:hover': {
          boxShadow: '0 4px 10px rgba(46, 51, 47, 0.08)',
          borderColor: colorDef.border,
        },
        '&:active': {
          cursor: 'grabbing',
        },
      }}
    >
      {/* Top row: Category Chip & Action Icons */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, gap: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
          <DragIndicatorIcon
            sx={{
              fontSize: 16,
              color: '#8C948D',
              cursor: 'grab',
              '&:hover': { color: '#4A534C' },
            }}
          />

          {settings.showCategory && item.category && (
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1,
                py: 0.25,
                borderRadius: '6px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E0D6',
                fontSize: '10px',
                fontWeight: 700,
                color: '#3B423D',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: colorDef.hex,
                  flexShrink: 0,
                }}
              />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.category}
              </span>
            </Box>
          )}
        </Box>

        {/* Micro action toolbar */}
        <Box
          className="no-export"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
          }}
        >
          <Tooltip title="Edit event" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item);
              }}
              sx={{
                p: 0.5,
                color: '#637067',
                backgroundColor: 'rgba(255,255,255,0.7)',
                '&:hover': { backgroundColor: '#FFFFFF', color: '#5B7065' },
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Duplicate" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(item.id);
              }}
              sx={{
                p: 0.5,
                color: '#637067',
                backgroundColor: 'rgba(255,255,255,0.7)',
                '&:hover': { backgroundColor: '#FFFFFF', color: '#B87352' },
              }}
            >
              <ContentCopyIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete" arrow>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              sx={{
                p: 0.5,
                color: '#637067',
                backgroundColor: 'rgba(255,255,255,0.7)',
                '&:hover': { backgroundColor: '#FFFFFF', color: '#C15C5C' },
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Main Title & Subtitle */}
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 700,
          color: colorDef.text,
          lineHeight: 1.3,
          fontSize: settings.compactMode ? '12px' : '13.5px',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {item.title}
      </Typography>

      {item.subtitle && (
        <Typography
          variant="caption"
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontWeight: 600,
            fontSize: '11px',
            color: '#637067',
            display: 'block',
            mt: 0.25,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.subtitle}
        </Typography>
      )}

      {/* Location & Instructor */}
      <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {settings.showLocation && item.location && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: '11px',
              color: '#556058',
              backgroundColor: '#FFFFFF',
              px: 0.75,
              py: 0.2,
              borderRadius: '6px',
              border: '1px solid #ECE7DE',
              width: 'fit-content',
              maxWidth: '100%',
            }}
          >
            <PlaceOutlinedIcon sx={{ fontSize: 13, color: '#8C948D', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.location}
            </span>
          </Box>
        )}

        {settings.showInstructor && item.instructor && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              fontSize: '11px',
              color: '#556058',
              backgroundColor: '#FFFFFF',
              px: 0.75,
              py: 0.2,
              borderRadius: '6px',
              border: '1px solid #ECE7DE',
              width: 'fit-content',
              maxWidth: '100%',
            }}
          >
            <PersonOutlineIcon sx={{ fontSize: 13, color: '#8C948D', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.instructor}
            </span>
          </Box>
        )}
      </Box>

      {item.notes && !settings.compactMode && (
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mt: 1,
            pt: 0.5,
            borderTop: '1px solid #ECE7DE',
            fontSize: '10.5px',
            fontStyle: 'italic',
            color: '#7A857D',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.notes}
        </Typography>
      )}
    </Box>
  );
};
