import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Grid,
  Paper
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useRouter } from 'next/router';
import { Deployment } from '../../services/deploymentService';

export interface DeploymentCardProps {
  deployment: Deployment;
  onDelete: (deployment: Deployment) => void;
  onToggleStatus: (deployment: Deployment) => void;
}

const DeploymentCard: React.FC<DeploymentCardProps> = ({
  deployment,
  onDelete,
  onToggleStatus
}) => {
  const theme = useTheme();
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/deployment/${deployment.id}`);
  };
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/strategy/${deployment.strategy_id}`);
  };

  return (
    <Card
      elevation={3}
      sx={{
        mb: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[6]
        },
        cursor: 'pointer',
        position: 'relative'
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6" component="h2">{deployment.name}</Typography>
              <Box>
                <Chip
                  label={deployment.isActive ? 'Active' : 'Inactive'}
                  color={deployment.isActive ? 'success' : 'default'}
                  size="small"
                  sx={{ mr: 1 }}
                />
              </Box>
            </Box>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {deployment.description || 'No description provided.'}
            </Typography>

            <Divider sx={{ my: 1 }} />

            <Box mt={1}>
              <Typography variant="caption" color="text.secondary">
                Last updated: {deployment.lastUpdatedAt ? new Date(deployment.lastUpdatedAt).toLocaleString() : 'Never'}
              </Typography>
            </Box>
            
            {/* Action Icons in bottom right (Pause/Resume, Edit, Delete) */}
            <Box sx={{ 
              position: 'absolute', 
              bottom: 8, 
              right: 8, 
              display: 'flex',
              gap: 1
            }}>
              <Tooltip title={deployment.isActive ? 'Pause' : 'Resume'}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStatus(deployment);
                  }}
                  sx={{ 
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  {deployment.isActive ?
                    <PauseIcon fontSize="small" /> :
                    <PlayArrowIcon fontSize="small" />
                  }
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit Strategy">
                <IconButton
                  size="small"
                  onClick={handleEditClick}
                  sx={{ 
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete Deployment">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(deployment);
                  }}
                  sx={{ 
                    backgroundColor: 'background.paper',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DeploymentCard;
