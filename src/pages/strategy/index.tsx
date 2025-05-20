import { useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress, 
  TextField, 
  Alert, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar
} from '@mui/material';
import { Delete as DeleteIcon, ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { useRouter } from 'next/router';
import type { Strategy } from '../../types/strategy';
import { checkPageAuth } from '../../utils/pageAuthUtils';

export default function StrategyList() {
  const router = useRouter();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [filteredStrategies, setFilteredStrategies] = useState<Strategy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [cloning, setCloning] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; strategy: Strategy | null }>({
    open: false,
    strategy: null
  });
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  const showToast = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setToast({
      open: true,
      message,
      severity
    });
  };

  const fetchStrategies = useCallback(async () => {
    try {
      setError(null);
      setRetrying(false);
      const response = await fetch('/api/strategy');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setStrategies(data.data);
        setFilteredStrategies(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch strategies');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error connecting to server';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initPage = async () => {
      // Check authentication once when the page loads
      const isAuthed = await checkPageAuth(router);
      
      // If authenticated, fetch strategies
      if (isAuthed) {
        await fetchStrategies();
      }
    };
    
    initPage();
  }, []); // Changed dependency array to [] to ensure it runs only once on mount

  useEffect(() => {
    if (!strategies) return;
    
    const filtered = strategies.filter(strategy => 
      strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (strategy.description && strategy.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredStrategies(filtered);
  }, [searchQuery, strategies]);

  const handleCreateStrategy = () => {
    router.push('/strategy/new');
  };

  const handleStrategyClick = (id: string) => {
    router.push(`/strategy/${id}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleRetry = async () => {
    setRetrying(true);
    await fetchStrategies();
  };

  const handleDeleteClick = (event: React.MouseEvent, strategy: Strategy) => {
    event.stopPropagation(); // Prevent card click when clicking delete
    setDeleteDialog({ open: true, strategy });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialog({ open: false, strategy: null });
  };

  const handleConfirmDelete = async () => {
    if (!deleteDialog.strategy) return;

    try {
      setDeleting(deleteDialog.strategy.id);
      const response = await fetch(`/api/strategy/${deleteDialog.strategy.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        showToast('Strategy deleted successfully', 'success');
        setStrategies(prev => prev.filter(s => s.id !== deleteDialog.strategy!.id));
        setFilteredStrategies(prev => prev.filter(s => s.id !== deleteDialog.strategy!.id));
        handleCloseDeleteDialog();
      } else {
        showToast(data.error || 'Failed to delete strategy', 'error');
      }
    } catch (err) {
      showToast('Error deleting strategy', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const handleCloneStrategy = async (event: React.MouseEvent, strategy: Strategy) => {
    event.stopPropagation(); // Prevent card click when clicking clone
    try {
      setCloning(strategy.id);
      const response = await fetch(`/api/strategy/${strategy.id}/clone`, {
        method: 'POST'
      });

      const data = await response.json();
      if (data.success) {
        showToast('Strategy cloned successfully', 'success');
        await fetchStrategies();
      } else {
        showToast(data.error || 'Failed to clone strategy', 'error');
      }
    } catch (err) {
      showToast('Error cloning strategy', 'error');
    } finally {
      setCloning(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {error ? (
        <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center', py: 4 }}>
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button 
                color="inherit" 
                onClick={handleRetry}
                disabled={retrying}
              >
                {retrying ? <CircularProgress size={20} /> : 'Retry'}
              </Button>
            }
          >
            {error}
          </Alert>
          <Button variant="contained" onClick={handleCreateStrategy}>
            Create New Strategy
          </Button>
        </Box>
      ) : (
        <>
          <Box display="flex" alignItems="center" gap={3} mb={4}>
            <Typography variant="h4">Strategies</Typography>
            {strategies && strategies.length > 0 && (
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search strategies..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  width: '300px',
                  backgroundColor: 'background.paper',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'divider',
                    },
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />
            )}
            <Box flexGrow={1} />
            <Button variant="contained" color="primary" onClick={handleCreateStrategy}>
              Create Strategy
            </Button>
          </Box>

          {!strategies || strategies.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" gutterBottom>No strategies found</Typography>
              <Button variant="contained" color="primary" onClick={handleCreateStrategy}>
                Create Your First Strategy
              </Button>
            </Box>
          ) : filteredStrategies.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" gutterBottom>No matching strategies found</Typography>
              <Typography color="textSecondary">Try adjusting your search query</Typography>
            </Box>
          ) : (
            <Box display="grid" gap={3} gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))">
              {filteredStrategies.map((strategy) => (
                <Card 
                  key={strategy.id} 
                  onClick={() => handleStrategyClick(strategy.id)}
                  sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
                >
                  <CardContent sx={{ position: 'relative' }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Typography variant="h6" gutterBottom>{strategy.name}</Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleCloneStrategy(e, strategy)}
                          disabled={cloning === strategy.id}
                          title="Clone Strategy"
                          sx={{ 
                            '&:hover': { color: 'primary.main' }
                          }}
                        >
                          {cloning === strategy.id ? (
                            <CircularProgress size={20} />
                          ) : (
                            <ContentCopyIcon fontSize="small" />
                          )}
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleDeleteClick(e, strategy)}
                          disabled={deleting === strategy.id}
                          title="Delete Strategy"
                          sx={{ 
                            '&:hover': { color: 'error.main' }
                          }}
                        >
                          {deleting === strategy.id ? (
                            <CircularProgress size={20} />
                          ) : (
                            <DeleteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography color="textSecondary" noWrap>{strategy.description}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Position: {strategy.position_type}
                    </Typography>
                    <Typography variant="body2">
                      Created: {new Date(strategy.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          <Dialog
            open={deleteDialog.open}
            onClose={handleCloseDeleteDialog}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
          >
            <DialogTitle id="delete-dialog-title">
              Delete Strategy
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="delete-dialog-description">
                Are you sure you want to delete the strategy "{deleteDialog.strategy?.name}"? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDeleteDialog} color="inherit">
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmDelete} 
                color="error"
                variant="contained"
                disabled={!!deleting}
              >
                {deleting ? <CircularProgress size={24} /> : 'Delete'}
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={toast.open}
            autoHideDuration={6000}
            onClose={handleCloseToast}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
              {toast.message}
            </Alert>
          </Snackbar>
        </>
      )}
    </Box>
  );
}
