import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { getScanners, deleteScanner, activateScanner, deactivateScanner, runScannerNow } from '../services/scannerService';

interface Scanner {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  instruments: any[];
  conditions: string[];
  isActive: boolean;
  createdAt: string;
  lastRunAt?: string;
  matchCount: number;
}

const ScannersPage = () => {
  const router = useRouter();
  const [scanners, setScanners] = useState<Scanner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [runningScannerId, setRunningScannerId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [scannerToDelete, setScannerToDelete] = useState<Scanner | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchScanners();
  }, []);

  const fetchScanners = async () => {
    try {
      setLoading(true);
      const data = await getScanners();
      setScanners(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching scanners:', err);
      setError('Failed to load scanners. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScanner = () => {
    router.push('/scanners/new');
  };

  const handleEditScanner = (scannerId: string) => {
    router.push(`/scanners/${scannerId}`);
  };

  const handleOpenDeleteDialog = (scanner: Scanner) => {
    setScannerToDelete(scanner);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setScannerToDelete(null);
  };

  const handleDeleteScanner = async () => {
    if (!scannerToDelete) return;
    
    try {
      await deleteScanner(scannerToDelete.id);
      setScanners(scanners.filter(scanner => scanner.id !== scannerToDelete.id));
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting scanner:', err);
      setError('Failed to delete scanner. Please try again.');
    }
  };

  const handleToggleStatus = async (scanner: Scanner) => {
    try {
      if (scanner.isActive) {
        await deactivateScanner(scanner.id);
      } else {
        await activateScanner(scanner.id);
      }
      
      // Update local state
      setScanners(
        scanners.map(s => 
          s.id === scanner.id ? { ...s, isActive: !s.isActive } : s
        )
      );
    } catch (err) {
      console.error('Error toggling scanner status:', err);
      setError(`Failed to ${scanner.isActive ? 'deactivate' : 'activate'} scanner.`);
    }
  };

  const handleRunScanner = async (scannerId: string) => {
    try {
      setRunningScannerId(scannerId);
      await runScannerNow(scannerId);
      
      // After a successful run, refresh scanners to get updated results
      await fetchScanners();
    } catch (err) {
      console.error('Error running scanner:', err);
      setError('Failed to run scanner. Please try again.');
    } finally {
      setRunningScannerId(null);
    }
  };

  const getStatusChipColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      {/* Page Header */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4}
      >
        <Typography variant="h4" component="h1">
          Market Scanners
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateScanner}
        >
          Create Scanner
        </Button>
      </Box>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* Scanners List */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : scanners.length > 0 ? (
        <Grid container spacing={3}>
          {scanners.map((scanner) => (
            <Grid item xs={12} sm={6} md={4} key={scanner.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" component="h2" gutterBottom>
                      {scanner.name}
                    </Typography>
                    <Chip 
                      label={scanner.isActive ? 'Active' : 'Inactive'} 
                      color={scanner.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {scanner.description || 'No description provided.'}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption" color="text.secondary">
                      Last run: {scanner.lastRunAt ? new Date(scanner.lastRunAt).toLocaleString() : 'Never'}
                    </Typography>
                    {scanner.matchCount !== undefined && (
                      <Chip 
                        label={`${scanner.matchCount} matches`} 
                        size="small" 
                        color={scanner.matchCount > 0 ? 'primary' : 'default'}
                      />
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditScanner(scanner.id)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={() => handleOpenDeleteDialog(scanner)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box>
                    <Tooltip title={scanner.isActive ? 'Deactivate' : 'Activate'}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleToggleStatus(scanner)}
                        color={scanner.isActive ? 'success' : 'default'}
                      >
                        {scanner.isActive ? <PauseIcon fontSize="small" /> : <PlayArrowIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleRunScanner(scanner.id)}
                      disabled={runningScannerId === scanner.id}
                      startIcon={runningScannerId === scanner.id ? <CircularProgress size={16} /> : null}
                    >
                      {runningScannerId === scanner.id ? 'Running...' : 'Run Now'}
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
            No scanners found
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Create your first scanner to start monitoring the market for trading opportunities.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateScanner}
          >
            Create Scanner
          </Button>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Delete Scanner</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{scannerToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteScanner} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScannersPage;
