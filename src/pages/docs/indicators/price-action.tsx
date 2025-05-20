import { Box, Typography, Paper, Divider, Grid } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';

export default function PriceActionIndicators() {
  return (
    <DocsLayout>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Price Action Indicators
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          Price action indicators focus directly on price movements without relying on mathematical formulas or derivatives.
          These indicators analyze raw price data, such as patterns, levels, and structures, to identify potential trading opportunities.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Understanding Price Action Analysis
        </Typography>
        <Typography variant="body1" paragraph>
          Price action analysis is based on the premise that all market information is reflected in price movement.
          By studying the market's price behavior directly, traders can identify patterns and make trading decisions 
          without the lag often associated with traditional indicators.
        </Typography>
        <Typography variant="body1" paragraph>
          In सूत्रम्, price action indicators can be used to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            Identify key support and resistance levels
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Detect trend reversals and continuations
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Determine optimal entry and exit points
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Confirm signals from other technical indicators
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Key Price Action Indicators
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Japanese Candlestick Patterns
              </Typography>
              <Typography variant="body2" paragraph>
                Japanese candlestick patterns are visual representations of price movements formed by the opening, high, low, and closing prices.
                These patterns can indicate potential reversals, continuations, or market indecision.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Key Reversal Patterns:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Doji:</strong> Indicates market indecision, with opening and closing prices nearly equal.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Hammer/Hanging Man:</strong> Single candlestick with a small body at the top and a long lower shadow; potential reversal signal.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Engulfing Pattern:</strong> Two-candle pattern where the second candle completely engulfs the body of the first; strong reversal signal.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Morning Star/Evening Star:</strong> Three-candle pattern indicating a potential reversal from a downtrend/uptrend.
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Continuation Patterns:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Rising/Falling Three Methods:</strong> Five-candle pattern indicating a brief consolidation within an existing trend.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Marubozu:</strong> Candlestick with no shadows, indicating strong buying or selling pressure.
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Example Strategy Using Candlestick Patterns:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Condition:</strong> Bullish Engulfing pattern forms at a key support level AND RSI is below 40
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Exit Condition:</strong> Price reaches the previous swing high OR forms a bearish reversal pattern
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Support and Resistance Levels
              </Typography>
              <Typography variant="body2" paragraph>
                Support and resistance levels are price areas where buying or selling pressure has historically been strong enough 
                to prevent the price from moving further in that direction.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Types of Support and Resistance:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Static Levels:</strong> Horizontal price levels that have historically acted as support or resistance.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Dynamic Levels:</strong> Moving levels such as trendlines or moving averages.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Psychological Levels:</strong> Round numbers that often act as support or resistance due to market psychology.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Fibonacci Levels:</strong> Retracement and extension levels based on the Fibonacci sequence.
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Key Concepts:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Level Strength:</strong> The more times a level is tested without breaking, the stronger it becomes.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Role Reversal:</strong> When broken, support often becomes resistance and vice versa.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Zones vs. Exact Levels:</strong> Support and resistance are better viewed as zones rather than exact prices.
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Example Strategy Using Support/Resistance:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Condition:</strong> Price bounces off a major support level with increased volume AND a bullish candlestick pattern forms
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Exit Condition:</strong> Price approaches the next resistance level OR breaks below the support level that triggered entry
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Chart Patterns
              </Typography>
              <Typography variant="body2" paragraph>
                Chart patterns are specific price formations that appear on charts and can help predict future price movements.
                These patterns form due to market psychology and the interplay between buyers and sellers.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Reversal Patterns:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Head and Shoulders:</strong> A bearish reversal pattern with three peaks, the middle one being the highest.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Inverse Head and Shoulders:</strong> A bullish reversal pattern with three troughs, the middle one being the lowest.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Double Top/Bottom:</strong> A reversal pattern with two peaks or troughs at approximately the same level.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Triple Top/Bottom:</strong> Similar to double top/bottom but with three peaks or troughs.
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Continuation Patterns:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Flags and Pennants:</strong> Short-term consolidation patterns that typically resolve in the direction of the preceding trend.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Triangles:</strong> Converging trendlines forming asymmetric (ascending/descending) or symmetric triangles.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Rectangles:</strong> Price oscillates between parallel support and resistance levels.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Cup and Handle:</strong> A bullish continuation pattern resembling a teacup with a handle on the right side.
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Example Strategy Using Chart Patterns:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Condition:</strong> Price breaks out of a bull flag pattern with volume increasing AND price is above the 50-day moving average
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Exit Condition:</strong> Price reaches the measured move target (flag pole height projected from breakout) OR price falls back below the breakout level
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Combining Price Action with Other Indicators
        </Typography>
        <Typography variant="body1" paragraph>
          Price action analysis is most effective when combined with other technical analysis approaches:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Price Action + Volume:</strong> Confirm price patterns with volume analysis for more reliable signals.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Price Action + Momentum:</strong> Use momentum indicators to confirm the strength of price movements.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Price Action + Moving Averages:</strong> Use moving averages to define the overall trend and price action for specific entry/exit points.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Best Practices for Using Price Action
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Focus on Higher Timeframes:</strong> Price action patterns on higher timeframes tend to be more reliable.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Consider Market Context:</strong> The same pattern may have different implications depending on the overall market environment.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Wait for Confirmation:</strong> Wait for confirmation of patterns rather than anticipating their completion.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Use Multiple Timeframes:</strong> Analyze price action across different timeframes for a more comprehensive view.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Practice Risk Management:</strong> Even the most reliable price action signals can fail, so always use appropriate stop-loss levels.
          </Typography>
        </Box>
      </Paper>
    </DocsLayout>
  );
}
