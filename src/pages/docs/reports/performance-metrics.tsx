import { Box, Typography, Paper, Divider, Grid } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';

export default function PerformanceMetrics() {
  return (
    <DocsLayout>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Performance Metrics
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          Performance metrics in सूत्रम् (Sutram) provide comprehensive insights into trading strategy effectiveness.
          These metrics help you evaluate strategy performance, compare different approaches, and make data-driven
          improvements to your trading systems.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Understanding Performance Analysis
        </Typography>
        <Typography variant="body1" paragraph>
          Evaluating trading performance involves analyzing multiple dimensions beyond simple profit and loss.
          A truly robust strategy assessment considers risk-adjusted returns, consistency, drawdowns, and various 
          efficiency metrics to provide a complete picture of strategy quality.
        </Typography>
        <Typography variant="body1" paragraph>
          Performance metrics in सूत्रम् can help you:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            Compare different trading strategies objectively
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Identify strengths and weaknesses in your trading approach
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Optimize strategy parameters for better results
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Monitor strategy performance over time
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Key Performance Metrics
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Return Metrics
              </Typography>
              <Typography variant="body2" paragraph>
                Return metrics measure the profitability of your trading strategy over various time periods.
              </Typography>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Total Return
                </Typography>
                <Typography variant="body2" paragraph>
                  The overall percentage gain or loss for the trading period.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Formula:</strong> (Final Capital - Initial Capital) / Initial Capital × 100%
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Interpretation:</strong> Higher is better, but should be considered alongside risk metrics.
                </Typography>
              </Box>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Annualized Return
                </Typography>
                <Typography variant="body2" paragraph>
                  The return normalized to a one-year period, allowing comparison of strategies tested over different timeframes.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Formula:</strong> (1 + Total Return)^(365/Days) - 1
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Interpretation:</strong> Standardizes returns to an annual basis; useful for comparing strategies with different durations.
                </Typography>
              </Box>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Average Trade Return
                </Typography>
                <Typography variant="body2" paragraph>
                  The average profit or loss per trade, expressed as a percentage.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Formula:</strong> Sum of All Trade Returns / Number of Trades
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Interpretation:</strong> Positive values indicate profitable strategies on average; should be viewed alongside win rate.
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Risk Metrics
              </Typography>
              <Typography variant="body2" paragraph>
                Risk metrics measure the volatility and downside exposure of your trading strategy.
              </Typography>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Maximum Drawdown
                </Typography>
                <Typography variant="body2" paragraph>
                  The largest peak-to-trough decline in portfolio value during the backtest period.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Formula:</strong> (Trough Value - Peak Value) / Peak Value × 100%
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Interpretation:</strong> Lower is better; indicates the worst historical loss a strategy would have experienced.
                </Typography>
              </Box>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Volatility (Standard Deviation)
                </Typography>
                <Typography variant="body2" paragraph>
                  The dispersion of returns around the average, indicating the strategy's consistency.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Formula:</strong> Square root of the variance of returns
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Interpretation:</strong> Lower values indicate more consistent returns; higher values indicate more variability.
                </Typography>
              </Box>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Value at Risk (VaR)
                </Typography>
                <Typography variant="body2" paragraph>
                  The maximum loss expected over a given time period at a specified confidence level.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Formula:</strong> Depends on calculation method (Historical, Parametric, or Monte Carlo)
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Interpretation:</strong> Lower is better; for example, a 5% VaR of -2% means there's a 5% chance of losing 2% or more in a given period.
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Risk-Adjusted Return Metrics
              </Typography>
              <Typography variant="body2" paragraph>
                Risk-adjusted return metrics provide a more comprehensive view of performance by considering both returns and risk.
              </Typography>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Sharpe Ratio
                </Typography>
                <Typography variant="body2" paragraph>
                  Measures the excess return per unit of risk (volatility).
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Formula:</strong> (Strategy Return - Risk-Free Rate) / Standard Deviation of Strategy Returns
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Interpretation:</strong> Higher is better; values above 1 are generally considered acceptable, above 2 are very good, and above 3 are excellent.
                </Typography>
              </Box>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Sortino Ratio
                </Typography>
                <Typography variant="body2" paragraph>
                  Similar to the Sharpe ratio but only considers downside volatility.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Formula:</strong> (Strategy Return - Risk-Free Rate) / Downside Deviation
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Interpretation:</strong> Higher is better; focuses only on harmful volatility (downside risk).
                </Typography>
              </Box>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Calmar Ratio
                </Typography>
                <Typography variant="body2" paragraph>
                  Measures the relationship between return and maximum drawdown.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Formula:</strong> Annualized Return / Maximum Drawdown
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Interpretation:</strong> Higher is better; values above 3 are generally considered excellent.
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Trade Statistics
              </Typography>
              <Typography variant="body2" paragraph>
                Trade statistics provide insights into the frequency and success rate of your trading activity.
              </Typography>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Win Rate
                </Typography>
                <Typography variant="body2" paragraph>
                  The percentage of trades that resulted in a profit.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Formula:</strong> (Number of Winning Trades / Total Number of Trades) × 100%
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Interpretation:</strong> Higher is generally better, but should be considered alongside profit/loss ratio.
                </Typography>
              </Box>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Profit Factor
                </Typography>
                <Typography variant="body2" paragraph>
                  The ratio of gross profits to gross losses.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Formula:</strong> Gross Profit / Gross Loss
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Interpretation:</strong> Values above 1 indicate a profitable strategy; values above 2 are considered good.
                </Typography>
              </Box>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Average Win/Loss Ratio
                </Typography>
                <Typography variant="body2" paragraph>
                  The ratio of the average winning trade to the average losing trade.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Formula:</strong> Average Win / Average Loss
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Interpretation:</strong> Higher is better; indicates the relative size of winning trades compared to losing trades.
                </Typography>
              </Box>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Expectancy
                </Typography>
                <Typography variant="body2" paragraph>
                  The expected return per trade, considering both win rate and win/loss ratio.
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Formula:</strong> (Win Rate × Average Win) - ((1 - Win Rate) × Average Loss)
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Interpretation:</strong> Positive values indicate a profitable strategy in the long run; higher values are better.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Performance Visualization
        </Typography>
        <Typography variant="body1" paragraph>
          सूत्रम् provides several visualization tools to help you understand strategy performance:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Equity Curve:</strong> Shows the growth of capital over time, helping identify periods of strong performance and drawdowns.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Drawdown Chart:</strong> Visualizes the magnitude and duration of drawdowns throughout the backtest period.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Monthly/Yearly Returns Heatmap:</strong> Displays returns across different months and years to identify seasonal patterns.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Trade Distribution:</strong> Shows the distribution of trade returns, helping identify outliers and consistency.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Best Practices for Performance Analysis
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Consider Multiple Metrics:</strong> Don't focus on a single metric; use a balanced scorecard approach incorporating returns, risk, and efficiency measures.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Compare to Benchmarks:</strong> Evaluate strategy performance against relevant market benchmarks to determine if it adds value.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Analyze Different Market Regimes:</strong> Check how the strategy performs in different market conditions (bull, bear, sideways).
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Watch for Overfitting:</strong> Be cautious of strategies that perform extremely well in backtests but may have been curve-fitted to historical data.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Include Transaction Costs:</strong> Always account for trading commissions, slippage, and other costs in performance calculations.
          </Typography>
        </Box>
      </Paper>
    </DocsLayout>
  );
}
