import { Box, Typography, Paper, Divider, Grid, Link as MUILink } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';
import Link from 'next/link';

export default function ApiReference() {
  return (
    <DocsLayout>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          API Reference
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          सूत्रम् (Sutram) provides a comprehensive API for developers who want to programmatically 
          interact with the platform. This reference guide provides details about available endpoints, 
          authentication methods, and example requests and responses.
        </Typography>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          API Overview
        </Typography>
        <Typography variant="body1" paragraph>
          The सूत्रम् API follows REST principles and supports JSON for request and response formats. 
          It enables developers to:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            Retrieve account and portfolio information
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Create, modify, and deploy trading strategies
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Access historical and real-time market data
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Execute trades and manage orders
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            Retrieve performance analytics and reports
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Authentication
        </Typography>
        <Typography variant="body1" paragraph>
          All API requests require authentication. सूत्रम् uses API keys and OAuth 2.0 for authentication.
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                API Keys
              </Typography>
              <Typography variant="body2" paragraph>
                To obtain API keys:
              </Typography>
              <Box component="ol" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  Log in to your सूत्रम् account.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Navigate to Profile {'->'} API Settings.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Click "Generate New API Key".
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Set appropriate access permissions.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Store your API Key and Secret securely. The Secret will only be shown once.
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                Include your API Key in the request header:
              </Typography>
              <Box component="code" sx={{ display: 'block', p: 2, bgcolor: 'background.paper', borderRadius: 1, overflow: 'auto' }}>
                <pre>
                  {`Authorization: Bearer YOUR_API_KEY`}
                </pre>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                OAuth 2.0
              </Typography>
              <Typography variant="body2" paragraph>
                For applications that require user interaction, OAuth 2.0 is recommended.
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>OAuth Endpoints:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  Authorization: <code>https://api.sutram.com/oauth/authorize</code>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Token: <code>https://api.sutram.com/oauth/token</code>
                </Typography>
              </Box>
              <Typography variant="body2" paragraph>
                <strong>Supported Grant Types:</strong>
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  Authorization Code
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Client Credentials
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  Refresh Token
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          API Endpoints
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Account Endpoints
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Get Account Information
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Endpoint:</strong> <code>GET /api/v1/account</code>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Description:</strong> Retrieves account details including balance, margin, and account status.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Parameters:</strong> None
                </Typography>
              </Box>
              <Typography variant="subtitle1" gutterBottom>
                Get Portfolio
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Endpoint:</strong> <code>GET /api/v1/portfolio</code>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Description:</strong> Retrieves current portfolio holdings.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Parameters:</strong>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">
                      <code>detailed</code> (optional): Boolean. If true, includes additional details like unrealized P&L.
                    </Typography>
                  </Box>
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Strategy Endpoints
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                List Strategies
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Endpoint:</strong> <code>GET /api/v1/strategies</code>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Description:</strong> Retrieves a list of strategies created by the user.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Parameters:</strong>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">
                      <code>status</code> (optional): Filter strategies by status (active, inactive, all).
                    </Typography>
                    <Typography component="li" variant="body2">
                      <code>limit</code> (optional): Number of strategies to return (default: 50).
                    </Typography>
                    <Typography component="li" variant="body2">
                      <code>offset</code> (optional): Pagination offset (default: 0).
                    </Typography>
                  </Box>
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Get Strategy
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Endpoint:</strong> <code>GET /api/v1/strategies/{'{strategy_id}'}</code>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Description:</strong> Retrieves details of a specific strategy.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Path Parameters:</strong>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">
                      <code>strategy_id</code> (required): The ID of the strategy to retrieve.
                    </Typography>
                  </Box>
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Create Strategy
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Endpoint:</strong> <code>POST /api/v1/strategies</code>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Description:</strong> Creates a new trading strategy.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Request Body:</strong> JSON object containing strategy details (name, description, instruments, entry/exit conditions, etc.).
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Update Strategy
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Endpoint:</strong> <code>PUT /api/v1/strategies/{'{strategy_id}'}</code>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Description:</strong> Updates an existing strategy.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Path Parameters:</strong>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">
                      <code>strategy_id</code> (required): The ID of the strategy to update.
                    </Typography>
                  </Box>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Request Body:</strong> JSON object containing updated strategy details.
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Delete Strategy
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Endpoint:</strong> <code>DELETE /api/v1/strategies/{'{strategy_id}'}</code>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Description:</strong> Deletes a strategy.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Path Parameters:</strong>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">
                      <code>strategy_id</code> (required): The ID of the strategy to delete.
                    </Typography>
                  </Box>
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Deploy Strategy
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Endpoint:</strong> <code>POST /api/v1/strategies/{'{strategy_id}'}/deploy</code>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Description:</strong> Deploys a strategy for live trading.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Path Parameters:</strong>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">
                      <code>strategy_id</code> (required): The ID of the strategy to deploy.
                    </Typography>
                  </Box>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Request Body:</strong> Deployment parameters (allocation, start time, etc.).
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Backtest Endpoints
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Run Backtest
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Endpoint:</strong> <code>POST /api/v1/backtest</code>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Description:</strong> Runs a backtest for a strategy on historical data.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Request Body:</strong> JSON object containing strategy details and backtest parameters.
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Get Backtest Results
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Endpoint:</strong> <code>GET /api/v1/backtest/{'{backtest_id}'}</code>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Description:</strong> Retrieves the results of a specific backtest.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Path Parameters:</strong>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">
                      <code>backtest_id</code> (required): The ID of the backtest to retrieve.
                    </Typography>
                  </Box>
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Market Data Endpoints
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Get Instruments
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Endpoint:</strong> <code>GET /api/v1/instruments</code>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Description:</strong> Returns a list of available trading instruments.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Parameters:</strong>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">
                      <code>type</code> (optional): Filter by instrument type (equity, future, option, etc.).
                    </Typography>
                    <Typography component="li" variant="body2">
                      <code>exchange</code> (optional): Filter by exchange.
                    </Typography>
                    <Typography component="li" variant="body2">
                      <code>search</code> (optional): Search term for instrument name or symbol.
                    </Typography>
                  </Box>
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Get Historical Data
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Endpoint:</strong> <code>GET /api/v1/market-data/historical</code>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Description:</strong> Retrieves historical price data for an instrument.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Parameters:</strong>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">
                      <code>symbol</code> (required): Instrument symbol.
                    </Typography>
                    <Typography component="li" variant="body2">
                      <code>from</code> (required): Start date (YYYY-MM-DD).
                    </Typography>
                    <Typography component="li" variant="body2">
                      <code>to</code> (required): End date (YYYY-MM-DD).
                    </Typography>
                    <Typography component="li" variant="body2">
                      <code>timeframe</code> (required): Data timeframe (1m, 5m, 15m, 30m, 1h, 1d).
                    </Typography>
                  </Box>
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Get Quote
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Endpoint:</strong> <code>GET /api/v1/market-data/quote</code>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Description:</strong> Retrieves current market quotes for an instrument.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Parameters:</strong>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">
                      <code>symbol</code> (required): Instrument symbol.
                    </Typography>
                  </Box>
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                Reports Endpoints
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Get Performance Summary
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Endpoint:</strong> <code>GET /api/v1/reports/performance</code>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Description:</strong> Retrieves performance metrics for a strategy or the entire portfolio.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Parameters:</strong>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">
                      <code>strategy_id</code> (optional): Filter by strategy ID. If not provided, returns aggregate portfolio performance.
                    </Typography>
                    <Typography component="li" variant="body2">
                      <code>from</code> (optional): Start date (YYYY-MM-DD).
                    </Typography>
                    <Typography component="li" variant="body2">
                      <code>to</code> (optional): End date (YYYY-MM-DD).
                    </Typography>
                  </Box>
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Get Trade History
              </Typography>
              <Box component="ul" sx={{ pl: 4 }}>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Endpoint:</strong> <code>GET /api/v1/reports/trades</code>
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Description:</strong> Retrieves trade history for a strategy or the entire portfolio.
                </Typography>
                <Typography component="li" variant="body2" paragraph>
                  <strong>Parameters:</strong>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2">
                      <code>strategy_id</code> (optional): Filter by strategy ID.
                    </Typography>
                    <Typography component="li" variant="body2">
                      <code>from</code> (optional): Start date (YYYY-MM-DD).
                    </Typography>
                    <Typography component="li" variant="body2">
                      <code>to</code> (optional): End date (YYYY-MM-DD).
                    </Typography>
                    <Typography component="li" variant="body2">
                      <code>limit</code> (optional): Number of trades to return (default: 50).
                    </Typography>
                    <Typography component="li" variant="body2">
                      <code>offset</code> (optional): Pagination offset (default: 0).
                    </Typography>
                  </Box>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Response Formats
        </Typography>
        <Typography variant="body1" paragraph>
          All API responses follow a standard format:
        </Typography>
        <Box component="code" sx={{ display: 'block', p: 2, bgcolor: 'background.paper', borderRadius: 1, overflow: 'auto' }}>
          <pre>
            {`{
  "status": "success" | "error",
  "data": { ... } | null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  } | null
}`}
          </pre>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Rate Limiting
        </Typography>
        <Typography variant="body1" paragraph>
          To ensure fair usage and platform stability, the सूत्रम् API implements rate limiting. The current limits are:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Market Data Endpoints:</strong> 120 requests per minute
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Account/Strategy Endpoints:</strong> 60 requests per minute
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Backtest Endpoints:</strong> 10 requests per minute
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          Rate limit information is included in the response headers:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <code>X-RateLimit-Limit</code>: Total requests allowed in the current period
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <code>X-RateLimit-Remaining</code>: Remaining requests in the current period
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <code>X-RateLimit-Reset</code>: Timestamp when the rate limit resets
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Error Codes
        </Typography>
        <Typography variant="body1" paragraph>
          Common error codes you may encounter:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>400</strong>: Bad Request - Malformed request or invalid parameters
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>401</strong>: Unauthorized - Authentication failure or expired token
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>403</strong>: Forbidden - Insufficient permissions
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>404</strong>: Not Found - Resource not found
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>429</strong>: Too Many Requests - Rate limit exceeded
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>500</strong>: Internal Server Error - Server error
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          SDKs and Client Libraries
        </Typography>
        <Typography variant="body1" paragraph>
          सूत्रम् provides official client libraries for popular programming languages:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <MUILink href="#" color="primary">Python SDK</MUILink>
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <MUILink href="#" color="primary">JavaScript/TypeScript SDK</MUILink>
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <MUILink href="#" color="primary">Java SDK</MUILink>
          </Typography>
        </Box>

        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Getting Help
        </Typography>
        <Typography variant="body1" paragraph>
          If you encounter issues or have questions about the API, you can:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <Link href="/support" passHref>
              <MUILink color="primary">Contact Support</MUILink>
            </Link>
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <MUILink href="https://github.com/sutram/api-examples" color="primary">Check our GitHub repository for examples</MUILink>
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <Link href="/community" passHref>
              <MUILink color="primary">Join our developer community</MUILink>
            </Link>
          </Typography>
        </Box>
      </Paper>
    </DocsLayout>
  );
}
