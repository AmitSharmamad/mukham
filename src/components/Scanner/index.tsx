import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  useTheme,
  Button,
  IconButton,
  Tooltip,
  Paper,
  Chip,
  Divider
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export interface ScannerProps {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  lastRunAt?: string;
  matchCount?: number;
  conditions: string[];
  onActivate?: (id: string) => void;
  onDeactivate?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({
  id,
  name,
  description,
  isActive,
  createdAt,
  lastRunAt,
  matchCount = 0,
  conditions,
  onActivate,
  onDeactivate,
  onEdit,
  onDelete
}) => {
  const theme = useTheme();
  
  const handleActivate = () => {
    if (onActivate) onActivate(id);
  };
  
  const handleDeactivate = () => {
    if (onDeactivate) onDeactivate(id);
  };
  
  const handleEdit = () => {
    if (onEdit) onEdit(id);
  };
  
  const handleDelete = () => {
    if (onDelete) onDelete(id);
  };
  
  return (
    <Card 
      elevation={3}
      sx={{
        mb: 2,
        borderLeft: isActive ? `4px solid ${theme.palette.success.main}` : 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[6]
        }
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6" component="h2" fontWeight="bold">{name}</Typography>
              <Box>
                {isActive ? (
                  <Chip 
                    label="Active" 
                    color="success" 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                ) : (
                  <Chip 
                    label="Inactive" 
                    color="default" 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                )}
                <Tooltip title="Edit Scanner">
                  <IconButton size="small" onClick={handleEdit}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Scanner">
                  <IconButton size="small" onClick={handleDelete} color="error">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {description}
            </Typography>
            
            <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
              Created: {new Date(createdAt).toLocaleString()}
            </Typography>
            
            {lastRunAt && (
              <Typography variant="caption" display="block" sx={{ mb: 0.5 }}>
                Last Run: {new Date(lastRunAt).toLocaleString()}
              </Typography>
            )}
            
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>Conditions:</Typography>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 1.5, 
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                  maxHeight: '120px',
                  overflowY: 'auto'
                }}
              >
                {conditions.map((condition, index) => (
                  <React.Fragment key={index}>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {condition}
                    </Typography>
                    {index < conditions.length - 1 && <Divider sx={{ my: 0.5 }} />}
                  </React.Fragment>
                ))}
              </Paper>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              height="100%"
            >
              <Box
                sx={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.05)' 
                    : 'rgba(0, 0, 0, 0.02)',
                  mb: 2
                }}
              >
                <Typography variant="h4">{matchCount}</Typography>
              </Box>
              <Typography variant="subtitle2" gutterBottom>
                Matches Found
              </Typography>
              
              {isActive ? (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<StopIcon />}
                  onClick={handleDeactivate}
                  sx={{ mt: 2, width: '100%' }}
                >
                  Stop Scanner
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleActivate}
                  sx={{ mt: 2, width: '100%' }}
                >
                  Start Scanner
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Scanner;
