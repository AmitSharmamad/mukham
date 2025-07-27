import { TourStep } from '../components/Tour';

// Sample tour steps for the main application
export const mainAppTourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Mukham!',
    content: 'Welcome to your trading platform! Let\'s take a quick tour to help you get started with the key features.',
    position: 'center',
  },
  {
    id: 'navbar',
    title: 'Navigation Bar',
    content: 'This is your main navigation. Here you can access different sections of the platform, toggle themes, and manage your account.',
    target: 'nav[role="navigation"], .MuiAppBar-root',
    position: 'bottom',
  },
  {
    id: 'theme-toggle',
    title: 'Theme Settings',
    content: 'Click here to switch between light and dark themes, and customize your color preferences.',
    target: '[data-testid="theme-toggle"], [aria-label*="theme"]',
    position: 'bottom',
  },
  {
    id: 'user-menu',
    title: 'User Account',
    content: 'Access your profile, settings, and logout options from the user menu.',
    target: '[data-testid="user-menu"], [aria-label*="account"]',
    position: 'bottom',
  },
  {
    id: 'main-content',
    title: 'Main Content Area',
    content: 'This is where you\'ll see the main content for each page - dashboards, reports, trading tools, and more.',
    target: 'main, [role="main"], .main-content',
    position: 'center',
  },
];

// Tour steps for the trading/deployment section
export const tradingTourSteps: TourStep[] = [
  {
    id: 'trading-welcome',
    title: 'Trading Dashboard',
    content: 'Welcome to your trading dashboard! Here you can monitor your strategies and deployments.',
    position: 'center',
  },
  {
    id: 'deployment-section',
    title: 'Strategy Deployments',
    content: 'View and manage your active trading strategy deployments here.',
    target: '[data-tour="deployments"], .deployment-card',
    position: 'top',
  },
  {
    id: 'pnl-display',
    title: 'P&L Overview',
    content: 'Track your profit and loss in real-time with this display.',
    target: '[data-tour="pnl"], .pnl-display',
    position: 'bottom',
  },
  {
    id: 'live-data',
    title: 'Live Market Data',
    content: 'Get real-time market updates and live trading information.',
    target: '[data-tour="live-data"], .live-clock',
    position: 'bottom',
  },
];

// Tour steps for the strategy builder
export const strategyBuilderTourSteps: TourStep[] = [
  {
    id: 'builder-welcome',
    title: 'Strategy Builder',
    content: 'Create and customize your trading strategies with our visual builder.',
    position: 'center',
  },
  {
    id: 'indicators',
    title: 'Technical Indicators',
    content: 'Add technical indicators to your strategy from this panel.',
    target: '[data-tour="indicators"], .indicators-panel',
    position: 'right',
  },
  {
    id: 'conditions',
    title: 'Entry & Exit Conditions',
    content: 'Define when your strategy should enter and exit trades.',
    target: '[data-tour="conditions"], .conditions-panel',
    position: 'left',
  },
  {
    id: 'backtest',
    title: 'Backtesting',
    content: 'Test your strategy against historical data before deploying.',
    target: '[data-tour="backtest"], .backtest-button',
    position: 'top',
  },
];

// Get tour steps based on page/context
export const getTourSteps = (context: 'main' | 'trading' | 'strategy-builder' = 'main'): TourStep[] => {
  switch (context) {
    case 'trading':
      return tradingTourSteps;
    case 'strategy-builder':
      return strategyBuilderTourSteps;
    case 'main':
    default:
      return mainAppTourSteps;
  }
};
