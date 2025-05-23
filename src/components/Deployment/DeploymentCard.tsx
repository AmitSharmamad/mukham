import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Collapse,
  useTheme
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { Deployment, Position } from '../../services/deploymentService';
import DeploymentPositions from './DeploymentPositions';

interface DeploymentCardProps {
  deployment: Deployment;
  isSelected: boolean;
  positions: Position[];
  loadingPositions: boolean;
  onSelect: (deploymentId: string) => void;
  onDelete: (deployment: Deployment) => void;
  onToggleStatus: (deployment: Deployment) => void;
}

const DeploymentCard: React.FC<DeploymentCardProps> = ({
  deployment,
  isSelected,
  positions,
  loadingPositions,
  onSelect,
  onDelete,
  onToggleStatus
}) => {
  const theme = useTheme();

  return (
    <Card 
      sx={{ 
        width: '100%',
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 6
        },
        bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'background.default',
        cursor: 'pointer'
      }}
      onClick={() => onSelect(deployment.id)}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 0 }}>
              {deployment.name}
            </Typography>
            {isSelected ? 
              <ExpandLessIcon fontSize="small" sx={{ ml: 1 }} /> : 
              <ExpandMoreIcon fontSize="small" sx={{ ml: 1 }} />
            }
          </Box>
          <Chip 
            label={deployment.isActive ? 'Active' : 'Paused'} 
            color={deployment.isActive ? 'success' : 'default'}
            size="small"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {deployment.description || 'No description provided.'}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            Last updated: {deployment.lastUpdatedAt ? new Date(deployment.lastUpdatedAt).toLocaleString() : 'Never'}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pt: 0, pb: 1 }}>
        <Box>
          <Tooltip title="Delete">
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(deployment);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box>
          <Tooltip title={deployment.isActive ? 'Pause' : 'Resume'}>
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                onToggleStatus(deployment);
              }}
              color={deployment.isActive ? 'success' : 'default'}
            >
              {deployment.isActive ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
      
      {/* Positions Table */}
      <Collapse in={isSelected} timeout="auto" unmountOnExit>
        <DeploymentPositions positions={positions} loading={loadingPositions} />
      </Collapse>
    </Card>
  );
};

export default DeploymentCard;
