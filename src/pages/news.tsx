import { Box, Typography } from '@mui/material';

export default function News() {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        textAlign: 'center'
      }}
    >
      <Typography variant="h5" color="text.primary">
        Beta program for our platform starts on August 15th, 2025. Hold on to your seats 🚀
      </Typography>
    </Box>
  );
}
