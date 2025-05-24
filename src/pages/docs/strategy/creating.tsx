import { Box, Typography, Paper, Divider, Grid } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';
import Image from 'next/image';

export default function CreatingStrategy() {
  return (
    <DocsLayout>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Creating a Strategy
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          This guide walks you through the process of creating a trading strategy in सूत्रम् (Sutram) using the 
          Strategy Builder. The Strategy Builder provides a user-friendly interface to define your trading logic 
          without writing code.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Accessing the Strategy Builder
        </Typography>
        <Typography variant="body1" paragraph>
          To create a new strategy:
        </Typography>
        <Box component="ol" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            Navigate to the <strong>Strategy</strong> page from the main navigation bar.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Click the <strong>Create Strategy</strong> button. This will take you to the Strategy Builder page.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Strategy Builder Interface
        </Typography>
        <Typography variant="body1" paragraph>
          The Strategy Builder is organized into several sections that guide you through the strategy creation process:
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                1. Name Section
              </Typography>
              <Typography variant="body2" paragraph>
                In this section, you'll provide basic information about your strategy:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Name:</strong> A unique, descriptive name for your strategy (e.g., "EMA Crossover Strategy").
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Description:</strong> A detailed explanation of your strategy's logic, objectives, and any 
                  special considerations. This helps you remember the strategy's purpose later.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Best Practice:</strong> Use clear, descriptive names that indicate the strategy's core logic 
                or indicators used (e.g., "RSI Oversold Bounce Strategy" or "MACD Trend Following").
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                2. Positions Section
              </Typography>
              <Typography variant="body2" paragraph>
                This section defines what and how you'll trade:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Buy/Sell:</strong> Select whether your strategy will take long positions (Buy) or short positions (Sell).
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Instruments:</strong> Click the "Add" button to select financial instruments for your strategy. 
                  You can add multiple instruments for a diversified approach.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Chart Settings:</strong> 
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">Candlestick Type: Select the chart type (e.g., Candlestick).</Typography>
                    <Typography component="li" variant="body2">Timeframe: Choose the time interval for analysis (e.g., 5 Minutes, 1 Hour).</Typography>
                    <Typography component="li" variant="body2">Trade Type: Select MIS for intraday or CNC/NRML for longer-term positions.</Typography>
                  </Box>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Quantity:</strong> Define position sizing parameters:
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">Max Allocation: Maximum percentage of capital to allocate.</Typography>
                    <Typography component="li" variant="body2">Max Quantity: Maximum number of shares/contracts to trade.</Typography>
                  </Box>
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Best Practice:</strong> Start with a single instrument until you're comfortable with the strategy's 
                performance. Choose a timeframe that aligns with your trading style (e.g., shorter timeframes for day trading, 
                longer for swing trading).
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                3. Entry Condition Section
              </Typography>
              <Typography variant="body2" paragraph>
                This is where you define when your strategy will enter trades:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Indicator Expression Builder:</strong> Use this tool to create entry conditions based on technical 
                  indicators. You can combine multiple conditions using logical operators (AND, OR).
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Example Entry Conditions:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  "RSI(14) crosses below 30" - Enter when RSI indicates oversold conditions.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  "EMA(9) crosses above EMA(21)" - Enter when shorter-term EMA crosses above longer-term EMA.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  "MACD Line crosses above Signal Line AND RSI(14) {'>'} 50" - Enter when MACD gives a bullish signal and RSI confirms upward momentum.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Best Practice:</strong> Start with simple, clear conditions before adding complexity. Consider using 
                multiple indicators that confirm each other rather than redundant indicators.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                4. Exit Condition Section
              </Typography>
              <Typography variant="body2" paragraph>
                Define when your strategy will exit trades:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Indicator Expression Builder:</strong> Similar to entry conditions, create exit conditions 
                  based on technical indicators.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Stop Loss:</strong> Set a percentage or price level at which the strategy will exit to limit losses.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Target Profit %:</strong> Set a profit percentage at which the strategy will take profits.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Trailing Stop Loss (Optional):</strong> A dynamic stop loss that adjusts as the price moves in your favor.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Example Exit Conditions:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  "RSI(14) crosses above 70" - Exit when RSI indicates overbought conditions.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  "Price crosses below EMA(50)" - Exit when price drops below the 50-period EMA.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Best Practice:</strong> Always include a stop loss to manage risk. Consider a risk-reward ratio 
                of at least 1:2 (potential reward at least twice the risk).
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                5. Backtest Parameters Section
              </Typography>
              <Typography variant="body2" paragraph>
                Configure settings for backtesting your strategy:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Initial Capital:</strong> The starting capital for the backtest.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Start Time:</strong> The earliest time of day to enter trades.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry End Time:</strong> The latest time of day to enter trades.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Start Date:</strong> The beginning date for the backtest period.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>End Date:</strong> The ending date for the backtest period.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Best Practice:</strong> Test your strategy over different market conditions (bull markets, bear markets, 
                sideways markets) to understand its performance characteristics. Use a sufficiently long backtest period to 
                capture various market cycles.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Saving and Running Your Strategy
        </Typography>
        <Typography variant="body1" paragraph>
          After defining all the components of your strategy, you can:
        </Typography>
        <Box component="ol" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Save Strategy:</strong> Click the "Save Strategy" button to store your strategy for future use.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Run Backtest:</strong> Click the "Run Backtest" button to test your strategy against historical data 
            using the parameters you've set.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>View Results:</strong> After the backtest completes, review the performance metrics and trade history 
            to evaluate the effectiveness of your strategy.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Optimize:</strong> Based on the backtest results, adjust your strategy parameters to improve performance.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Deploy (Optional):</strong> When satisfied with the backtest results, deploy your strategy for live trading.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Tips for Creating Successful Strategies
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Start Simple:</strong> Begin with straightforward strategies before adding complexity.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Manage Risk:</strong> Always include appropriate stop-loss levels and position sizing.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Avoid Curve Fitting:</strong> Ensure your strategy works across different market conditions, not just specific periods.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Consider Trading Costs:</strong> Account for commissions, slippage, and other costs in your backtests.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Iterate and Improve:</strong> Continuously refine your strategies based on performance data.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Diversify:</strong> Consider running multiple uncorrelated strategies to spread risk.
          </Typography>
        </Box>
      </Paper>
    </DocsLayout>
  );
}
