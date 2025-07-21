import { Box, Typography, Grid } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';
import { DocContent } from '../../../components';

export default function ExitConditions() {
  return (
    <DocsLayout>
      <DocContent
        title="Exit Conditions"
        subtitle="Define when and how your trading strategy will close positions. Set up stop losses, take profits, and trailing stops."
        tags={["Exit Conditions","Stop Loss","Take Profit","Risk Management"]}
      >
        
        <Typography variant="body1" paragraph>
          Exit conditions determine when your strategy will close an open position. In सूत्रम् (Sutram), you can 
          define sophisticated exit rules using the Indicator Expression Builder, similar to entry conditions, 
          along with risk management parameters like stop loss and take profit levels.
        </Typography>

        <Typography variant="h5" gutterBottom >
          Importance of Exit Conditions
        </Typography>
        <Typography variant="body1" paragraph>
          While entry conditions receive most of the attention in strategy development, exit conditions often 
          have a greater impact on overall profitability. Well-designed exit conditions allow you to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            Lock in profits when market conditions favor your position
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Limit losses when the market moves against you
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Optimize the duration of trades to improve capital efficiency
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Adapt to changing market conditions
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom >
          Types of Exit Conditions in सूत्रम्
        </Typography>
        <Typography variant="body1" paragraph>
          सूत्रम् supports several types of exit mechanisms that you can combine for a comprehensive exit strategy:
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                1. Indicator-Based Exits
              </Typography>
              <Typography variant="body2" paragraph>
                Similar to entry conditions, you can use the Indicator Expression Builder to create rules for exiting positions 
                based on technical indicators, price action, or market conditions.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Examples:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  "RSI(14) crosses above 70" - Exit a long position when the market becomes overbought.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  "EMA(9) crosses below EMA(21)" - Exit a long position on a bearish moving average crossover.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  "MACD Line crosses below Signal Line" - Exit a long position on a bearish MACD signal.
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                2. Stop Loss
              </Typography>
              <Typography variant="body2" paragraph>
                A stop loss is a predefined level at which your strategy will exit a position to limit losses. 
                सूत्रम् allows you to set stop losses as a percentage of your entry price.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Configuration:</strong> Enter a percentage value in the "Stop Loss" field. For example, 
                a 2% stop loss on a long position would exit if the price falls 2% below your entry price.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Best Practice:</strong> Stop losses are essential for risk management. The appropriate stop loss 
                percentage depends on your trading style, the instrument's volatility, and your risk tolerance. 
                Common ranges are 1-3% for day trading and 5-15% for swing trading.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                3. Target Profit
              </Typography>
              <Typography variant="body2" paragraph>
                The target profit (or take profit) is a predefined level at which your strategy will exit a position 
                to secure profits. सूत्रम् allows you to set profit targets as a percentage of your entry price.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Configuration:</strong> Enter a percentage value in the "Target Profit %" field. For example, 
                a 5% target profit on a long position would exit when the price rises 5% above your entry price.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Best Practice:</strong> Your target profit should typically be larger than your stop loss, 
                creating a favorable risk-reward ratio. A common guideline is to aim for at least a 1:2 risk-reward 
                ratio (e.g., 2% stop loss with a 4% or greater target profit).
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                4. Trailing Stop Loss
              </Typography>
              <Typography variant="body2" paragraph>
                A trailing stop loss is a dynamic stop loss that adjusts as the price moves in your favor, allowing you 
                to protect profits while still giving the trade room to grow. This is an optional but powerful feature in सूत्रम्.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Configuration:</strong> Enter a percentage value in the "Trailing Stop Loss" field. This represents 
                how far the stop loss will trail behind the highest price reached (for long positions) or the lowest price 
                reached (for short positions) after entry.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Example:</strong> If you set a 3% trailing stop loss on a long position, and the price rises 10% 
                from your entry, your stop loss would be placed 3% below that peak price. If the price then falls 3% from 
                that peak, your position would be closed, securing a 7% profit.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Best Practice:</strong> Trailing stops are particularly useful in trending markets. The percentage 
                should be large enough to accommodate normal market fluctuations but tight enough to protect a significant 
                portion of your profits.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom >
          Exit Condition Patterns and Strategies
        </Typography>
        <Typography variant="body1" paragraph>
          Here are some effective exit strategies that combine different types of exit conditions:
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Trend Following Exit Strategy
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Primary Exit:</strong> EMA(9) crosses below EMA(21) - Exit when the short-term trend changes
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Stop Loss:</strong> 2% - Tight stop to minimize losses on false breakouts
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Trailing Stop:</strong> 3% - To capture profits in a strong trend while protecting against reversals
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                This approach aims to stay in trends as long as they continue while protecting capital with a tight initial stop and trailing stop to secure profits.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Mean Reversion Exit Strategy
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Primary Exit:</strong> RSI(14) crosses above 65 - Exit as the market approaches overbought conditions
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Target Profit:</strong> 3% - Take profits at a predefined level
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Stop Loss:</strong> 1.5% - Tight stop because mean reversion trades should work quickly
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                This strategy is designed for range-bound markets, taking advantage of price moves from extremes back toward the mean.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Breakout Exit Strategy
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Primary Exit:</strong> Price crosses below VWAP AND Volume {'<'} Average(Volume, 20) - Exit when momentum fades
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Target Profit:</strong> 5% - Larger target for capturing strong breakout moves
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Stop Loss:</strong> 2% - Placed just below the breakout level
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                This strategy capitalizes on strong breakout moves while exiting quickly if the breakout fails.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Time-Based Exit Strategy
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Primary Exit:</strong> Bar Close at 3:15 PM - Exit all positions before market close
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Stop Loss:</strong> 1.5% - Standard protection against adverse moves
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Target Profit:</strong> 3% - Take profits if reached during the session
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                This strategy is suitable for day traders who don't want to hold positions overnight.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom >
          Best Practices for Exit Conditions
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Always Use Stop Losses:</strong> Never trade without some form of stop loss protection.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Consider Multi-Part Exits:</strong> Exiting a position in parts (e.g., 50% at target 1, 50% at target 2) 
            can help balance between securing profits and capturing larger moves.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Match Exit to Entry Logic:</strong> Your exit strategy should complement your entry strategy. For example, 
            if you enter based on oversold RSI, consider exiting when RSI reaches overbought levels.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Account for Volatility:</strong> More volatile markets require wider stops and targets to accommodate 
            price swings while still allowing your trade thesis to play out.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Review and Optimize:</strong> Regularly analyze your trade history to identify patterns in your exits. 
            Are you exiting too early and leaving money on the table? Or holding too long and giving back profits?
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Consider Market Context:</strong> Different market conditions may require different exit strategies. 
            What works in a trending market might not work in a ranging market.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom >
          Common Exit Mistakes to Avoid
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Moving Stop Losses Further Away:</strong> This increases your risk exposure and violates your initial risk assessment.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Exiting Too Early:</strong> Taking profits too quickly can limit your overall profitability. 
            Consider using trailing stops to let winners run.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Setting Arbitrary Targets:</strong> Profit targets should be based on market analysis, not arbitrary percentages.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Ignoring Technical Signals:</strong> If your strategy is based on technical indicators, be consistent in 
            following their signals for both entries and exits.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Emotional Decision-Making:</strong> Stick to your predefined exit rules rather than making emotional decisions in the heat of trading.
          </Typography>
        </Box>
      </DocContent>
    </DocsLayout>
  );
}
