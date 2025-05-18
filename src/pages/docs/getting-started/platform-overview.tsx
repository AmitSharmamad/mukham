import { Box, Typography, Divider, Grid, useTheme, Paper } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';
import { DocContent, DocNavigation } from '../../../components';

export default function PlatformOverview() {
  const theme = useTheme();

  return (
    <DocsLayout>
      <DocContent
        title="Platform Overview"
        subtitle="Understanding the core components and architecture of सूत्रम्, our advanced algorithmic trading platform"
      >
        <Typography variant="body1" paragraph>
          सूत्रम् (Sutram) offers a comprehensive set of tools designed to help traders build, test, and deploy
          algorithmic trading strategies. This overview will help you understand the platform's architecture and main components.
        </Typography>

        <Typography variant="h5" gutterBottom>
          Core Components
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                border: '1px solid', 
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', 
                borderRadius: 1,
                '&:hover': {
                  boxShadow: theme.palette.mode === 'dark' ? 
                    '0 4px 20px rgba(0, 0, 0, 0.3)' : 
                    '0 4px 20px rgba(0, 0, 0, 0.08)',
                  borderColor: theme.palette.primary.main,
                }
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
              >
                Strategy Builder
              </Typography>
              <Typography variant="body1">
                The Strategy Builder is the heart of सूत्रम्, allowing you to create custom trading strategies 
                using a visual interface. You can define entry and exit conditions using a wide range of technical 
                indicators without writing code. The builder supports complex logic, multiple instruments, and various 
                trading parameters.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                border: '1px solid', 
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', 
                borderRadius: 1,
                '&:hover': {
                  boxShadow: theme.palette.mode === 'dark' ? 
                    '0 4px 20px rgba(0, 0, 0, 0.3)' : 
                    '0 4px 20px rgba(0, 0, 0, 0.08)',
                  borderColor: theme.palette.primary.main,
                }
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
              >
                Backtesting Engine
              </Typography>
              <Typography variant="body1">
                The Backtesting Engine allows you to test your strategies against historical market data. 
                You can specify parameters such as initial capital, entry/exit times, and date ranges. 
                The engine calculates key performance metrics like returns, drawdowns, and Sharpe ratio.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                border: '1px solid', 
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', 
                borderRadius: 1,
                '&:hover': {
                  boxShadow: theme.palette.mode === 'dark' ? 
                    '0 4px 20px rgba(0, 0, 0, 0.3)' : 
                    '0 4px 20px rgba(0, 0, 0, 0.08)',
                  borderColor: theme.palette.primary.main,
                }
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
              >
                Reports and Analytics
              </Typography>
              <Typography variant="body1">
                The Reports section provides detailed performance analytics for your strategies.
                View profits and losses, active strategies, and other key metrics. Advanced analytics 
                help you understand your strategy's behavior in different market conditions.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                border: '1px solid', 
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', 
                borderRadius: 1,
                '&:hover': {
                  boxShadow: theme.palette.mode === 'dark' ? 
                    '0 4px 20px rgba(0, 0, 0, 0.3)' : 
                    '0 4px 20px rgba(0, 0, 0, 0.08)',
                  borderColor: theme.palette.primary.main,
                }
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ color: theme.palette.primary.main, fontWeight: 600 }}
              >
                Deployment System
              </Typography>
              <Typography variant="body1">
                Once a strategy has been built and tested, it can be deployed to trade automatically.
                The Deployment System handles the execution of your strategies, monitoring market conditions,
                and executing trades based on your defined conditions.
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h5" gutterBottom>
          Platform Architecture
        </Typography>
        <Typography variant="body1" paragraph>
          सूत्रम् is built on a modern, scalable architecture designed for performance and reliability:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>User Interface:</strong> A responsive web interface built with Next.js and Material UI,
            supporting both light and dark modes for comfortable trading in any environment.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Strategy Engine:</strong> A powerful backend that processes strategy logic and generates trading signals.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Data Processing:</strong> Real-time and historical data processing capabilities for market analysis.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Security Layer:</strong> Enterprise-grade security to protect your strategies and trading data.
          </Typography>
        </Box>
        
        <Typography variant="h5" gutterBottom>
          Navigation and Access
        </Typography>
        <Typography variant="body1" paragraph>
          सूत्रम् is organized into several main sections, accessible via the top navigation bar:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Home:</strong> The dashboard and starting point for the platform.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Strategy:</strong> Access to your existing strategies and the strategy builder.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Reports:</strong> Performance analytics and trading results.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Docs:</strong> The documentation you're currently reading.
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          Additional options are available via the profile icon in the top right corner:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Profile:</strong> User profile settings and preferences.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Support:</strong> Access to customer support and help resources.
          </Typography>
        </Box>
        
        <DocNavigation 
          prevDoc={{
            title: "Introduction",
            path: "/docs/getting-started/introduction"
          }}
          nextDoc={{
            title: "Quick Start Guide",
            path: "/docs/getting-started/quick-start"
          }}
        />
      </DocContent>
    </DocsLayout>
  );
}
