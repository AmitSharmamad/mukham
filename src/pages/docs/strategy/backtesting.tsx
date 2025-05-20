import { Box, Typography, Paper, Divider, Grid } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';

export default function Backtesting() {
  return (
    <DocsLayout>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Backtesting Your Strategy
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          Backtesting is the process of testing a trading strategy against historical data to evaluate its performance. 
          सूत्रम् (Sutram) provides a comprehensive backtesting system that allows you to simulate how your 
          strategy would have performed in past market conditions.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Why Backtest?
        </Typography>
        <Typography variant="body1" paragraph>
          Backtesting serves several critical purposes in trading strategy development:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Validate Strategy Efficacy:</strong> Determine whether your strategy has potential for profitability.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Quantify Performance:</strong> Measure key metrics like returns, drawdowns, and win rate.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Optimize Parameters:</strong> Test different parameter values to find optimal settings.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Understand Risk:</strong> Assess the risk profile of your strategy, including maximum drawdown 
            and volatility of returns.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Build Confidence:</strong> Gain confidence in your strategy before deploying real capital.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Configuring Backtest Parameters
        </Typography>
        <Typography variant="body1" paragraph>
          In सूत्रम्, you can configure the following parameters for your backtest:
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Capital and Position Sizing
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Initial Capital:</strong> The starting amount of capital for the backtest (e.g., ₹100,000).
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Max Allocation:</strong> The maximum percentage of capital to allocate to a single position.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Max Quantity:</strong> The maximum number of shares/contracts to trade in a single position.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Recommendation:</strong> Start with a realistic initial capital amount. Position sizing is critical 
                for risk management, so set your Max Allocation based on your risk tolerance (typically 2-10% of capital per trade).
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Time Period
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Start Date:</strong> The beginning date for the backtest period.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>End Date:</strong> The ending date for the backtest period.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Start Time:</strong> The earliest time of day to enter trades.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry End Time:</strong> The latest time of day to enter trades.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Recommendation:</strong> Test your strategy across a period that includes different market conditions 
                (bull markets, bear markets, sideways markets). A minimum of 1-2 years of data is recommended, with 3-5 years 
                being ideal for most strategies.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Running the Backtest
        </Typography>
        <Typography variant="body1" paragraph>
          After configuring your strategy and backtest parameters:
        </Typography>
        <Box component="ol" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            Review all strategy settings to ensure they are configured correctly.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Click the "Run Backtest" button at the bottom of the Strategy Builder.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            सूत्रम् will process the backtest, which may take a few moments depending on the complexity 
            of your strategy and the amount of historical data being analyzed.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Once complete, the system will display the backtest results for your analysis.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Interpreting Backtest Results
        </Typography>
        <Typography variant="body1" paragraph>
          सूत्रम् provides comprehensive performance metrics to help you evaluate your strategy:
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Return Metrics
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Total Return:</strong> The overall percentage return of the strategy.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Annualized Return:</strong> The return normalized to an annual rate.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Monthly Returns:</strong> Breakdown of returns by month.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Return vs. Benchmark:</strong> Comparison to a market benchmark.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>What to Look For:</strong> Consistent positive returns across different time periods, 
                outperformance of relevant benchmarks.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Risk Metrics
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Maximum Drawdown:</strong> The largest peak-to-trough decline in account value.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Volatility:</strong> The standard deviation of returns, measuring the strategy's consistency.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Sharpe Ratio:</strong> Risk-adjusted return (higher is better).
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Sortino Ratio:</strong> Similar to Sharpe, but only considers downside volatility.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>What to Look For:</strong> Low maximum drawdown (ideally less than 15-20%), Sharpe ratio above 1.0, 
                and manageable volatility that aligns with your risk tolerance.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Trade Statistics
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Total Trades:</strong> Number of trades executed.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Win Rate:</strong> Percentage of profitable trades.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Average Profit/Loss:</strong> The mean profit or loss per trade.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Profit Factor:</strong> Gross profit divided by gross loss (higher is better).
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Average Trade Duration:</strong> The mean holding period for positions.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>What to Look For:</strong> Win rate above 40%, profit factor above 1.5, and average profit 
                per winning trade greater than average loss per losing trade.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Equity Curve and Visualizations
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Equity Curve:</strong> Chart showing the growth of account value over time.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Drawdown Chart:</strong> Visual representation of drawdowns during the backtest period.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Trade Distribution:</strong> Analysis of winning and losing trades by time, size, or duration.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>What to Look For:</strong> A steadily rising equity curve without large drops, short 
                recovery periods after drawdowns, and consistent performance across different market conditions.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Trade List and Analysis
        </Typography>
        <Typography variant="body1" paragraph>
          सूत्रम् provides a detailed list of all trades executed during the backtest, allowing you to analyze 
          individual trade performance:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Entry and Exit Dates/Times:</strong> When each position was opened and closed.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Entry and Exit Prices:</strong> The prices at which trades were executed.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Position Size:</strong> The quantity traded and capital allocated.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>P&L:</strong> The profit or loss for each trade, in both absolute terms and percentage.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Exit Reason:</strong> What triggered the exit (e.g., indicator signal, stop loss, target profit).
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Best Practices for Backtesting
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Avoid Curve Fitting:</strong> Don't over-optimize your strategy to perform perfectly on historical data. 
            This often leads to poor performance in live trading.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Test Across Different Market Conditions:</strong> Ensure your strategy works in bull markets, 
            bear markets, and sideways markets.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Consider Transaction Costs:</strong> Include realistic estimates for commissions, slippage, 
            and other trading costs.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Use Out-of-Sample Testing:</strong> Optimize your strategy on one set of data, then validate it 
            on a different time period not used during optimization.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Start with Simple Strategies:</strong> Begin with straightforward strategies before adding complexity. 
            Complex strategies are more prone to curve fitting and may not generalize well to future market conditions.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Consider Realistic Constraints:</strong> Account for factors like liquidity, trading hours, 
            and market availability.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          From Backtesting to Live Trading
        </Typography>
        <Typography variant="body1" paragraph>
          While backtesting is a crucial step in strategy development, it's important to recognize its limitations:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Past Performance ≠ Future Results:</strong> Market conditions evolve, and strategies that worked 
            in the past may not work in the future.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Start Small:</strong> When transitioning to live trading, begin with smaller position sizes 
            to validate that your strategy performs as expected in real market conditions.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Monitor and Adjust:</strong> Continuously monitor your strategy's performance and be prepared 
            to make adjustments if market conditions change significantly.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Paper Trading:</strong> Consider paper trading (simulated trading with real market data but no real money) 
            as an intermediate step between backtesting and live trading.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Journal and Learn:</strong> Keep a trading journal to document your strategy's performance, 
            any adjustments made, and lessons learned.
          </Typography>
        </Box>
      </Paper>
    </DocsLayout>
  );
}
