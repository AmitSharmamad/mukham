import { Box, Typography, Paper, Divider, Grid } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';

export default function ReportsOverview() {
  return (
    <DocsLayout>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Reports Overview
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          The Reports section of सूत्रम् (Sutram) provides comprehensive analytics and performance metrics 
          for your trading strategies. This enables you to evaluate strategy performance, identify strengths 
          and weaknesses, and make data-driven decisions to optimize your trading approach.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Key Performance Metrics
        </Typography>
        <Typography variant="body1" paragraph>
          The platform provides several key metrics to evaluate your strategies:
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Profit & Loss Metrics
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Total P&L:</strong> Overall profit or loss from the strategy.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>P&L %:</strong> Percentage return on investment.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Average Trade P&L:</strong> Average profit or loss per trade.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Maximum Drawdown:</strong> Largest percentage drop from a peak to a trough.
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Trade Statistics
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Total Trades:</strong> Number of completed trades.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Win Rate:</strong> Percentage of profitable trades.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Profit Factor:</strong> Ratio of gross profits to gross losses.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Average Holding Time:</strong> Average duration of trades.
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Risk Metrics
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Sharpe Ratio:</strong> Return adjusted for risk (volatility).
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Sortino Ratio:</strong> Return adjusted for downside risk.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Risk-Return Ratio:</strong> Relationship between risk taken and returns generated.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Value at Risk (VaR):</strong> Potential loss in value of portfolio.
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Performance Analysis
              </Typography>
              <Box component="ul" sx={{ pl: 2, mt: 0 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Monthly Returns:</strong> Performance broken down by month.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Equity Curve:</strong> Visual representation of account growth.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Benchmark Comparison:</strong> Performance compared to market benchmarks.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Correlation Analysis:</strong> Correlation with other strategies or market indices.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Report Types
        </Typography>
        <Typography variant="body1" paragraph>
          सूत्रम् provides several types of reports to help you analyze your trading performance:
        </Typography>
        
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Strategy Performance Reports:</strong> Detailed analysis of individual strategy performance, 
            including all key metrics, trade history, and performance charts.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Portfolio Reports:</strong> Aggregated performance across all active strategies, showing 
            overall performance, diversification metrics, and correlation analysis.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Backtest Reports:</strong> Results of strategy backtests, including performance metrics and 
            trade-by-trade analysis.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Trade Log Reports:</strong> Detailed logs of all trades executed by your strategies, including 
            entry/exit points, prices, quantities, and P&L.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Market Condition Analysis:</strong> Performance of strategies under different market conditions 
            to identify strengths and weaknesses.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Data Visualization
        </Typography>
        <Typography variant="body1" paragraph>
          The Reports section includes powerful data visualization tools to help you understand your strategy performance:
        </Typography>
        
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Performance Charts:</strong> Interactive charts showing equity curve, drawdowns, and rolling returns.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Trade Distribution Charts:</strong> Visualize distribution of trade durations, P&L, and other metrics.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Heatmaps:</strong> Identify patterns in your trading performance across different time periods or market conditions.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Benchmark Comparisons:</strong> Compare strategy performance to market indices or other benchmarks.
          </Typography>
        </Box>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Using Reports for Strategy Optimization
        </Typography>
        <Typography variant="body1" paragraph>
          The reports in सूत्रम् are designed to help you continuously improve your trading strategies:
        </Typography>
        
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Identify Weaknesses:</strong> Analyze metrics to find areas where your strategy underperforms.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Optimize Parameters:</strong> Use performance data to adjust strategy parameters for better results.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Market Adaptation:</strong> Understand how your strategy performs in different market conditions 
            and adjust accordingly.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Risk Management:</strong> Fine-tune stop losses, position sizing, and other risk parameters 
            based on performance metrics.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Strategy Comparison:</strong> Compare different strategies to allocate capital efficiently.
          </Typography>
        </Box>
      </Paper>
    </DocsLayout>
  );
}
