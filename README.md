# ARD - Algo Trading Platform

#### Authentication Flow
   - Token-based authentication with local storage
   - Auto-redirect to login for unauthenticated users
   - Preservation of intended destination through returnUrl parameter

## Scanners Functionality
The platform includes a robust market scanning system:

1. **Scanner Management**
   - Create, edit, and delete market scanners
   - Enable/disable scanners
   - View scanner match results
   
2. **Scanner Configuration**
   - Configure scanners with specific timeframes (1m, 5m, 15m, 1h, etc.)
   - Select multiple instruments to scan
   - Build complex scanning conditions using indicator expressions
   
3. **Scanner Interface**
   - Active scanners automatically detect market conditions
   - Visual indicators for active/inactive scanners
   - Match counter to track scanner alerts
   
4. **Integration with Strategy Builder**
   - Use scanner conditions to create strategies
   - Leverage the same expression builder for scanners and strategies

## Directory Structureiew
This project is an algo trading platform for professional traders featuring:
- Multiple pages: Home, Strategy, Reports, Scanners, Docs.
- Strategy Builder accessible via "Create Strategy" and dynamic routes.
- Scanner functionality for market scanning based on technical indicators.
- A top navigation bar with a profile dropdown.
- Authentication system with username/password and OAuth.

## Technical Architecture
- Built with Next.js and Material UI (MUI) for a consistent theming experience (light/dark mode).
- Reusable components (buttons, inputs, dropdowns, etc.) in `src/components`.
- Modular and unit testing friendly.
- Comprehensive authentication system with route protection.

## Authentication System
The platform implements a multi-method authentication system:

1. **Username/Password Authentication**
   - Accessible via `/user/login`
   - Form validation with field-specific error messages
   - Secure token storage
   
2. **OAuth Authentication**
   - Google OAuth integration
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
