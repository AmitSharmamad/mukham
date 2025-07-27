import { Box, Typography } from '@mui/material';

export default function Contact() {
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
        Email your query at support@sutram.co
      </Typography>
    </Box>
  );
}
