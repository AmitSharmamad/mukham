import { Box, Typography } from '@mui/material';

export default function Careers() {
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
      <Typography variant="h2" component="h1" sx={{ mb: 2, fontWeight: 600 }}>
        💼 Coming Soon
      </Typography>
      <Typography variant="h5" color="text.secondary">
        We will open our careers page soon. Stay tuned!
      </Typography>
    </Box>
  );
}
