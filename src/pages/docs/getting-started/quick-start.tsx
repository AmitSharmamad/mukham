import { Box, Typography, Paper, Divider, Stepper, Step, StepLabel, StepContent, Button } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';
import Link from 'next/link';

export default function QuickStart() {
  return (
    <DocsLayout>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Quick Start Guide
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          This guide will help you get started with सूत्रम् (Sutram) and create your first algorithmic trading strategy.
          Follow these steps to quickly understand the platform's basic workflow.
        </Typography>

        <Stepper orientation="vertical" sx={{ mt: 4 }}>
          <Step active={true}>
            <StepLabel>
              <Typography variant="h6">Create a new strategy</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body1" paragraph>
                From the main navigation, click on <strong>Strategy</strong> and then the <strong>Create Strategy</strong> button. 
                This will take you to the Strategy Builder page.
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                The Strategy Builder is where you'll define all aspects of your trading algorithm, including entry and exit conditions.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                href="/docs/strategy/creating"
                sx={{ mt: 1 }}
              >
                Learn More
              </Button>
            </StepContent>
          </Step>

          <Step active={true}>
            <StepLabel>
              <Typography variant="h6">Name your strategy</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body1" paragraph>
                In the Name section, provide a unique name for your strategy and add a description that outlines
                its purpose and logic. This will help you identify the strategy later.
              </Typography>
            </StepContent>
          </Step>

          <Step active={true}>
            <StepLabel>
              <Typography variant="h6">Configure positions</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body1" paragraph>
                Select whether you want to <strong>Buy</strong> or <strong>Sell</strong> instruments. Click on 
                <strong> Add</strong> to select one or more trading instruments.
              </Typography>
              <Typography variant="body1" paragraph>
                Configure the chart settings by selecting:
              </Typography>
              <Box component="ul" sx={{ pl: 4, mt: 1 }}>
                <Typography component="li" variant="body1">Candlestick Type (e.g., Candlestick)</Typography>
                <Typography component="li" variant="body1">Timeframe (e.g., 5 Minutes)</Typography>
                <Typography component="li" variant="body1">Trade Type (e.g., MIS for intraday)</Typography>
              </Box>
              <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                Specify your Max Allocation and Max Quantity for risk management.
              </Typography>
            </StepContent>
          </Step>

          <Step active={true}>
            <StepLabel>
              <Typography variant="h6">Define entry conditions</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body1" paragraph>
                Use the Indicator Expression Builder to define when your strategy should enter a trade.
                You can combine multiple indicators using logical operators.
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                For example: "MACD Line crosses above Signal Line AND RSI is below 30"
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                href="/docs/strategy/entry-conditions"
                sx={{ mt: 1 }}
              >
                Learn More
              </Button>
            </StepContent>
          </Step>

          <Step active={true}>
            <StepLabel>
              <Typography variant="h6">Define exit conditions</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body1" paragraph>
                Similarly, use the Indicator Expression Builder to define when your strategy should exit a trade.
                Additionally, set:
              </Typography>
              <Box component="ul" sx={{ pl: 4, mt: 1 }}>
                <Typography component="li" variant="body1">Stop Loss (e.g., 1%)</Typography>
                <Typography component="li" variant="body1">Target Profit % (e.g., 3%)</Typography>
                <Typography component="li" variant="body1">Optional: Trailing Stop Loss</Typography>
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                href="/docs/strategy/exit-conditions"
                sx={{ mt: 1 }}
              >
                Learn More
              </Button>
            </StepContent>
          </Step>

          <Step active={true}>
            <StepLabel>
              <Typography variant="h6">Set backtest parameters</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body1" paragraph>
                Configure the backtest settings to evaluate your strategy's performance:
              </Typography>
              <Box component="ul" sx={{ pl: 4, mt: 1 }}>
                <Typography component="li" variant="body1">Initial Capital</Typography>
                <Typography component="li" variant="body1">Entry Start and End Times</Typography>
                <Typography component="li" variant="body1">Start and End Dates for the backtest period</Typography>
              </Box>
            </StepContent>
          </Step>

          <Step active={true}>
            <StepLabel>
              <Typography variant="h6">Run backtest and analyze results</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body1" paragraph>
                Click on the <strong>Run Backtest</strong> button to execute the backtest. Once complete, review the
                performance metrics to evaluate your strategy's effectiveness.
              </Typography>
              <Typography variant="body1" paragraph>
                Key metrics to assess include:
              </Typography>
              <Box component="ul" sx={{ pl: 4, mt: 1 }}>
                <Typography component="li" variant="body1">Total Return</Typography>
                <Typography component="li" variant="body1">Win Rate</Typography>
                <Typography component="li" variant="body1">Sharpe Ratio</Typography>
                <Typography component="li" variant="body1">Maximum Drawdown</Typography>
              </Box>
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                href="/docs/strategy/backtesting"
                sx={{ mt: 1 }}
              >
                Learn More
              </Button>
            </StepContent>
          </Step>

          <Step active={true}>
            <StepLabel>
              <Typography variant="h6">Save and deploy (optional)</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body1" paragraph>
                If you're satisfied with the strategy's performance, save it by clicking the <strong>Save Strategy</strong> button.
                For live trading, you can deploy the strategy from the strategy details page.
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Note: Always start with small allocations when deploying a new strategy to real markets.
              </Typography>
            </StepContent>
          </Step>
        </Stepper>

        <Box sx={{ mt: 6, mb: 2 }}>
          <Typography variant="h5" gutterBottom>
            Next Steps
          </Typography>
          <Typography variant="body1" paragraph>
            After creating your first strategy, explore the following resources:
          </Typography>
          <Box component="ul" sx={{ pl: 4 }}>
            <Typography component="li" variant="body1">
              <Link href="/docs/strategy/overview" style={{ textDecoration: 'none' }}>
                <Typography color="primary" component="span">
                  Learn more about strategy development
                </Typography>
              </Link>
            </Typography>
            <Typography component="li" variant="body1">
              <Link href="/docs/indicators/overview" style={{ textDecoration: 'none' }}>
                <Typography color="primary" component="span">
                  Explore available technical indicators
                </Typography>
              </Link>
            </Typography>
            <Typography component="li" variant="body1">
              <Link href="/docs/reports/overview" style={{ textDecoration: 'none' }}>
                <Typography color="primary" component="span">
                  Understand performance reporting
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </DocsLayout>
  );
}
