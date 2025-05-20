import { Box, Grid, Typography } from '@mui/material';
import { DashboardWidget } from '../components/DashboardWidget';

// This would come from an API in a real application
const mockData = {
  totalPnl: '+₹25,430',
  activeStrategies: 3,
};

export default function Reports() {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Reports
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardWidget
            title="Overall Profit & Loss"
            value={mockData.totalPnl}
            subtitle="Total P&L across all strategies"
            href="/reports/pnl"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <DashboardWidget
            title="Active Strategies"
            value={mockData.activeStrategies}
            subtitle="Currently deployed strategies"
            href="/strategy"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
