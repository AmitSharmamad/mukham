import { Box, Typography, Paper, Divider, Grid } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';

export default function EntryConditions() {
  return (
    <DocsLayout>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Entry Conditions
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          Entry conditions are the rules that determine when your trading strategy will open a position. 
          सूत्रम् (Sutram) provides a powerful Indicator Expression Builder to help you create precise and 
          flexible entry conditions based on technical indicators and price action.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Understanding Entry Conditions
        </Typography>
        <Typography variant="body1" paragraph>
          Entry conditions serve as triggers for your trading strategy. When market conditions match your defined 
          entry criteria, the strategy generates a signal to open a position. Well-designed entry conditions are 
          crucial for identifying favorable trading opportunities and filtering out potential false signals.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Using the Indicator Expression Builder
        </Typography>
        <Typography variant="body1" paragraph>
          The Indicator Expression Builder is a visual tool that lets you create complex condition statements 
          without coding. Here's how to use it effectively:
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Basic Condition Structure
              </Typography>
              <Typography variant="body2" paragraph>
                Each condition has three components:
              </Typography>
              <Box component="ol" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Left Operand:</strong> Typically an indicator (e.g., RSI, Moving Average) or price value.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Operator:</strong> A comparison or relationship (e.g., crosses above, is greater than, equals).
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Right Operand:</strong> Another indicator, a specific value, or another market parameter.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Example:</strong> "RSI(14) crosses below 30"
                <br />
                Left Operand: RSI(14) | Operator: crosses below | Right Operand: 30
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Combining Multiple Conditions
              </Typography>
              <Typography variant="body2" paragraph>
                You can create more sophisticated entry rules by combining multiple conditions using logical operators:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>AND:</strong> Both conditions must be true for the entry signal to trigger.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>OR:</strong> Either condition being true will trigger the entry signal.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Example:</strong> "RSI(14) crosses below 30 AND MACD Line crosses above Signal Line"
                <br />
                This condition will only trigger when both the RSI is oversold AND the MACD shows a bullish crossover.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Grouping Conditions
              </Typography>
              <Typography variant="body2" paragraph>
                You can use parentheses to group conditions and control the order of evaluation:
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Example:</strong> &quot;(RSI(14) {`<`} 30 OR Stochastic(14,3) {`<`} 20) AND Price {`>`} EMA(50)&quot;
                <br />
                This will trigger when either RSI OR Stochastic shows oversold conditions, but only if the price is also above the 50-period EMA.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Common Entry Condition Patterns
        </Typography>
        <Typography variant="body1" paragraph>
          Here are some frequently used entry condition patterns that you can implement in your strategies:
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Trend Following Entries
              </Typography>
              <Typography variant="body2" paragraph>
                These conditions aim to enter positions in the direction of the prevailing trend:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  &quot;Price crosses above EMA(200)&quot; - Enter long when price moves above the long-term trend.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  &quot;EMA(8) crosses above EMA(21)&quot; - Enter long on a bullish moving average crossover.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  &quot;MACD Line crosses above Signal Line AND MACD {`>`} 0&quot; - Enter long on bullish MACD crossover above zero.
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Mean Reversion Entries
              </Typography>
              <Typography variant="body2" paragraph>
                These conditions look for potential reversals after price moves too far from its average:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  &quot;RSI(14) crosses below 30&quot; - Enter long when the market is potentially oversold.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  &quot;Price {`<`} Bollinger Lower Band(20,2)&quot; - Enter long when price touches the lower Bollinger Band.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  &quot;Stochastic(14,3) crosses above 20 AND Stochastic(14,3) {`<`} 50&quot; - Enter long on initial oversold recovery.
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Breakout Entries
              </Typography>
              <Typography variant="body2" paragraph>
                These conditions identify breakouts from established ranges or patterns:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  &quot;Price crosses above Highest(Price, 20)&quot; - Enter long on breakout of 20-day high.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  &quot;ATR(14) {`>`} 1.5 * Average(ATR(14), 10) AND Volume {`>`} 1.5 * Average(Volume, 20)&quot; - Enter on volatility expansion.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  &quot;Price crosses above Upper Bollinger Band(20,2)&quot; - Enter long on upper band breakout.
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Confirmation-Based Entries
              </Typography>
              <Typography variant="body2" paragraph>
                These conditions use multiple indicators to confirm signals and filter out false positives:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  &quot;MACD Line crosses above Signal Line AND RSI(14) {`>`} 50 AND Price {`>`} EMA(50)&quot; - Multiple confirmations for uptrend.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  &quot;Stochastic(14,3) crosses above 20 AND Volume {`>`} Average(Volume, 20) AND Price {`>`} VWAP&quot; - Volume-confirmed bounce.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  &quot;Price crosses above EMA(8) AND EMA(8) {`>`} EMA(21) AND EMA(21) {`>`} EMA(50)&quot; - Confirmed uptrend alignment.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Best Practices for Entry Conditions
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Be Specific:</strong> Create conditions that clearly define your entry criteria to avoid ambiguity.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Consider Market Context:</strong> Different entry conditions work better in different market environments 
            (trending vs. ranging markets).
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Use Complementary Indicators:</strong> Combine indicators that provide different types of information 
            (e.g., trend, momentum, volatility) rather than using multiple indicators that tell you the same thing.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Avoid Over-Complexity:</strong> While it's tempting to add many conditions, overly complex entries 
            can lead to curve-fitting and poor performance in live trading.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Test Thoroughly:</strong> Backtest your entry conditions across different market conditions to 
            ensure they perform consistently.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Balance Sensitivity:</strong> More sensitive entry conditions may catch more opportunities but also 
            generate more false signals. Find the right balance for your trading style.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Tips for Optimizing Entry Conditions
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Start with a Clear Hypothesis:</strong> Have a clear market hypothesis before creating entry conditions.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Consider Time Filters:</strong> Certain times of the day might be more favorable for entries. 
            You can use time conditions to focus on the most profitable trading windows.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Add Volume Conditions:</strong> Including volume criteria can help confirm the strength of signals.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Review Trade History:</strong> Regularly review the historical trades triggered by your entry conditions 
            to identify patterns in successful versus unsuccessful entries.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Align with Exit Strategy:</strong> Ensure your entry conditions work well with your exit strategy to 
            create a cohesive trading approach.
          </Typography>
        </Box>
      </Paper>
    </DocsLayout>
  );
}
