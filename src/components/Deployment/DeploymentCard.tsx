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
  Divider
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteIcon from '@mui/icons-material/Delete';
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
        cursor: 'pointer'
      }}
      onClick={handleCardClick}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="h2" fontWeight="bold">{deployment.name}</Typography>
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

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <Typography variant="caption" color="text.secondary">
            Last updated: {deployment.lastUpdatedAt ? new Date(deployment.lastUpdatedAt).toLocaleString() : 'Never'}
          </Typography>

          <Box>
            <Tooltip title={deployment.isActive ? 'Pause' : 'Resume'}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus(deployment);
                }}
                sx={{ mr: 1 }}
              >
                {deployment.isActive ?
                  <PauseIcon fontSize="small" /> :
                  <PlayArrowIcon fontSize="small" />
                }
              </IconButton>
            </Tooltip>

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
        </Box>
      </CardContent>
    </Card>
  );
};

export default DeploymentCard;
