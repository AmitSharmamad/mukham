import { Box, Typography, Paper, Divider, Grid } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';

export default function MomentumIndicators() {
  return (
    <DocsLayout>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Momentum Indicators
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          Momentum indicators measure the rate of price change over time, helping traders identify the strength or weakness of a trend.
          These indicators are valuable for timing entries and exits and for detecting potential reversals in market trends.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Understanding Momentum Analysis
        </Typography>
        <Typography variant="body1" paragraph>
          Momentum precedes price, meaning that momentum indicators often signal potential reversals or continuations before they become visible in price action.
          A strong trend is typically accompanied by strong momentum, while weakening momentum can signal a potential trend reversal or consolidation.
        </Typography>
        <Typography variant="body1" paragraph>
          In सूत्रम्, momentum indicators can be used to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            Confirm the strength of existing trends
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Identify overbought or oversold conditions
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Detect divergences between price and momentum (potential reversal signals)
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Generate entry and exit signals
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Key Momentum Indicators
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Relative Strength Index (RSI)
              </Typography>
              <Typography variant="body2" paragraph>
                RSI is a momentum oscillator that measures the speed and change of price movements on a scale from 0 to 100.
                It helps identify overbought and oversold conditions, as well as potential trend reversals.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Formula:</strong> RSI = 100 - [100 / (1 + RS)]
                <br />
                where RS = Average Gain / Average Loss over a specified period
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Parameters:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2">Period (n): The number of bars used in the calculation (default: 14).</Typography>
                <Typography component="li" variant="body2">Overbought Level: The threshold above which an asset is considered overbought (default: 70).</Typography>
                <Typography component="li" variant="body2">Oversold Level: The threshold below which an asset is considered oversold (default: 30).</Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Common Uses:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2">
                  <strong>Overbought/Oversold Conditions:</strong> RSI {'>'} 70 suggests overbought conditions (potential sell), 
                  while RSI {'<'} 30 suggests oversold conditions (potential buy).
                </Typography>
                <Typography component="li" variant="body2">
                  <strong>Divergence:</strong> When price makes a new high/low but RSI doesn't, it can signal a potential reversal.
                </Typography>
                <Typography component="li" variant="body2">
                  <strong>Centerline Crossovers:</strong> RSI crossing above 50 may indicate bullish momentum, while crossing below 50 may indicate bearish momentum.
                </Typography>
                <Typography component="li" variant="body2">
                  <strong>Failure Swings:</strong> When RSI doesn't reach overbought/oversold levels during subsequent price highs/lows.
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Example Strategy Using RSI:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Condition:</strong> RSI crosses above 30 from oversold territory AND price is above 50-period EMA
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Exit Condition:</strong> RSI crosses above 70 OR RSI crosses below 40
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Stochastic Oscillator
              </Typography>
              <Typography variant="body2" paragraph>
                The Stochastic Oscillator compares a security's closing price to its price range over a specific period.
                It consists of two lines: %K (the fast stochastic) and %D (the slow stochastic).
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Parameters:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2">%K Period: The period used for %K calculation (default: 14).</Typography>
                <Typography component="li" variant="body2">%K Slowing: The number of periods to slow %K (default: 1 for Fast Stochastic, 3 for Slow Stochastic).</Typography>
                <Typography component="li" variant="body2">%D Period: The period used for the moving average of %K (default: 3).</Typography>
                <Typography component="li" variant="body2">Overbought Level: The threshold above which an asset is considered overbought (default: 80).</Typography>
                <Typography component="li" variant="body2">Oversold Level: The threshold below which an asset is considered oversold (default: 20).</Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Signals and Interpretation:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Overbought/Oversold Conditions:</strong> Values above 80 indicate overbought conditions, while values below 20 indicate oversold conditions.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Crossovers:</strong> When %K crosses above %D, it's a potential buy signal. When %K crosses below %D, it's a potential sell signal.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Divergence:</strong> When price makes a new high/low but the Stochastic doesn't, it can signal a potential reversal.
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Example Strategy Using Stochastic Oscillator:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Condition:</strong> %K crosses above %D while both are below 20 AND market is in an uptrend (price above 200-period SMA)
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Exit Condition:</strong> %K crosses below %D while both are above 80 OR price crosses below 50-period SMA
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Commodity Channel Index (CCI)
              </Typography>
              <Typography variant="body2" paragraph>
                The CCI measures a security's current price level relative to an average price level over a given period.
                It can identify cyclical trends in commodities and other assets, as well as overbought and oversold conditions.
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Parameters:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2">Period (n): The number of bars used in the calculation (default: 20).</Typography>
                <Typography component="li" variant="body2">Constant: The factor applied to the mean deviation (default: 0.015).</Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Signals and Interpretation:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Overbought/Oversold Conditions:</strong> CCI values above +100 indicate overbought conditions, while values below -100 indicate oversold conditions.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Zero Line Crossovers:</strong> When CCI crosses above zero, it suggests bullish momentum. When it crosses below zero, it suggests bearish momentum.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Divergence:</strong> When price makes a new high/low but CCI doesn't, it can signal a potential reversal.
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                <strong>Example Strategy Using CCI:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Condition:</strong> CCI crosses above -100 from below AND price is above 50-period EMA
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Exit Condition:</strong> CCI crosses above +100 AND starts to decline OR CCI crosses below 0
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Combining Momentum Indicators
        </Typography>
        <Typography variant="body1" paragraph>
          For more robust momentum analysis, consider using momentum indicators with other indicator types:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>RSI + Moving Averages:</strong> Use moving averages to determine the trend direction and RSI to time entries within that trend.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Stochastic + MACD:</strong> Use Stochastic for overbought/oversold conditions and MACD for trend confirmation.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>CCI + Volume Indicators:</strong> Confirm momentum signals with volume analysis for more reliable signals.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Best Practices for Using Momentum Indicators
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Consider Market Context:</strong> Momentum indicators work differently in trending vs. ranging markets.
            In strong trends, overbought/oversold signals may be less reliable.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Look for Divergences:</strong> Divergences between price and momentum indicators often provide the 
            strongest signals of potential reversals.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Use Multiple Timeframes:</strong> Confirm momentum signals across different timeframes for more reliable signals.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Adjust Parameters:</strong> Consider changing default parameters based on the volatility of the instrument
            and your trading timeframe.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Combine with Trend Analysis:</strong> Use momentum indicators within the context of the overall market trend
            to avoid fighting against the prevailing direction.
          </Typography>
        </Box>
      </Paper>
    </DocsLayout>
  );
}
