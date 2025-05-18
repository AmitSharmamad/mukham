import { Box, Typography, Divider, Grid } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';
import { DocContent } from '../../../components';

export default function StrategyOverview() {
  return (
    <DocsLayout>
      <DocContent
        title="Strategy Overview"
        subtitle="Understanding the building blocks of trading strategies in सूत्रम्"
        sx={{ mb: 4 }}
      >
        <Typography variant="body1" paragraph>
          In सूत्रम् (Sutram), a strategy is a set of rules that define when to enter and exit trades. 
          This section provides an overview of how strategies work within the platform and their key components.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          What is a Trading Strategy?
        </Typography>
        <Typography variant="body1" paragraph>
          A trading strategy is a systematic approach to buying and selling financial instruments. 
          It consists of predefined rules that determine:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            When to enter a position (buy or sell)
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            When to exit a position (take profit or cut losses)
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            How much capital to allocate to each trade
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Which financial instruments to trade
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Strategy Components
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Identification
              </Typography>
              <Typography variant="body2" paragraph>
                Each strategy has a unique name and description that helps you identify and understand its purpose.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Instruments
              </Typography>
              <Typography variant="body2" paragraph>
                Strategies can be applied to one or multiple financial instruments such as stocks, futures, or options.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Entry Conditions
              </Typography>
              <Typography variant="body2" paragraph>
                Rules that define when to enter a trade, typically based on technical indicators, price action, or market conditions.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Exit Conditions
              </Typography>
              <Typography variant="body2" paragraph>
                Rules that define when to exit a trade, including take profit levels, stop losses, and trailing stops.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Risk Management
              </Typography>
              <Typography variant="body2" paragraph>
                Parameters that control position sizing, maximum allocation, and risk per trade.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Timeframe
              </Typography>
              <Typography variant="body2" paragraph>
                The time interval for chart data analysis (e.g., 1 minute, 5 minutes, 1 hour, daily).
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Strategy Types
        </Typography>
        <Typography variant="body1" paragraph>
          सूत्रम् supports various types of trading strategies:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Trend-following strategies:</strong> Designed to capture momentum in market trends.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Mean-reversion strategies:</strong> Based on the assumption that prices will revert to their average.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Breakout strategies:</strong> Entering trades when price breaks through significant levels.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Indicator-based strategies:</strong> Using technical indicators to generate signals.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Multi-factor strategies:</strong> Combining multiple conditions and indicators.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Strategy Lifecycle
        </Typography>
        <Typography variant="body1" paragraph>
          The typical lifecycle of a strategy in सूत्रम् includes:
        </Typography>
        <Box component="ol" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Creation:</strong> Building the strategy using the Strategy Builder.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Backtesting:</strong> Testing the strategy against historical data.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Optimization:</strong> Adjusting parameters to improve performance.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Deployment:</strong> Activating the strategy for live trading.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Monitoring:</strong> Tracking performance and making adjustments as needed.
          </Typography>
        </Box>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Strategy Management
        </Typography>
        <Typography variant="body1" paragraph>
          सूत्रम् provides tools for managing your strategies:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Strategy List:</strong> View and manage all your created strategies.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Strategy Details:</strong> Access detailed information about each strategy.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Edit Strategy:</strong> Modify existing strategies to improve performance.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Duplicate Strategy:</strong> Create copies of strategies for testing variations.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Delete Strategy:</strong> Remove strategies that are no longer needed.
          </Typography>
        </Box>
      </DocContent>
    </DocsLayout>
  );
}
