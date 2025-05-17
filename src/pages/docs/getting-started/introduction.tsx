import { Box, Typography, Paper, Divider } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';

export default function Introduction() {
  return (
    <DocsLayout>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Introduction to सूत्रम्
        </Typography>
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" paragraph>
          Welcome to सूत्रम् (Sutram), a powerful algorithmic trading platform designed for professional traders. 
          This documentation will guide you through the platform's features, functionality, and best practices.
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          What is सूत्रम्?
        </Typography>
        <Typography variant="body1" paragraph>
          सूत्रम् is a comprehensive algorithmic trading platform that enables traders to create, backtest, and deploy 
          trading strategies with ease. The platform offers robust features for technical analysis, strategy development, 
          backtesting, and real-time trading.
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Key Features
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Strategy Builder:</strong> Create custom trading strategies using a wide range of technical indicators
            and conditions without writing code.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Backtesting:</strong> Test your strategies against historical market data to evaluate performance.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Real-time Market Data:</strong> Access to real-time market data for informed decision-making.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Performance Analytics:</strong> Comprehensive reports and analytics to measure strategy performance.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Multi-Asset Trading:</strong> Trade across various asset classes including stocks, futures, and options.
          </Typography>
        </Box>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Getting Started
        </Typography>
        <Typography variant="body1" paragraph>
          To start using सूत्रम्, navigate through the documentation sections to understand the platform's 
          capabilities. We recommend beginning with the Platform Overview and Quick Start Guide sections to get 
          familiar with the interface and basic functionality.
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
          Documentation Structure
        </Typography>
        <Typography variant="body1" paragraph>
          Our documentation is organized into the following main sections:
        </Typography>
        <Box component="ul" sx={{ pl: 4 }}>
          <Typography component="li" variant="body1" paragraph>
            <strong>Getting Started:</strong> Platform overview and quick start guides.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Strategy:</strong> Detailed guides on strategy building, entry/exit conditions, and backtesting.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Indicators:</strong> Comprehensive information about available technical indicators.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Reports:</strong> Understanding performance metrics and analytics.
          </Typography>
          <Typography component="li" variant="body1" paragraph>
            <strong>Advanced:</strong> API references, best practices, and troubleshooting guides.
          </Typography>
        </Box>
      </Paper>
    </DocsLayout>
  );
}
