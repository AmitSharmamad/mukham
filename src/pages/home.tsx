import { Container, Link, Typography, Box, Grid, Paper, Button } from '@mui/material';

export default function Home() {
  return (
    <Container sx={{ marginTop: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Home</Typography>
        <Button variant="contained" color="error" sx={{ backgroundColor: 'red' }}>
          Stop All
        </Button>
      </Box>
      <Grid container spacing={2} sx={{ marginTop: 4 }}>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Profit/Loss</Typography>
            <Typography variant="h4">$12,345</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ padding: 2, textAlign: 'center' }}>
            <Typography variant="h6">Active Deployments</Typography>
            <Typography variant="h4">5</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
