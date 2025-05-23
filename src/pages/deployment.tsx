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
import { Deployment, getDeployments, deleteDeployment, activateDeployment, deactivateDeployment, stopAllDeployments, startAllDeployments } from '../services/deploymentService';
import { useToastContext } from '../context/ToastContext';

const DeploymentPage = () => {
  const theme = useTheme();
  const toast = useToastContext();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deploymentToDelete, setDeploymentToDelete] = useState<Deployment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stoppingAll, setStoppingAll] = useState<boolean>(false);
  const [startingAll, setStartingAll] = useState<boolean>(false);

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
    } catch (err: any) {
      console.error('Error fetching deployments:', err);
      setError('Failed to load deployments. Please try again later.');
      // Display error toast
      toast.showError(err.response?.data?.message || 'Failed to load deployments');
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
      const result = await deleteDeployment(deploymentToDelete.id);
      setDeployments(deployments.filter(d => d.id !== deploymentToDelete.id));
      handleCloseDeleteDialog();
      // Show success toast
      toast.showSuccess('Deployment deleted successfully');
    } catch (err: any) {
      console.error('Error deleting deployment:', err);
      setError('Failed to delete deployment. Please try again.');
      // Show error toast
      toast.showError(err.response?.data?.message || 'Failed to delete deployment');
    }
  };

  const handleToggleStatus = async (deployment: Deployment) => {
    try {
      let result;
      if (deployment.isActive) {
        result = await deactivateDeployment(deployment.id);
        // Show success toast for deactivation
        toast.showSuccess('Deployment paused successfully');
      } else {
        result = await activateDeployment(deployment.id);
        // Show success toast for activation
        toast.showSuccess('Deployment activated successfully');
      }
      
      // Update local state
      setDeployments(
        deployments.map(d => 
          d.id === deployment.id ? { ...d, isActive: !d.isActive } : d
        )
      );
    } catch (err: any) {
      console.error('Error toggling deployment status:', err);
      setError(`Failed to ${deployment.isActive ? 'pause' : 'resume'} deployment.`);
      // Show error toast
      toast.showError(err.response?.data?.message || `Failed to ${deployment.isActive ? 'pause' : 'activate'} deployment`);
    }
  };

  const handleStopAllDeployments = async () => {
    try {
      setStoppingAll(true);
      const result = await stopAllDeployments();
      
      // Update all deployments to inactive
      setDeployments(
        deployments.map(d => ({ ...d, isActive: false }))
      );
      
      // Show success toast
      toast.showSuccess('All deployments stopped successfully');
    } catch (err: any) {
      console.error('Error stopping all deployments:', err);
      setError('Failed to stop all deployments. Please try again.');
      // Show error toast
      toast.showError(err.response?.data?.message || 'Failed to stop all deployments');
    } finally {
      setStoppingAll(false);
    }
  };

  const handleStartAllDeployments = async () => {
    try {
      setStartingAll(true);
      const result = await startAllDeployments();
      
      // Update all deployments to active
      setDeployments(
        deployments.map(d => ({ ...d, isActive: true }))
      );
      
      // Show success toast
      toast.showSuccess('All deployments started successfully');
    } catch (err: any) {
      console.error('Error starting all deployments:', err);
      setError('Failed to start all deployments. Please try again.');
      // Show error toast
      toast.showError(err.response?.data?.message || 'Failed to start all deployments');
    } finally {
      setStartingAll(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
      {/* Page Header */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Deployments
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="success"
            startIcon={<PlayArrowIcon />}
            onClick={handleStartAllDeployments}
            disabled={startingAll || !Array.isArray(deployments) || deployments.every(d => d.isActive) || deployments.length === 0}
          >
            {startingAll ? 'Starting All...' : 'Start All'}
          </Button>
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
      </Box>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* Deployments List */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={3}>
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
                <CardContent sx={{ flexGrow: 1, pb: 1 }}>
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
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.875rem', height: '40px', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {deployment.description || 'No description provided.'}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                      Last updated: {deployment.lastUpdatedAt ? new Date(deployment.lastUpdatedAt).toLocaleString() : 'Never'}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pt: 0, pb: 1 }}>
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
          minHeight="250px"
          textAlign="center"
          p={3}
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
        maxWidth="xs"
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
