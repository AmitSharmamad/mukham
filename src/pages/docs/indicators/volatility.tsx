import { Box, Typography, Paper, Divider, Grid } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';

export default function VolatilityIndicators() {
  return (
    <DocsLayout>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Volatility Indicators
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          Volatility indicators measure the rate and magnitude of price changes, regardless of direction.
          These indicators help traders assess market risk, potential trading ranges, and optimal position sizing.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Understanding Volatility Analysis
        </Typography>
        <Typography variant="body1" paragraph>
          Volatility is a measure of the dispersion of returns for a given security or market index.
          Higher volatility implies higher risk but also potential for larger gains, while lower volatility suggests more stable price action.
        </Typography>
        <Typography variant="body1" paragraph>
          In सूत्रम्, volatility indicators can be used to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            Set appropriate stop-loss and take-profit levels
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Identify potential breakout opportunities
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Adjust position sizing based on current market risk
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Develop mean reversion or range-bound trading strategies
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Key Volatility Indicators
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Bollinger Bands
              </Typography>
              <Typography variant="body2" paragraph>
                Bollinger Bands consist of a middle band (simple moving average) and two outer bands that are standard deviations away from the middle band.
                They help identify periods of high and low volatility, potential overbought/oversold conditions, and price targets.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Components:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Middle Band:</strong> Simple Moving Average (SMA) of the price.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Upper Band:</strong> Middle Band + (Standard Deviation × Multiplier).
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Lower Band:</strong> Middle Band − (Standard Deviation × Multiplier).
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Parameters:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2">Period (n): The number of bars used for the SMA and standard deviation calculation (default: 20).</Typography>
                <Typography component="li" variant="body2">Standard Deviation Multiplier: The number of standard deviations for the outer bands (default: 2).</Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Signals and Interpretation:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Band Width:</strong> Widening bands indicate increasing volatility; narrowing bands indicate decreasing volatility.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Price Position:</strong> Price near the upper band may indicate overbought conditions; price near the lower band may indicate oversold conditions.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Band Squeeze:</strong> When bands contract significantly, it often precedes a strong price move (breakout).
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Mean Reversion:</strong> Price tends to return to the middle band during trending markets.
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Example Strategy Using Bollinger Bands:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Condition:</strong> Price touches lower band and starts moving upward AND RSI is below 30
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Exit Condition:</strong> Price reaches the middle band (for conservative target) or upper band (for aggressive target)
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Average True Range (ATR)
              </Typography>
              <Typography variant="body2" paragraph>
                The ATR measures market volatility by decomposing the entire range of an asset price for that period.
                It provides a moving average of the true range over a specified period, helping traders set appropriate stop-loss levels and identify potential breakout opportunities.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Calculation:</strong>
                <br />
                True Range (TR) = Maximum of:
                <br />
                - Current High - Current Low
                <br />
                - |Current High - Previous Close|
                <br />
                - |Current Low - Previous Close|
                <br />
                <br />
                ATR = Moving average of TR over n periods
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Parameters:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2">Period (n): The number of bars used in the calculation (default: 14).</Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Common Uses:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Stop-Loss Placement:</strong> Many traders set stops at a multiple of ATR (e.g., 2 × ATR) from their entry point.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Volatility Breakouts:</strong> A significant increase in ATR can signal a potential breakout.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Position Sizing:</strong> Adjust position size inversely to ATR (higher ATR = smaller position).
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Trend Strength:</strong> Increasing ATR during a trend suggests strengthening momentum.
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Example Strategy Using ATR:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Condition:</strong> Price breaks above previous day's high by at least 0.5 × ATR AND 10-day ATR is increasing
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Exit Condition:</strong> Price moves against the position by 2 × ATR from entry
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Keltner Channel
              </Typography>
              <Typography variant="body2" paragraph>
                Keltner Channels are volatility-based envelopes set above and below an exponential moving average (EMA).
                This indicator helps identify trend direction, provide overbought/oversold signals, and detect potential breakouts.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Components:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Middle Line:</strong> Exponential Moving Average (EMA) of the price.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Upper Channel Line:</strong> Middle Line + (ATR × Multiplier).
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Lower Channel Line:</strong> Middle Line − (ATR × Multiplier).
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Parameters:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2">EMA Period: The period for the middle line EMA (default: 20).</Typography>
                <Typography component="li" variant="body2">ATR Period: The period for the ATR calculation (default: 10).</Typography>
                <Typography component="li" variant="body2">Multiplier: The factor applied to the ATR (default: 2).</Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Signals and Interpretation:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Channel Width:</strong> Widening channels indicate increasing volatility; narrowing channels indicate decreasing volatility.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Price Position:</strong> Price near the upper channel may indicate overbought conditions; price near the lower channel may indicate oversold conditions.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Channel Breakouts:</strong> Price breaking out of the channel can signal a strong trend move.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Mean Reversion:</strong> Price tends to revert to the middle line during trending markets.
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Example Strategy Using Keltner Channel:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Condition:</strong> Price breaks above the upper channel AND volume is above 20-day average
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Exit Condition:</strong> Price crosses below the middle line OR price reaches a target of 1.5 times the channel width
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Combining Volatility Indicators
        </Typography>
        <Typography variant="body1" paragraph>
          Volatility indicators are most effective when combined with other technical analysis tools:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Bollinger Bands + RSI:</strong> Use Bollinger Bands to identify volatility and RSI to confirm overbought/oversold conditions.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>ATR + Moving Averages:</strong> Use ATR for stop placement and moving averages for trend direction.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Keltner Channels + Volume:</strong> Confirm channel breakouts with volume analysis.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Best Practices for Using Volatility Indicators
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Adapt to Market Conditions:</strong> Volatility varies across different market phases; adjust your strategies accordingly.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Consider Historical Context:</strong> Current volatility should be compared to historical volatility levels for the same instrument.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Be Aware of Volatility Cycles:</strong> Markets typically cycle between periods of high and low volatility.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Use for Risk Management:</strong> Volatility indicators are essential for position sizing and stop-loss placement.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Watch for Volatility Contraction:</strong> Periods of extremely low volatility often precede significant price moves.
          </Typography>
        </Box>
      </Paper>
    </DocsLayout>
  );
}
