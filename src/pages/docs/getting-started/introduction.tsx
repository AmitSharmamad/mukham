import { Box, Typography, useTheme } from '@mui/material';
import { DocsLayout } from '../../../components/DocsLayout';
import { DocContent } from '../../../components';
import DocNavigation from '../../../components/DocNavigation';

export default function Introduction() {
  const theme = useTheme();
  
  return (
    <DocsLayout>
      <DocContent 
        title="Introduction to सूत्रम्"
        subtitle="A comprehensive guide to our algorithmic trading platform. Learn how to create, backtest, and deploy trading strategies with ease."
        tags={["Getting Started", "Introduction", "Platform", "Overview"]}
      >
        <Typography variant="body1" paragraph>
          Welcome to <strong>सूत्रम् (Sutram)</strong>, a powerful algorithmic trading platform designed for professional traders. 
          This documentation will guide you through the platform's features, functionality, and best practices.
        </Typography>
        
        <Typography variant="h5" gutterBottom>
          What is सूत्रम्?
        </Typography>
        <Typography variant="body1" paragraph>
          सूत्रम् is a comprehensive algorithmic trading platform that enables traders to create, backtest, and deploy 
          trading strategies with ease. The platform offers robust features for technical analysis, strategy development, 
          backtesting, and real-time trading.
        </Typography>
        
        <Typography variant="h5" gutterBottom>
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
        
        <Typography variant="h5" gutterBottom>
          Getting Started
        </Typography>
        <Typography variant="body1" paragraph>
          To start using सूत्रम्, navigate through the documentation sections to understand the platform's 
          capabilities. We recommend beginning with the <a href="/docs/getting-started/platform-overview">Platform Overview</a> and 
          <a href="/docs/getting-started/quick-start"> Quick Start Guide</a> sections to get 
          familiar with the interface and basic functionality.
        </Typography>
        
        <Typography variant="h5" gutterBottom>
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
        
        <Box component="blockquote">
          <Typography variant="body1">
            "Trading is not just about making money; it's about managing risk and implementing sound strategies consistently."
          </Typography>
        </Box>
        
        <DocNavigation 
          nextDoc={{
            title: "Platform Overview",
            path: "/docs/getting-started/platform-overview"
          }}
        />
      </DocContent>
    </DocsLayout>
  );
}
