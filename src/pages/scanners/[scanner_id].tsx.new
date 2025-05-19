import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {   
  Container,   
  Typography,   
  Box,   
  Button,   
  Paper,  
  Grid,  
  Chip,  
  CircularProgress,  
  Alert,  
  Divider,  
  useTheme,  
  List,  
  ListItem,  
  ListItemText,  
  IconButton,  
  Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import SearchIcon from '@mui/icons-material/Search';
import ScannerBuilder from '../../components/Scanner/ScannerBuilder';
import ScanResults from '../../components/Scanner/ScanResults';
import { getScanner, updateScanner, deleteScanner, activateScanner, deactivateScanner, runScannerNow } from '../../services/scannerService';

const ScannerDetail: React.FC = () => {
  const router = useRouter();
  const { scanner_id } = router.query;
  const theme = useTheme();
  
  const [scanner, setScanner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any[]>([]);
  const [showScanResults, setShowScanResults] = useState(false);
  const [alertMessage, setAlertMessage] = useState<{
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  } | null>(null);
  
  useEffect(() => {
    if (scanner_id) {
      fetchScannerDetails();
    }
  }, [scanner_id]);
  
  const fetchScannerDetails = async () => {
    setLoading(true);
    try {
      const data = await getScanner(scanner_id as string);
      if (data) {
        setScanner(data);
        setError(null);
      } else {
        setError('Scanner not found');
        router.push('/scanners');
      }
    } catch (err) {
      console.error('Error fetching scanner details:', err);
      setError('Failed to load scanner details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = () => {
    setShowEditor(true);
  };
  
  const handleDelete = async () => {
    try {
      const success = await deleteScanner(scanner_id as string);
      if (success) {
        router.push('/scanners');
      } else {
        setAlertMessage({
          message: 'Failed to delete scanner',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Error deleting scanner:', err);
      setAlertMessage({
        message: 'An error occurred while deleting the scanner',
        severity: 'error'
      });
    }
  };
  
  const handleActivate = async () => {
    try {
      const updatedScanner = await activateScanner(scanner_id as string);
      if (updatedScanner) {
        setScanner(updatedScanner);
        setAlertMessage({
          message: 'Scanner activated successfully',
          severity: 'success'
        });
      }
    } catch (err) {
      console.error('Error activating scanner:', err);
      setAlertMessage({
        message: 'An error occurred while activating the scanner',
        severity: 'error'
      });
    }
  };
  
  const handleDeactivate = async () => {
    try {
      const updatedScanner = await deactivateScanner(scanner_id as string);
      if (updatedScanner) {
        setScanner(updatedScanner);
        setAlertMessage({
          message: 'Scanner deactivated successfully',
          severity: 'success'
        });
      }
    } catch (err) {
      console.error('Error deactivating scanner:', err);
      setAlertMessage({
        message: 'An error occurred while deactivating the scanner',
        severity: 'error'
      });
    }
  };
  
  const handleRunNow = async () => {
    try {
      setIsScanning(true);
      setShowScanResults(false);
      
      const results = await runScannerNow(scanner_id as string);
      if (results && results.success) {
        setScanResults(results.matches);
        setShowScanResults(true);
        
        // Refresh scanner data to update match count
        fetchScannerDetails();
        
        setAlertMessage({
          message: `Scan completed successfully with ${results.matchCount} matches`,
          severity: 'success'
        });
      } else {
        setAlertMessage({
          message: 'Failed to run scanner',
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Error running scanner:', err);
      setAlertMessage({
        message: 'An error occurred while running the scanner',
        severity: 'error'
      });
    } finally {
      setIsScanning(false);
    }
  };
  
  const handleSaveScanner = async (scannerData: any) => {
    try {
      const updatedScanner = await updateScanner(scanner_id as string, scannerData);
      if (updatedScanner) {
        setScanner(updatedScanner);
        setShowEditor(false);
        setAlertMessage({
          message: 'Scanner updated successfully',
          severity: 'success'
        });
      }
    } catch (err) {
      console.error('Error updating scanner:', err);
      setAlertMessage({
        message: 'An error occurred while updating the scanner',
        severity: 'error'
      });
    }
  };
  
  const handleCancelEdit = () => {
    setShowEditor(false);
  };
  
  const closeAlert = () => {
    setAlertMessage(null);
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box 
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/scanners')}
          sx={{ mb: 2 }}
        >
          Back to Scanners
        </Button>
      </Box>
      
      {alertMessage && (
        <Alert 
          severity={alertMessage.severity}
          sx={{ mb: 3 }}
          onClose={closeAlert}
        >
          {alertMessage.message}
        </Alert>
      )}
      
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : showEditor ? (
        <ScannerBuilder
          onSave={handleSaveScanner}
          onCancel={handleCancelEdit}
          editMode={true}
          initialData={scanner}
        />
      ) : scanner && (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  mb={2}
                >
                  <Box>
                    <Typography variant="h4" gutterBottom>
                      {scanner.name}
                    </Typography>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Chip
                        label={scanner.isActive ? 'Active' : 'Inactive'}
                        color={scanner.isActive ? 'success' : 'default'}
                        sx={{ mr: 2 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        Timeframe: {scanner.timeframe}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Tooltip title="Edit Scanner">
                      <IconButton onClick={handleEdit} sx={{ mr: 1 }}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Scanner">
                      <IconButton onClick={handleDelete} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                
                <Typography variant="body1" paragraph>
                  {scanner.description}
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Box mb={3}>
                      <Typography variant="h6" gutterBottom>Scanning Conditions</Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.02)'
                        }}
                      >
                        <List dense>
                          {scanner.conditions.map((condition: string, index: number) => (
                            <ListItem key={index}>
                              <ListItemText
                                primary={condition}
                                primaryTypographyProps={{
                                  fontFamily: 'monospace',
                                  fontWeight: 'medium'
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Box>
                    
                    <Box mb={3}>
                      <Typography variant="h6" gutterBottom>Instruments</Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {scanner.instruments.map((instrument: any, index: number) => (
                          <Chip
                            key={index}
                            label={`${instrument.symbol} (${instrument.exchange})`}
                            variant="outlined"
                            color="primary"
                          />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: theme.palette.mode === 'dark'
                          ? theme.palette.background.paper
                          : theme.palette.grey[50]
                      }}
                    >
                      <Typography variant="h5" gutterBottom align="center">
                        Scanner Status
                      </Typography>
                      
                      <Box
                        sx={{
                          width: '120px',
                          height: '120px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: theme.palette.mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.02)',
                          mb: 2,
                          border: `3px solid ${scanner.isActive
                            ? theme.palette.success.main
                            : theme.palette.grey[500]}`
                        }}
                      >
                        <Typography variant="h3">{scanner.matchCount}</Typography>
                      </Box>
                      <Typography variant="subtitle1" gutterBottom>
                        Matches Found
                      </Typography>
                      
                      <Box sx={{ mt: 3, width: '100%' }}>
                        <Typography variant="caption" display="block" gutterBottom>
                          Created: {new Date(scanner.createdAt).toLocaleString()}
                        </Typography>
                        {scanner.lastRunAt && (
                          <Typography variant="caption" display="block" gutterBottom>
                            Last Run: {new Date(scanner.lastRunAt).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                      
                      <Divider sx={{ width: '100%', my: 2 }} />
                      
                      {scanner.isActive ? (
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<StopIcon />}
                          onClick={handleDeactivate}
                          fullWidth
                          sx={{ mb: 2 }}
                        >
                          Deactivate Scanner
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<PlayArrowIcon />}
                          onClick={handleActivate}
                          fullWidth
                          sx={{ mb: 2 }}
                        >
                          Activate Scanner
                        </Button>
                      )}
                      
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<SearchIcon />}
                        onClick={handleRunNow}
                        fullWidth
                        disabled={isScanning}
                      >
                        {isScanning ? 'Scanning...' : 'Run Now'}
                      </Button>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
          
          {/* Scan Results */}
          {showScanResults && (
            <ScanResults 
              results={scanResults}
              onClose={() => setShowScanResults(false)}
            />
          )}
        </>
      )}
    </Container>
  );
};

export default ScannerDetail;
