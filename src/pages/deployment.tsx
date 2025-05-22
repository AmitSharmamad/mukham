import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { useTheme } from '@mui/material/styles';
import { Deployment, getDeployments, deleteDeployment, activateDeployment, deactivateDeployment, stopAllDeployments } from '../services/deploymentService';

const DeploymentPage = () => {
  const theme = useTheme();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deploymentToDelete, setDeploymentToDelete] = useState<Deployment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stoppingAll, setStoppingAll] = useState<boolean>(false);

  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    try {
      setLoading(true);
      const data = await getDeployments();
      // Ensure that deployments is always an array
      setDeployments(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching deployments:', err);
      setError('Failed to load deployments. Please try again later.');
      // Reset to empty array in case of error
      setDeployments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (deployment: Deployment) => {
    setDeploymentToDelete(deployment);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeploymentToDelete(null);
  };

  const handleDeleteDeployment = async () => {
    if (!deploymentToDelete) return;
    
    try {
      await deleteDeployment(deploymentToDelete.id);
      setDeployments(deployments.filter(d => d.id !== deploymentToDelete.id));
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting deployment:', err);
      setError('Failed to delete deployment. Please try again.');
    }
  };

  const handleToggleStatus = async (deployment: Deployment) => {
    try {
      if (deployment.isActive) {
        await deactivateDeployment(deployment.id);
      } else {
        await activateDeployment(deployment.id);
      }
      
      // Update local state
      setDeployments(
        deployments.map(d => 
          d.id === deployment.id ? { ...d, isActive: !d.isActive } : d
        )
      );
    } catch (err) {
      console.error('Error toggling deployment status:', err);
      setError(`Failed to ${deployment.isActive ? 'pause' : 'resume'} deployment.`);
    }
  };

  const handleStopAllDeployments = async () => {
    try {
      setStoppingAll(true);
      await stopAllDeployments();
      
      // Update all deployments to inactive
      setDeployments(
        deployments.map(d => ({ ...d, isActive: false }))
      );
    } catch (err) {
      console.error('Error stopping all deployments:', err);
      setError('Failed to stop all deployments. Please try again.');
    } finally {
      setStoppingAll(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Page Header */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4}
      >
        <Typography variant="h4" component="h1">
          Deployments
        </Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<StopIcon />}
          onClick={handleStopAllDeployments}
          disabled={stoppingAll || !Array.isArray(deployments) || deployments.every(d => !d.isActive)}
        >
          {stoppingAll ? 'Stopping All...' : 'Stop All'}
        </Button>
      </Box>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* Deployments List */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : deployments.length > 0 ? (
        <Grid container spacing={3}>
          {deployments.map((deployment) => (
            <Grid item xs={12} sm={6} md={4} key={deployment.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  },
                  bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : 'background.default'
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {deployment.name}
                    </Typography>
                    <Chip 
                      label={deployment.isActive ? 'Active' : 'Paused'} 
                      color={deployment.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {deployment.description || 'No description provided.'}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Last updated: {deployment.lastUpdatedAt ? new Date(deployment.lastUpdatedAt).toLocaleString() : 'Never'}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDeleteDialog(deployment)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box>
                    <Tooltip title={deployment.isActive ? 'Pause' : 'Resume'}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleToggleStatus(deployment)}
                        color={deployment.isActive ? 'success' : 'default'}
                      >
                        {deployment.isActive ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        if (deployment.isActive) {
                          handleToggleStatus(deployment);
                        }
                      }}
                      disabled={!deployment.isActive}
                    >
                      Stop
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="300px"
          textAlign="center"
          p={4}
        >
          <Typography variant="h6" gutterBottom>
            No deployments found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Deploy a strategy from the strategy backtest results to see deployments here.
          </Typography>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Delete Deployment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deploymentToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteDeployment} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DeploymentPage;
