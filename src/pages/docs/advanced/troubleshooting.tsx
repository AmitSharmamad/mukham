import { Box, Typography, Paper, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Troubleshooting() {
  return (
    <DocsLayout>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Troubleshooting Guide
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          This guide addresses common issues you might encounter when using सूत्रम् (Sutram) for algorithmic trading.
          If you're experiencing problems with strategy development, backtesting, or deployment, this troubleshooting
          guide can help you identify and resolve the issues.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Strategy Builder Issues
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Strategy Not Saving</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                If you're having trouble saving your strategy, check the following:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Required Fields:</strong> Ensure all required fields in the strategy form have been completed.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Network Connection:</strong> Verify your internet connection is stable.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Session Timeout:</strong> Your session may have expired. Try refreshing the page and logging in again.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Error Messages:</strong> Check for specific error messages in the form feedback or browser console.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Solution:</strong> If the issue persists, try clearing your browser cache, using a different browser, 
                or contacting support with a screenshot of any error messages.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Expression Builder Errors</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                Issues with the indicator expression builder can include syntax errors or validation problems:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Syntax Errors:</strong> Ensure your expressions follow the correct format and operators are properly used.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Missing Parameters:</strong> Check that all indicators have the required parameters specified.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Circular References:</strong> Avoid creating circular dependencies in your expressions.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Invalid Comparisons:</strong> Ensure you're comparing compatible data types (e.g., price to price, not price to volume).
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Solution:</strong> Use the expression builder's validation feedback to identify specific issues. 
                Review the documentation for correct syntax examples for different indicators.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Instrument Selection Issues</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                If you're having trouble finding or adding instruments to your strategy:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Search Functionality:</strong> Try different search terms or use partial name/symbol.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Instrument Availability:</strong> Not all instruments may be available for trading or backtesting.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Filters:</strong> Check if any filters are active that might be limiting your search results.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Account Permissions:</strong> Your account may not have access to certain instrument types.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Solution:</strong> Contact support if you need access to specific instruments that aren't appearing 
                in your search results, or if you believe there's a system issue with instrument data.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Backtesting Problems
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Backtest Not Starting</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                If your backtest fails to start or gets stuck in a pending state:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Strategy Validation:</strong> Ensure your strategy has passed all validation checks.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Date Range:</strong> Verify that your specified date range is valid and data is available.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>System Load:</strong> During peak times, backtest jobs may be queued.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Browser Issues:</strong> Try refreshing the page or using a different browser.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Solution:</strong> If the issue persists, try simplifying your strategy or selecting a shorter 
                backtest period. If all else fails, contact support with your strategy ID and details of the issue.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">No Trades Generated</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                If your backtest completes but doesn't generate any trades:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Conditions:</strong> Your entry conditions may be too restrictive or never satisfied during the tested period.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Data Availability:</strong> The required data for your indicators might not be available.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Time Constraints:</strong> Check if your entry/exit time constraints are preventing trades.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Instrument Selection:</strong> Ensure the selected instruments were active during the backtest period.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Solution:</strong> Gradually simplify your entry conditions to understand which specific condition 
                is preventing trades. Test with a longer timeframe or different instruments. Review the strategy logs for clues.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Unrealistic Backtest Results</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                If your backtest results seem too good to be true or don't match expectations:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Slippage and Fees:</strong> Check if you've properly configured transaction costs and slippage.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Look-Ahead Bias:</strong> Ensure your strategy isn't using future data inadvertently.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Data Quality:</strong> Historical data may have gaps, errors, or survivorship bias.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Overfitting:</strong> Your strategy may be overfitted to the specific backtest period.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Solution:</strong> Enable realistic execution settings like slippage and fees. Test your strategy 
                on different time periods and instruments. Consider implementation challenges that might not be captured 
                in the backtest.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Deployment and Execution Issues
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Strategy Not Executing Trades</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                If your deployed strategy isn't executing trades as expected:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Strategy Status:</strong> Verify that your strategy is actually activated and running.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Market Hours:</strong> Ensure the markets for your selected instruments are open.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Entry Conditions:</strong> Your conditions may not have been met since deployment.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Account Issues:</strong> Check for any account restrictions, margin requirements, or insufficient funds.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Solution:</strong> Review strategy logs to understand why trades aren't being executed. Verify that 
                your account has sufficient funds and permissions. Consider modifying your entry conditions if they're rarely met.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Order Execution Discrepancies</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                If orders are executed but with unexpected prices, quantities, or timing:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Slippage:</strong> Market orders may execute at different prices than expected, especially in volatile markets.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Liquidity:</strong> Low liquidity instruments may have wider spreads and more significant price impact.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Order Types:</strong> Different order types (market, limit, stop) behave differently in various market conditions.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>System Latency:</strong> There may be delays between signal generation and order execution.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Solution:</strong> Consider using limit orders instead of market orders for better price control. 
                For large orders, implement smart order routing or split them into smaller chunks. Review your order 
                execution settings and adjust based on the liquidity of your instruments.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Strategy Stopped Unexpectedly</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                If your strategy stops running unexpectedly:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Risk Controls:</strong> Check if any risk controls (e.g., max drawdown) were triggered.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Account Issues:</strong> Verify that your account remains in good standing and funded.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>System Maintenance:</strong> Check for any system maintenance notices or updates.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Technical Errors:</strong> Review logs for any technical errors or exceptions.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Solution:</strong> Review the strategy logs and system notifications to understand why it stopped. 
                Contact support if there's no clear reason for the stoppage or if you believe it was stopped in error.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Data and Reporting Issues
        </Typography>
        
        <Box sx={{ mt: 2 }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Missing or Incorrect Performance Data</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                If you notice issues with your strategy performance reports:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Calculation Period:</strong> Verify that the reporting period is set correctly.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Data Delays:</strong> There may be delays in updating performance metrics after trades.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Filtering Issues:</strong> Check if any filters are applied that might affect the displayed data.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Browser Cache:</strong> Try clearing your browser cache or using a different browser.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Solution:</strong> Refresh the page and ensure you're looking at the correct strategy and time period. 
                If issues persist, contact support with specific details about what data appears to be missing or incorrect.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Data Feeds Issues</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                If you suspect problems with market data feeds:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Data Provider Status:</strong> Check if there are any known issues with data providers.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Instrument-Specific Issues:</strong> Some instruments may have delayed or missing data.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Subscription Level:</strong> Verify your data subscription includes the required data.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Connection Issues:</strong> Network problems may affect real-time data delivery.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Solution:</strong> Check the system status page for any announced data feed issues. Try using 
                alternative instruments or markets if available. For persistent issues, contact support with details 
                about the specific data that appears to be problematic.
              </Typography>
            </AccordionDetails>
          </Accordion>
          
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Export and API Issues</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" paragraph>
                If you're having trouble exporting data or using the API:
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Authentication:</strong> Ensure your API credentials are valid and properly configured.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Rate Limits:</strong> Check if you've exceeded API rate limits.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Format Issues:</strong> Verify that your request format matches the API documentation.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Permission Level:</strong> Some data may require specific permissions or subscription levels.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Solution:</strong> Review the API documentation for correct usage examples. Check the error 
                responses for specific guidance. For export issues, try smaller date ranges or different file formats.
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Getting Additional Help
        </Typography>
        <Typography variant="body1" paragraph>
          If you've tried the troubleshooting steps above and still need assistance:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Contact Support:</strong> Submit a support ticket with detailed information about your issue.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Community Forum:</strong> Check if other users have experienced and resolved similar issues.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Documentation:</strong> Review the comprehensive documentation for any sections related to your issue.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Live Chat:</strong> For urgent issues, our live chat support is available during market hours.
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          When reporting an issue, always include:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            Your strategy ID (if applicable)
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Specific error messages or screenshots
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Steps you've already taken to troubleshoot
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            When the issue started occurring
          </Typography>
        </Box>
      </Paper>
    </DocsLayout>
  );
}
