# ARD - Algo Trading Platform

## Overview
This project is an algo trading platform for professional traders featuring:
- Multiple pages: Home, Strategy, Reports, Docs.
- Strategy Builder accessible via "Create Strategy" and dynamic routes.
- A top navigation bar with a profile dropdown.

## Technical Architecture
- Built with Next.js and Material UI (MUI) for a consistent theming experience (light/dark mode).
- Reusable components (buttons, inputs, dropdowns, etc.) in `src/components`.
- Modular and unit testing friendly.

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
