import { useEffect, useState, useCallback } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardActions,
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
  Grid,
  Chip,
  Tooltip,
  Tabs,
  Tab,
  Divider,
  Container
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  ContentCopy as ContentCopyIcon,
  Edit as EditIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useToastContext } from '../../context/ToastContext';
import type { Strategy } from '../../types/strategy';
import { checkPageAuth } from '../../utils/pageAuthUtils';

export default function StrategyList() {
  const router = useRouter();
  const [userStrategies, setUserStrategies] = useState<Strategy[]>([]);
  const [defaultStrategies, setDefaultStrategies] = useState<Strategy[]>([]);
  const [filteredUserStrategies, setFilteredUserStrategies] = useState<Strategy[]>([]);
  const [filteredDefaultStrategies, setFilteredDefaultStrategies] = useState<Strategy[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingDefaults, setLoadingDefaults] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [defaultError, setDefaultError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [retryingDefaults, setRetryingDefaults] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [cloning, setCloning] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; strategy: Strategy | null }>({
    open: false,
    strategy: null
  });
  const { showToast } = useToastContext();

  const fetchUserStrategies = useCallback(async () => {
    try {
      setError(null);
      setRetrying(false);
      const response = await fetch('/api/strategy');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setUserStrategies(data.data);
        setFilteredUserStrategies(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch user strategies');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error connecting to server';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDefaultStrategies = useCallback(async () => {
    try {
      setDefaultError(null);
      setRetryingDefaults(false);
      setLoadingDefaults(true);
      
      const response = await fetch('/api/strategy/default');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setDefaultStrategies(data.data);
        setFilteredDefaultStrategies(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch default strategies');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error connecting to server';
      setDefaultError(errorMessage);
    } finally {
      setLoadingDefaults(false);
    }
  }, []);

  useEffect(() => {
    const initPage = async () => {
      // Check authentication once when the page loads
      const isAuthed = await checkPageAuth(router);
      
      // If authenticated, fetch strategies
      if (isAuthed) {
        await fetchUserStrategies();
        await fetchDefaultStrategies();
      }
    };
    
    initPage();
  }, []); // Changed dependency array to [] to ensure it runs only once on mount

  useEffect(() => {
    if (!userStrategies) return;
    
    const filtered = userStrategies.filter(strategy => 
      strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (strategy.description && strategy.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredUserStrategies(filtered);
  }, [searchQuery, userStrategies]);

  useEffect(() => {
    if (!defaultStrategies) return;
    
    const filtered = defaultStrategies.filter(strategy => 
      strategy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (strategy.description && strategy.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredDefaultStrategies(filtered);
  }, [searchQuery, defaultStrategies]);

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
    await fetchUserStrategies();
  };

  const handleRetryDefaults = async () => {
    setRetryingDefaults(true);
    await fetchDefaultStrategies();
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
        // Display the API response message
        showToast(data.message || 'Strategy deleted successfully', 'success');
        setUserStrategies(prev => prev.filter(s => s.id !== deleteDialog.strategy!.id));
        setFilteredUserStrategies(prev => prev.filter(s => s.id !== deleteDialog.strategy!.id));
        handleCloseDeleteDialog();
      } else {
        showToast(data.message || data.error || 'Failed to delete strategy', 'error');
      }
    } catch (err) {
      showToast('Error deleting strategy', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const handleCloneStrategy = async (event: React.MouseEvent, strategy: Strategy, isDefault = false) => {
    event.stopPropagation(); // Prevent card click when clicking clone
    try {
      setCloning(strategy.id);
      
      // Different API endpoints for user vs default strategies
      const endpoint = isDefault 
        ? `/api/strategy/default/${strategy.id}/clone`
        : `/api/strategy/${strategy.id}/clone`;
        
      const response = await fetch(endpoint, {
        method: 'POST'
      });

      const data = await response.json();
      if (data.success) {
        // Display the API response message
        showToast(data.message || 'Strategy cloned successfully', 'success');
        await fetchUserStrategies(); // Refresh user strategies after cloning
      } else {
        showToast(data.message || data.error || 'Failed to clone strategy', 'error');
      }
    } catch (err) {
      showToast('Error cloning strategy', 'error');
    } finally {
      setCloning(null);
    }
  };

  // Render strategy cards for both user and default strategies
  const renderStrategyCards = (strategies: Strategy[], isDefault = false) => {
    if (!strategies || strategies.length === 0) {
      return (
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
            {isDefault ? 'No default strategies found' : 'No strategies found'}
          </Typography>
          {!isDefault && (
            <>
              <Typography variant="body2" color="text.secondary" paragraph>
                Create your first strategy to start building your algorithmic trading portfolio.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateStrategy}
              >
                Create Strategy
              </Button>
            </>
          )}
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {strategies.map((strategy) => (
          <Grid item xs={12} sm={6} md={4} key={`${isDefault ? 'default-' : ''}${strategy.id}`}>
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
              onClick={!isDefault ? () => handleStrategyClick(strategy.id) : undefined}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {strategy.name}
                  </Typography>
                  <Chip 
                    label={strategy.is_active ? 'Active' : 'Inactive'} 
                    color={strategy.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {strategy.description || 'No description provided.'}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {new Date(strategy.updated_at).toLocaleString()}
                  </Typography>
                  {isDefault && (
                    <Chip 
                      label="Default" 
                      color="secondary"
                      size="small"
                    />
                  )}
                </Box>
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Box>
                  {!isDefault && (
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStrategyClick(strategy.id);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="Clone">
                    <IconButton 
                      size="small" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloneStrategy(e, strategy, isDefault);
                      }}
                      disabled={cloning === strategy.id}
                    >
                      {cloning === strategy.id ? (
                        <CircularProgress size={16} />
                      ) : (
                        <ContentCopyIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                  {!isDefault && (
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(e, strategy);
                        }}
                        disabled={deleting === strategy.id}
                      >
                        {deleting === strategy.id ? (
                          <CircularProgress size={16} />
                        ) : (
                          <DeleteIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
                {!isDefault && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStrategyClick(strategy.id);
                    }}
                  >
                    Edit Strategy
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  if (loading && loadingDefaults) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

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
          Trading Strategies
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreateStrategy}
        >
          Create Strategy
        </Button>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Search strategies..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{
            maxWidth: '300px',
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
      </Box>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {/* User Strategies Section */}
      <Box mb={6}>
        <Typography variant="h5" gutterBottom>
          User Strategies
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {loading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center', py: 2 }}>
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
            {renderStrategyCards(filteredUserStrategies)}
          </>
        )}
      </Box>

      {/* Default Strategies Section */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Default Strategies
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        {defaultError ? (
          <Box sx={{ maxWidth: 600, mx: 'auto', textAlign: 'center', py: 2 }}>
            <Alert 
              severity="error" 
              sx={{ mb: 3 }}
              action={
                <Button 
                  color="inherit" 
                  onClick={handleRetryDefaults}
                  disabled={retryingDefaults}
                >
                  {retryingDefaults ? <CircularProgress size={20} /> : 'Retry'}
                </Button>
              }
            >
              {defaultError}
            </Alert>
          </Box>
        ) : loadingDefaults ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {renderStrategyCards(filteredDefaultStrategies, true)}
          </>
        )}
      </Box>

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

      {/* Toast is now provided by ToastContext */}
    </Container>
  );
}
