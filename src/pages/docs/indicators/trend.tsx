import { Box, Typography, Paper, Divider, Grid } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';

export default function TrendIndicators() {
  return (
    <DocsLayout>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Trend Indicators
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          Trend indicators help traders identify the direction and strength of market trends. These indicators 
          are essential tools in सूत्रम् (Sutram) for developing trend-following strategies and confirming 
          the presence of market trends.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Understanding Trend Analysis
        </Typography>
        <Typography variant="body1" paragraph>
          Markets typically move in three directions: uptrend (higher highs and higher lows), downtrend 
          (lower highs and lower lows), or sideways/ranging (no clear direction). Trend indicators help 
          traders determine which of these conditions is currently present and make trading decisions accordingly.
        </Typography>
        <Typography variant="body1" paragraph>
          In सूत्रम्, trend indicators can be used to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            Generate entry and exit signals based on trend direction
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Filter out potential trades that go against the prevailing trend
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Confirm signals from other indicators
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Measure trend strength to adjust position sizing
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Key Trend Indicators
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Moving Averages
              </Typography>
              <Typography variant="body2" paragraph>
                Moving averages smooth out price data to help identify trends by filtering out market noise. 
                सूत्रम् supports several types of moving averages:
              </Typography>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Simple Moving Average (SMA)
                </Typography>
                <Typography variant="body2" paragraph>
                  The SMA calculates the average price over a specific number of periods, giving equal weight to each price point.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Formula:</strong> SMA = (P₁ + P₂ + ... + Pₙ) / n
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Parameters:</strong>
                </Typography>
                <Box component="ul" sx={{ pl: 4 }}>
                  <Typography component="li" variant="body2">Period (n): The number of price bars to include in the calculation.</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  <strong>Common Uses:</strong>
                </Typography>
                <Box component="ul" sx={{ pl: 4 }}>
                  <Typography component="li" variant="body2">Trend Direction: Price above SMA indicates uptrend; price below indicates downtrend.</Typography>
                  <Typography component="li" variant="body2">Support/Resistance: Common period SMAs (e.g., 50, 200) often act as support or resistance.</Typography>
                  <Typography component="li" variant="body2">Crossovers: When a shorter-period SMA crosses a longer-period SMA.</Typography>
                </Box>
              </Box>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Exponential Moving Average (EMA)
                </Typography>
                <Typography variant="body2" paragraph>
                  The EMA gives more weight to recent prices, making it more responsive to new information than the SMA.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Parameters:</strong>
                </Typography>
                <Box component="ul" sx={{ pl: 4 }}>
                  <Typography component="li" variant="body2">Period (n): The number of price bars to include in the calculation.</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  <strong>Common Uses:</strong>
                </Typography>
                <Box component="ul" sx={{ pl: 4 }}>
                  <Typography component="li" variant="body2">Short-term Trend Analysis: More responsive to recent price changes.</Typography>
                  <Typography component="li" variant="body2">Dynamic Support/Resistance: Acts as dynamic support in uptrends and resistance in downtrends.</Typography>
                  <Typography component="li" variant="body2">Crossover Strategies: EMA crossovers can generate trading signals (e.g., 9 EMA crossing above 21 EMA).</Typography>
                </Box>
              </Box>
              
              <Box sx={{ pl: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Weighted Moving Average (WMA)
                </Typography>
                <Typography variant="body2" paragraph>
                  The WMA assigns a weight to each price point, with recent prices receiving higher weights.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Parameters:</strong>
                </Typography>
                <Box component="ul" sx={{ pl: 4 }}>
                  <Typography component="li" variant="body2">Period (n): The number of price bars to include in the calculation.</Typography>
                </Box>
                <Typography variant="body2" paragraph>
                  <strong>Common Uses:</strong>
                </Typography>
                <Box component="ul" sx={{ pl: 4 }}>
                  <Typography component="li" variant="body2">Intermediate Responsiveness: More responsive than SMA but less than EMA.</Typography>
                  <Typography component="li" variant="body2">Trend Confirmation: Used to confirm trend direction identified by other indicators.</Typography>
                </Box>
              </Box>
              
              <Typography variant="body2" paragraph sx={{ mt: 2 }}>
                <strong>Example Strategy Using Moving Averages:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Condition:</strong> EMA(9) crosses above EMA(21) AND Price {'>'} EMA(50)
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Exit Condition:</strong> EMA(9) crosses below EMA(21) OR Price {'<'} EMA(50)
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Moving Average Convergence Divergence (MACD)
              </Typography>
              <Typography variant="body2" paragraph>
                MACD is a versatile trend-following momentum indicator that shows the relationship between two moving averages.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Components:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>MACD Line:</strong> The difference between two exponential moving averages (typically 12 and 26 periods).
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Signal Line:</strong> An EMA of the MACD Line (typically 9 periods).
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Histogram:</strong> The difference between the MACD Line and the Signal Line.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Parameters:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Fast Length:</strong> The period for the faster EMA (default: 12)
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Slow Length:</strong> The period for the slower EMA (default: 26)
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Signal Smoothing:</strong> The period for the signal line EMA (default: 9)
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Signals and Interpretation:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Crossovers:</strong> When the MACD Line crosses above the Signal Line, it's a bullish signal. 
                  When it crosses below, it's a bearish signal.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Zero Line Crossovers:</strong> When the MACD Line crosses above zero, it indicates a strengthening uptrend. 
                  Crossing below zero suggests a strengthening downtrend.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Divergence:</strong> When price makes a new high/low but MACD doesn't, it can signal a potential reversal.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Histogram Analysis:</strong> Increasing histogram values indicate strengthening momentum; 
                  decreasing values indicate weakening momentum.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Example Strategy Using MACD:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Condition:</strong> MACD Line crosses above Signal Line AND MACD Histogram increasing
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Exit Condition:</strong> MACD Line crosses below Signal Line OR MACD Histogram decreasing for 3 consecutive bars
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Parabolic SAR (Stop and Reverse)
              </Typography>
              <Typography variant="body2" paragraph>
                The Parabolic SAR is a trend-following indicator designed to identify potential reversals in price movement.
                It appears as a series of dots placed above or below price bars.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Parameters:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Step:</strong> The acceleration factor (default: 0.02)
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Maximum Step:</strong> The maximum acceleration factor (default: 0.2)
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Signals and Interpretation:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Dots Below Price:</strong> Indicates an uptrend; consider long positions.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Dots Above Price:</strong> Indicates a downtrend; consider short positions.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Dot Position Change:</strong> When dots flip from below to above price or vice versa, 
                  it signals a potential trend reversal.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Example Strategy Using Parabolic SAR:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Condition:</strong> Parabolic SAR moves from above price to below price AND EMA(50) is sloping upward
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Exit Condition:</strong> Parabolic SAR moves from below price to above price
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Best Practices:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  Works best in trending markets; may generate false signals in ranging markets.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Consider using alongside other trend confirmation indicators.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  The dots can serve as potential stop-loss levels.
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Average Directional Index (ADX)
              </Typography>
              <Typography variant="body2" paragraph>
                The ADX is a non-directional indicator that measures the strength of a trend, regardless of its direction.
                It ranges from 0 to 100, with higher values indicating stronger trends.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Components:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>ADX:</strong> The main line measuring trend strength
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>+DI (Plus Directional Indicator):</strong> Measures upward price movement strength
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>-DI (Minus Directional Indicator):</strong> Measures downward price movement strength
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Parameters:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Period:</strong> The number of bars used in the calculation (default: 14)
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Signals and Interpretation:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>ADX Value:</strong>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">0-25: Weak or no trend</Typography>
                    <Typography component="li" variant="body2">25-50: Strong trend</Typography>
                    <Typography component="li" variant="body2">50-75: Very strong trend</Typography>
                    <Typography component="li" variant="body2">75-100: Extremely strong trend</Typography>
                  </Box>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Directional Movement:</strong> When +DI is above -DI, the trend is up. When -DI is above +DI, the trend is down.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>DI Crossovers:</strong> When +DI crosses above -DI, it's a potential buy signal. 
                  When -DI crosses above +DI, it's a potential sell signal.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Example Strategy Using ADX:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Condition:</strong> ADX {'>'} 25 AND +DI crosses above -DI
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Exit Condition:</strong> ADX {'<'} 20 OR -DI crosses above +DI
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Best Practices:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  ADX can help filter trades in range-bound markets (avoid trend-following strategies when ADX {'<'} 25).
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Wait for confirmation of trend strength (ADX {'>'} 25) before entering trend-following positions.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Use ADX in conjunction with directional indicators for complete trend analysis.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Combining Trend Indicators
        </Typography>
        <Typography variant="body1" paragraph>
          For more robust trend analysis, consider using multiple trend indicators together:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Moving Average + MACD:</strong> Use moving averages to identify the overall trend direction and 
            MACD to time entries within that trend.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>ADX + Parabolic SAR:</strong> Use ADX to confirm trend strength and Parabolic SAR to identify 
            potential entry and exit points.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Multiple Timeframe Analysis:</strong> Confirm trends across different timeframes for more reliable signals.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Best Practices for Using Trend Indicators
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Confirm Trends with Multiple Indicators:</strong> Don't rely on a single indicator; use multiple 
            trend indicators to confirm signals.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Match Indicators to Market Conditions:</strong> Trend indicators work best in trending markets 
            and may generate false signals in ranging markets.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Adjust Parameters Based on Volatility:</strong> Consider using shorter periods for more volatile 
            instruments and longer periods for less volatile ones.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Use Proper Risk Management:</strong> Even the best trend indicators can generate false signals, 
            so always use appropriate stop-loss levels.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Consider Lagging Nature:</strong> Most trend indicators are lagging (they confirm trends after they've started). 
            Plan your strategy accordingly.
          </Typography>
        </Box>
      </Paper>
    </DocsLayout>
  );
}
