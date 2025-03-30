import { Box, Grid, Paper, Typography } from '@mui/material';
import { TextField } from '../components/TextField';
import { Button } from '../components/Button';

// This would come from an API in a real application
const mockUserData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+91 9876543210',
  tradingExperience: '5+ years',
};

export default function Profile() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          maxWidth: 600,
          mx: 'auto',
          borderRadius: 2,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              value={mockUserData.name}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              value={mockUserData.email}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              value={mockUserData.phone}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Trading Experience"
              value={mockUserData.tradingExperience}
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
              <Button variant="outlined">Change Password</Button>
              <Button variant="contained">Edit Profile</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
