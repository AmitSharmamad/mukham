import { Box, Typography, Grid } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';
import { DocContent } from '../../../components';

export default function ReportsAnalytics() {
  return (
    <DocsLayout>
      <DocContent
        title="Strategy Analytics"
        subtitle="Powerful tools for deep analysis of your trading strategies. Understand not just how your strategies perform, but why they perform the way they do."
        tags={["Analytics", "Deep Analysis", "Strategy Insights", "Performance"]}
      >
        <Typography variant="body1" paragraph>
          The Analytics section of सूत्रम् (Sutram) provides powerful tools for deep analysis of your trading strategies.
          These analytics help you understand not just how your strategies are performing, but why they perform the way they do,
          giving you insights to make data-driven improvements.
        </Typography>

        <Typography variant="h5" gutterBottom>
          Analytics Dashboard Overview
        </Typography>
        <Typography variant="body1" paragraph>
          The Analytics Dashboard presents a comprehensive view of your strategy's performance through various visualizations and data breakdowns.
          This dashboard helps you identify patterns, strengths, weaknesses, and opportunities for improvement in your trading approach.
        </Typography>

        <Typography variant="h5" gutterBottom>
          Key Analytical Tools
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Trade Analysis
              </Typography>
              <Typography variant="body2" paragraph>
                Detailed breakdown of individual trades and aggregate trade statistics.
              </Typography>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Trade List
                </Typography>
                <Typography variant="body2" paragraph>
                  A chronological list of all trades executed by your strategy, including:
                </Typography>
                <Box component="ul" sx={{ pl: 4 }}>
                  <Typography component="li" variant="body2">Entry and exit dates/times</Typography>
                  <Typography component="li" variant="body2">Entry and exit prices</Typography>
                  <Typography component="li" variant="body2">Position size and direction (long/short)</Typography>
                  <Typography component="li" variant="body2">Profit/loss amount and percentage</Typography>
                  <Typography component="li" variant="body2">Trade duration</Typography>
                  <Typography component="li" variant="body2">Entry and exit reasons (which conditions triggered)</Typography>
                </Box>
              </Box>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Trade Distribution
                </Typography>
                <Typography variant="body2" paragraph>
                  Visual representation of your trade outcomes, showing:
                </Typography>
                <Box component="ul" sx={{ pl: 4 }}>
                  <Typography component="li" variant="body2">Histogram of trade returns</Typography>
                  <Typography component="li" variant="body2">Win/loss ratio by trade count and by amount</Typography>
                  <Typography component="li" variant="body2">Average, median, maximum, and minimum trade returns</Typography>
                  <Typography component="li" variant="body2">Trade return distribution metrics (skew, kurtosis)</Typography>
                </Box>
              </Box>
              
              <Box sx={{ pl: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Consecutive Wins/Losses
                </Typography>
                <Typography variant="body2" paragraph>
                  Analysis of winning and losing streaks, including:
                </Typography>
                <Box component="ul" sx={{ pl: 4 }}>
                  <Typography component="li" variant="body2">Maximum consecutive wins and losses</Typography>
                  <Typography component="li" variant="body2">Average streak length</Typography>
                  <Typography component="li" variant="body2">Performance after winning and losing streaks</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Time-Based Analysis
              </Typography>
              <Typography variant="body2" paragraph>
                Examination of how your strategy performs across different time periods.
              </Typography>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Calendar Performance
                </Typography>
                <Typography variant="body2" paragraph>
                  Analysis of returns across different calendar periods:
                </Typography>
                <Box component="ul" sx={{ pl: 4 }}>
                  <Typography component="li" variant="body2">Monthly returns heatmap</Typography>
                  <Typography component="li" variant="body2">Day-of-week performance</Typography>
                  <Typography component="li" variant="body2">Hour-of-day performance (for intraday strategies)</Typography>
                  <Typography component="li" variant="body2">Yearly comparison</Typography>
                </Box>
              </Box>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Holding Period Analysis
                </Typography>
                <Typography variant="body2" paragraph>
                  Insights into how trade duration affects performance:
                </Typography>
                <Box component="ul" sx={{ pl: 4 }}>
                  <Typography component="li" variant="body2">Performance by holding period buckets</Typography>
                  <Typography component="li" variant="body2">Correlation between holding period and returns</Typography>
                  <Typography component="li" variant="body2">Optimal holding time suggestions</Typography>
                </Box>
              </Box>
              
              <Box sx={{ pl: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Drawdown Analysis
                </Typography>
                <Typography variant="body2" paragraph>
                  Detailed examination of drawdown periods:
                </Typography>
                <Box component="ul" sx={{ pl: 4 }}>
                  <Typography component="li" variant="body2">Drawdown duration and magnitude</Typography>
                  <Typography component="li" variant="body2">Recovery periods</Typography>
                  <Typography component="li" variant="body2">Underwater chart (equity below high-water mark)</Typography>
                  <Typography component="li" variant="body2">Drawdown frequency distribution</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Market Condition Analysis
              </Typography>
              <Typography variant="body2" paragraph>
                Evaluation of strategy performance under different market conditions.
              </Typography>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Volatility Regimes
                </Typography>
                <Typography variant="body2" paragraph>
                  How your strategy performs in different volatility environments:
                </Typography>
                <Box component="ul" sx={{ pl: 4 }}>
                  <Typography component="li" variant="body2">Low, medium, and high volatility periods</Typography>
                  <Typography component="li" variant="body2">Volatility expansion and contraction phases</Typography>
                  <Typography component="li" variant="body2">Correlation with market volatility indexes</Typography>
                </Box>
              </Box>
              
              <Box sx={{ pl: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Trend Analysis
                </Typography>
                <Typography variant="body2" paragraph>
                  Performance across different trend conditions:
                </Typography>
                <Box component="ul" sx={{ pl: 4 }}>
                  <Typography component="li" variant="body2">Strong uptrend, weak uptrend, sideways, weak downtrend, strong downtrend</Typography>
                  <Typography component="li" variant="body2">Trend strength correlation</Typography>
                  <Typography component="li" variant="body2">Performance during trend reversals</Typography>
                </Box>
              </Box>
              
              <Box sx={{ pl: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Market Events
                </Typography>
                <Typography variant="body2" paragraph>
                  Impact of significant market events on strategy performance:
                </Typography>
                <Box component="ul" sx={{ pl: 4 }}>
                  <Typography component="li" variant="body2">Earnings announcements</Typography>
                  <Typography component="li" variant="body2">Economic data releases</Typography>
                  <Typography component="li" variant="body2">Major market corrections</Typography>
                  <Typography component="li" variant="body2">Sector-specific events</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Comparative Analytics
        </Typography>
        <Typography variant="body1" paragraph>
          Tools for comparing strategies and benchmarks:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Strategy Comparison:</strong> Compare multiple strategies side-by-side on key metrics.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Benchmark Comparison:</strong> Analyze your strategy's performance against market indices or custom benchmarks.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Version Comparison:</strong> Track changes in performance as you modify strategy parameters.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Correlation Analysis:</strong> Measure how closely your strategies' returns correlate with each other and with the broader market.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Risk Analytics
        </Typography>
        <Typography variant="body1" paragraph>
          Advanced risk assessment tools:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Risk Contribution Analysis:</strong> Identify which strategy components or trades contribute most to portfolio risk.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Tail Risk Assessment:</strong> Analyze worst-case scenarios and stress test your strategy against historical market crashes.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Conditional Value at Risk (CVaR):</strong> Estimate the expected loss given that a VaR breach occurs.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Risk-Return Optimization:</strong> Tools to help optimize entry/exit parameters for better risk-adjusted returns.
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Using Analytics Effectively
        </Typography>
        <Typography variant="body1" paragraph>
          Tips for getting the most from सूत्रम्'s analytics tools:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Regular Review:</strong> Schedule periodic strategy reviews using the analytics dashboard to identify emerging issues.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Iterative Improvement:</strong> Use insights from analytics to make targeted improvements to your strategies.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Holistic Analysis:</strong> Consider multiple metrics together rather than focusing on a single metric in isolation.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Custom Reports:</strong> Create and save custom analytics views for the specific metrics most relevant to your trading style.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Export and Share:</strong> Export analytics reports for offline analysis or to share with team members.
          </Typography>
        </Box>
      </DocContent>
    </DocsLayout>
  );
}
