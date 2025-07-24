# ARD - Algo Trading Platform

This project is an algo trading platform with robust features for full-fledged professional traders.

## Application Requirement Documentation (ARD)

### Overview

This platform provides a comprehensive environment for algorithmic trading with the following key features:

- Strategy building and management
- Strategy backtesting
- Performance reporting and analytics
- Educational resources
- User profile management
- Dark mode support

### Technology Stack

- **Frontend Framework**: Next.js
- **UI Library**: Material UI (MUI)
- **State Management**: React Context API
- **Charting**: Chart.js, Lightweight Charts
- **Date Handling**: Day.js
- **Drag and Drop**: react-dnd
- **HTTP Client**: Axios

### Navigation Structure

The application features a navigation bar at the top with the following links:
1. Home (/home)
2. Strategy (/strategy)
3. Reports (/reports)
4. Docs (/docs)

Additionally, there is a profile icon in the top right corner, which displays:
1. Profile (/profile)
2. Support (/support)

### Page Structure

The application consists of the following pages:

1. **Home (`/home`)**
   - Dashboard with performance metrics
   - Quick links to other sections
   - Overview of active strategies

2. **Strategy (`/strategy`)**
   - List of user's strategies
   - Create/Edit/Delete strategy functionality
   - Strategy status and performance overview

3. **Strategy Builder (`/strategy/new` and `/strategy/{strategy_id}`)**
   - Name and description section
   - Positions configuration
     - Buy/Sell selection
     - Instrument selection
     - Chart configuration (Candlestick type, Timeframe, Trade type)
     - Quantity parameters
   - Entry conditions with Indicator Expression Builder
   - Exit conditions including:
     - Indicator expressions
     - Stop Loss
     - Target Profit %
     - Trailing Stop Loss
   - Backtest parameters configuration

4. **Reports (`/reports`)**
   - Overall Profit & Loss analytics
   - Active strategies metrics
   - Detailed performance charts
   - Trade history analytics

5. **Documentation (`/docs`)**
   - Platform usage guides
   - Strategy building tutorials
   - Technical indicator explanations
   - Best practices

6. **Profile (`/profile`)**
   - User information management
   - Settings and preferences

7. **Support (`/support`)**
   - Help desk
   - Frequently asked questions
   - Contact form

### Theme and Styling

The application includes a comprehensive dark mode implementation with:

- Theme toggle in the navigation bar
- Persistent theme preference
- Optimized color palettes for both light and dark modes
- Consistent styling across all components

### Component Architecture

The application is built with a modular component architecture:

- **Reusable UI Components**
  - Button
  - TextField
  - Select
  - Card
  - Paper
  - DateTimePicker

- **Feature Components**
  - StrategyBuilder
  - IndicatorExpressionBuilder
  - Reports
  - Deployment

- **Layout Components**
  - MainLayout
  - Navbar
  - Footer

### Key Features

1. **Indicator Expression Builder**
   - Visual tool for creating trading conditions
   - Support for various technical indicators
   - Nested condition building
   - Drag and drop interface

2. **Strategy Backtesting**
   - Historical performance simulation
   - Configurable parameters
   - Performance metrics calculation

3. **Charts and Analytics**
   - Interactive price charts
   - Performance visualization
   - Metrics dashboard

4. **Dark Mode**
   - Complete dark theme support
   - Theme persistence
   - Optimized for readability and reduced eye strain

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
4. Docs (/docs)

A profile icon on the top right corner, when clicked, shows options for:
1. Profile (/profile)
2. Support (/support)

### Page Descriptions

#### 1. Home (/home)
A simple landing page with links to other main sections of the application.

#### 2. Strategy (/strategy)
- Displays user's list of strategies
- Clicking on a strategy opens the strategy builder page for that specific strategy
- Features a "Create Strategy" button that opens the strategy builder

#### 3. Reports (/reports)
Contains widgets showing:
- Overall Profit & Loss
- Number of actively deployed strategies

#### 4. Docs (/docs)
Documentation links for:
- How to build strategies
- How to use the application
- High-level overview of features

### Strategy Builder
The strategy builder (/strategy/new or /strategy/{strategy_id}) includes:

1. **Name Section**
   - Name (single line text input)
   - Description (multi-line text input)

2. **Positions Section**
   - Buy/Sell radio buttons
   - Instruments selector with "Add" button
   - Chart configuration with options for:
     - Candlestick Type (dropdown)
     - Timeframe (dropdown)
     - Trade Type (dropdown)
   - Quantity inputs for Max Allocation and Max Quantity

3. **Entry Condition Section**
   - Indicator Expression Builder for defining entry conditions

4. **Exit Condition Section**
   - Indicator Expression Builder
   - Stop Loss input
   - Target Profit % input
   - Trailing Stop Loss input (optional)

5. **Backtest Parameters Section**
   - Initial Capital input
   - Entry Start Time and End Time pickers
   - Start Date and End Date pickers

## Technical Architecture

### Technology Stack
- **Frontend Framework**: Next.js
- **UI Library**: Material UI (MUI)
- **State Management**: React Context API
- **Styling**: MUI theming system with dark mode support
- **Form Handling**: Custom form components with validation

### Key Features
- **Dark Mode Support**: Complete dark mode theme with toggle functionality
- **Responsive Design**: Mobile and desktop friendly interface
- **Component-based Architecture**: Reusable component system
- **API Integration**: RESTful API integration for data fetching and submission
- **Authentication**: Token-based auth with route protection
- **Chat Assistant**: AI-powered trading assistant for strategy advice and market insights

### Project Structure
```
src/
│
├── components/          # Reusable UI components
│   ├── Button/          # Custom button component
│   ├── Card/            # Card component
│   ├── Chat/            # Chat interface components
│   │   ├── ChatContainer.tsx  # Main chat UI container
│   │   ├── ChatHistory.tsx    # Chat conversation history 
│   │   ├── ChatInput.tsx      # Message input component
│   │   ├── ChatMessage.tsx    # Individual message display
│   │   └── index.tsx          # Component exports
│   ├── DateTimePicker/  # Date and time picker
│   ├── Select/          # Custom dropdown component
│   ├── TextField/       # Text input component
│   ├── StrategyBuilder/ # Strategy form components
│   │   ├── IndicatorExpressionBuilder.tsx  # Expression builder
│   │   ├── InstrumentSelector.tsx          # Instrument selection
│   │   ├── StrategyForm.tsx                # Main strategy form
│   │   └── ...
│   └── ...
│
├── context/             # React context providers
│   ├── AuthContext.tsx  # Authentication context
│   ├── ThemeContext.tsx # Theme context for dark/light mode
│   └── ...
│
├── pages/               # Next.js pages
│   ├── home.tsx         # Home page
│   ├── reports.tsx      # Reports dashboard
│   ├── docs.tsx         # Documentation page
│   ├── profile.tsx      # User profile page
│   ├── support.tsx      # Support page
│   └── strategy/        # Strategy pages
│       ├── index.tsx    # Strategy list page
│       ├── new.tsx      # Create strategy page
│       └── [strategy_id].tsx  # Edit strategy page
│
├── theme/               # MUI theme configuration
│   └── index.ts         # Theme definitions and configurations
│
├── types/               # TypeScript type definitions
│   └── strategy.ts      # Strategy types
│
└── utils/               # Utility functions
    └── ...
```

### Authentication System
- Token-based authentication with local storage
- Auto-redirect to login for unauthenticated users
- Preservation of intended destination via returnUrl parameter

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
1. Clone the repository
```bash
git clone <repository-url>
cd mukham
```

2. Install dependencies
```bash
npm install
# or
yarn
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production
```bash
npm run build
# or
yarn build
```

### Start Production Server
```bash
npm start
# or
yarn start
```

## Theme Configuration

The application supports both light and dark mode. The theme is implemented using Material UI's theming system. The theme configuration is located in `src/theme/index.ts`.

You can toggle between light and dark mode using the theme toggle button in the top navigation bar.
   
2. **OAuth Authentication**
   - OAuth callback handling
   
3. **Route Protection**
   - AuthGuard component for protecting private routes
   - API-based authentication verification
   - Public routes: Home, Login, and authentication callback pages
   
4. **Authentication Flow**
   - Token-based authentication with local storage
   - Auto-redirect to login for unauthenticated users
   - Preservation of intended destination through returnUrl parameter

## Directory Structure
```
/Users/amit/workspace/mukham
├── package.json
├── next.config.js
├── tsconfig.json
├── README.md
├── pages
│   ├── _app.tsx
│   ├── home.tsx
│   ├── strategy
│   │   ├── index.tsx
│   │   ├── new.tsx
│   │   └── [strategy_id].tsx
│   ├── reports.tsx
│   ├── docs.tsx
│   ├── profile.tsx
│   └── support.tsx
└── src
    ├── components
    │   └── Navbar.tsx
    └── theme
        └── index.ts
