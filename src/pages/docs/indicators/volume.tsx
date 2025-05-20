import { Box, Typography, Paper, Divider, Grid } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';

export default function VolumeIndicators() {
  return (
    <DocsLayout>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Volume Indicators
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          Volume indicators measure the intensity of market activity by analyzing trading volume.
          These indicators help confirm price movements, identify potential reversals, and assess the strength of market trends.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Understanding Volume Analysis
        </Typography>
        <Typography variant="body1" paragraph>
          Volume is a critical component of market analysis, often considered the "fuel" that drives price movements.
          Strong volume accompanying price changes suggests conviction, while price movements on low volume may lack sustainability.
        </Typography>
        <Typography variant="body1" paragraph>
          In सूत्रम्, volume indicators can be used to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            Confirm the strength of price trends
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Identify potential exhaustion or accumulation phases
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Detect divergences between price and volume (potential reversal signals)
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Measure buying or selling pressure
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Key Volume Indicators
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                On-Balance Volume (OBV)
              </Typography>
              <Typography variant="body2" paragraph>
                OBV is a cumulative indicator that adds volume on up days and subtracts volume on down days.
                It helps identify buying and selling pressure by showing if volume is flowing in or out of a security.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Calculation:</strong>
                <br />
                - If today's close {'>'} yesterday's close: OBV = Previous OBV + Today's Volume
                <br />
                - If today's close {'<'} yesterday's close: OBV = Previous OBV - Today's Volume
                <br />
                - If today's close = yesterday's close: OBV = Previous OBV
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Signals and Interpretation:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Trend Confirmation:</strong> OBV should move in the same direction as price in a healthy trend.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Divergence:</strong> When price makes a new high/low but OBV doesn't, it can signal a potential reversal.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Breakouts:</strong> OBV breaking out of a consolidation range can precede a price breakout.
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Example Strategy Using OBV:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Condition:</strong> OBV makes a new 30-day high AND price breaks above resistance
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Exit Condition:</strong> OBV starts declining for 3 consecutive days OR price breaks below support
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Volume Profile
              </Typography>
              <Typography variant="body2" paragraph>
                Volume Profile is a visual representation of trading volume at specific price levels over a given time period.
                It helps identify areas of high and low interest, potential support/resistance levels, and fair value areas.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Components:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Point of Control (POC):</strong> The price level with the highest trading volume.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Value Area:</strong> The price range containing a specific percentage (typically 70%) of the total volume.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>High Volume Nodes:</strong> Price levels with significant trading activity.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Low Volume Nodes:</strong> Price levels with minimal trading activity.
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Signals and Interpretation:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Support/Resistance:</strong> High volume nodes often act as support or resistance levels.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Breakouts:</strong> Price moves through low volume areas tend to be fast and directional.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Value Area Analysis:</strong> Price often reverts to the value area; sustained moves outside the value area can signal a new trend.
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Example Strategy Using Volume Profile:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Condition:</strong> Price breaks above a high volume node with increased volume AND stays above for a specific period
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Exit Condition:</strong> Price approaches the next significant high volume node OR falls back below the breakout level
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Volume Weighted Average Price (VWAP)
              </Typography>
              <Typography variant="body2" paragraph>
                VWAP is a trading benchmark that represents the average price a security has traded at throughout the day, based on both volume and price.
                It's widely used by institutional traders to assess the quality of execution.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Formula:</strong> VWAP = Cumulative(Price * Volume) / Cumulative(Volume)
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Parameters:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2">Period: The time period for calculation (typically one trading day).</Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Signals and Interpretation:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Price vs. VWAP:</strong> Price above VWAP indicates bullish sentiment; price below VWAP indicates bearish sentiment.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Support/Resistance:</strong> VWAP often acts as dynamic support or resistance.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Mean Reversion:</strong> Price tends to revert to VWAP during the trading session.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Trend Strength:</strong> Sustained price movement away from VWAP suggests strong trending action.
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Example Strategy Using VWAP:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Condition:</strong> Price pulls back to VWAP from above and bounces with increasing volume
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Exit Condition:</strong> Price crosses below VWAP OR end of trading session
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Combining Volume Indicators
        </Typography>
        <Typography variant="body1" paragraph>
          Volume indicators are most effective when combined with price-based or momentum indicators:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>OBV + Moving Averages:</strong> Use moving averages to identify the trend direction and OBV to confirm the strength of the trend.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>VWAP + RSI:</strong> Use VWAP to determine the intraday trend and RSI to identify potential reversal points.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Volume Profile + Support/Resistance:</strong> Confirm traditional support/resistance levels with volume profile analysis.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Best Practices for Using Volume Indicators
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Consider Time of Day:</strong> Volume patterns vary throughout the trading day (typically higher at open and close).
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Factor in Market Events:</strong> Unusual volume spikes may be caused by news, earnings, or other market events.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Don't Rely Solely on Volume:</strong> Use volume indicators in conjunction with price analysis and other technical indicators.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Be Aware of Liquidity:</strong> Volume indicators may be less reliable in illiquid markets or during extended trading hours.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Confirm Breakouts with Volume:</strong> Valid breakouts should be accompanied by increased volume to indicate conviction.
          </Typography>
        </Box>
      </Paper>
    </DocsLayout>
  );
}
