import { Container, Typography, Card, CardContent, Grid } from '@mui/material';
import Link from 'next/link';

export default function Reports() {
  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h4">Reports</Typography>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={12} sm={6}>
          <Card component={Link} href="/reports">
            <CardContent>
              <Typography variant="h6">Overall Profit & Loss</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">No. of Actively Deployed Strategies</Typography>
              {/* ...display value... */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
