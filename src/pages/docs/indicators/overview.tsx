import { Box, Typography, Divider, Grid, List, ListItem, ListItemText } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';
import { DocContent } from '../../../components';
import Link from 'next/link';

export default function IndicatorsOverview() {
  return (
    <DocsLayout>
      <DocContent
        title="Technical Indicators Overview"
        subtitle="Leveraging mathematical calculations to forecast market movements"
        sx={{ mb: 4 }}
      >
        <Typography variant="body1" paragraph>
          Technical indicators are mathematical calculations based on historical price, volume, or open interest information
          that aim to forecast financial market direction. सूत्रम् (Sutram) provides a comprehensive suite of indicators
          to help you build effective trading strategies.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Understanding Technical Indicators
        </Typography>
        <Typography variant="body1" paragraph>
          Technical indicators serve several purposes in trading strategy development:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Signal Generation:</strong> Providing buy or sell signals based on market conditions.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Trend Identification:</strong> Helping traders identify and confirm market trends.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Support/Resistance Detection:</strong> Identifying potential price levels where the market might reverse.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Momentum Measurement:</strong> Gauging the strength or weakness of a price movement.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Volatility Assessment:</strong> Measuring the rate and magnitude of price changes.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Indicator Categories
        </Typography>
        <Typography variant="body1" paragraph>
          सूत्रम् organizes technical indicators into the following categories:
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Trend Indicators
              </Typography>
              <Typography variant="body2" paragraph>
                These indicators help identify the direction of market movement.
              </Typography>
              <List dense>
                <ListItem component={Link} href="/docs/indicators/trend" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText 
                    primary="Moving Averages (SMA, EMA, WMA)" 
                    secondary="Smooth price data to identify trends"
                  />
                </ListItem>
                <ListItem component={Link} href="/docs/indicators/trend" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText 
                    primary="MACD (Moving Average Convergence Divergence)" 
                    secondary="Shows relationship between two moving averages"
                  />
                </ListItem>
                <ListItem component={Link} href="/docs/indicators/trend" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText 
                    primary="Parabolic SAR" 
                    secondary="Identifies potential reversals in market price"
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Momentum Indicators
              </Typography>
              <Typography variant="body2" paragraph>
                These indicators measure the rate of price changes over time.
              </Typography>
              <List dense>
                <ListItem component={Link} href="/docs/indicators/momentum" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText 
                    primary="Relative Strength Index (RSI)" 
                    secondary="Measures speed and change of price movements"
                  />
                </ListItem>
                <ListItem component={Link} href="/docs/indicators/momentum" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText 
                    primary="Stochastic Oscillator" 
                    secondary="Compares closing price to price range over time"
                  />
                </ListItem>
                <ListItem component={Link} href="/docs/indicators/momentum" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText 
                    primary="Rate of Change (ROC)" 
                    secondary="Measures percentage change between current price and price n periods ago"
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Volatility Indicators
              </Typography>
              <Typography variant="body2" paragraph>
                These indicators measure the rate of price fluctuations.
              </Typography>
              <List dense>
                <ListItem component={Link} href="/docs/indicators/volatility" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText 
                    primary="Bollinger Bands" 
                    secondary="Measures volatility by placing bands around a moving average"
                  />
                </ListItem>
                <ListItem component={Link} href="/docs/indicators/volatility" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText 
                    primary="Average True Range (ATR)" 
                    secondary="Measures market volatility by decomposing price range"
                  />
                </ListItem>
                <ListItem component={Link} href="/docs/indicators/volatility" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText 
                    primary="Keltner Channel" 
                    secondary="Volatility-based envelopes set above and below an EMA"
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Volume Indicators
              </Typography>
              <Typography variant="body2" paragraph>
                These indicators use volume data to assess market strength.
              </Typography>
              <List dense>
                <ListItem component={Link} href="/docs/indicators/volume" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText 
                    primary="On-Balance Volume (OBV)" 
                    secondary="Relates volume to price change"
                  />
                </ListItem>
                <ListItem component={Link} href="/docs/indicators/volume" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText 
                    primary="Volume Weighted Average Price (VWAP)" 
                    secondary="Average price weighted by volume"
                  />
                </ListItem>
                <ListItem component={Link} href="/docs/indicators/volume" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText 
                    primary="Accumulation/Distribution Line" 
                    secondary="Evaluates money flow in and out of a security"
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Price Action Indicators
              </Typography>
              <Typography variant="body2" paragraph>
                These indicators are based directly on price movement patterns.
              </Typography>
              <List dense>
                <ListItem component={Link} href="/docs/indicators/price-action" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText 
                    primary="Candlestick Patterns" 
                    secondary="Patterns formed by open, high, low, and close prices"
                  />
                </ListItem>
                <ListItem component={Link} href="/docs/indicators/price-action" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText 
                    primary="Support and Resistance Levels" 
                    secondary="Price levels where market tends to reverse"
                  />
                </ListItem>
                <ListItem component={Link} href="/docs/indicators/price-action" sx={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItemText 
                    primary="Chart Patterns" 
                    secondary="Recognizable patterns that signal potential market moves"
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Custom Indicators
              </Typography>
              <Typography variant="body2" paragraph>
                सूत्रम् allows combining existing indicators to create custom signals.
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Indicator Combinations" 
                    secondary="Combine multiple indicators into a single signal"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Conditional Logic" 
                    secondary="Create custom conditions based on multiple indicators"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Signal Filtering" 
                    secondary="Filter signals based on market conditions"
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Using Indicators in Strategy Builder
        </Typography>
        <Typography variant="body1" paragraph>
          In the Strategy Builder, you can use indicators in several ways:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Simple Conditions:</strong> "RSI crosses below 30" or "Price crosses above 200-day SMA"
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Complex Conditions:</strong> Combine multiple indicators with AND/OR logic
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Time-Based Conditions:</strong> Apply indicators to specific time periods
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Multi-Timeframe Analysis:</strong> Compare indicators across different timeframes
          </Typography>
        </Box>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Best Practices
        </Typography>
        <Typography variant="body1" paragraph>
          When working with technical indicators, consider these best practices:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Use Multiple Indicators:</strong> Combine different types of indicators to confirm signals.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Avoid Redundancy:</strong> Don't use too many indicators that provide the same information.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Understand Parameters:</strong> Know how changing parameters affects indicator behavior.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Consider Market Context:</strong> Some indicators work better in trending markets, others in ranging markets.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Backtest Thoroughly:</strong> Test indicators across different market conditions.
          </Typography>
        </Box>
      </DocContent>
    </DocsLayout>
  );
}
