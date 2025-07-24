# System Theme Detection Feature

## Overview

The application now automatically detects and follows the user's system theme preference (light/dark mode) when they first visit the website. This feature provides a seamless experience by respecting the user's system-level theme settings.

## How It Works

### 1. Automatic Detection
- When a user visits the application for the first time, the system detects their OS theme preference
- Uses the `window.matchMedia('(prefers-color-scheme: dark)')` API to check system settings
- Automatically applies the matching theme without requiring user interaction

### 2. Dynamic Updates
- Listens for system theme changes in real-time
- If the user changes their system theme while the app is open, it updates automatically
- Only applies automatic updates when the user hasn't manually overridden the theme

### 3. User Control
- Users can override the system theme by manually selecting a theme preference
- Once manually set, the system theme changes won't affect the application
- Users can return to system theme tracking at any time

## User Interface

### Theme Menu
The theme toggle button in the navbar now shows:
- **System Theme Icon** (⚙️): When following system preference
- **Sun/Moon Icon**: When manually set to light/dark mode
- **Dropdown Menu**: Click to see theme options

### Theme Options
1. **Use System Theme**: Follow the OS theme preference
2. **Manual Toggle**: Switch between light/dark mode manually

### Visual Indicators
- The theme menu shows the current theme state
- Color coding indicates active theme mode
- Tooltip shows current theme status

## Technical Implementation

### Context Updates
- Added `isUsingSystemTheme` boolean state
- Added `useSystemTheme()` function to reset to system preference
- Enhanced theme detection on initial load

### Event Handling
- MediaQuery listener for system theme changes
- Proper cleanup to prevent memory leaks
- Conditional updates based on user preference

### Local Storage
- Stores manual theme preferences
- Removes stored preference when returning to system theme
- Maintains theme color preferences separately

## Benefits

1. **Better User Experience**: No need to manually set theme preference
2. **Accessibility**: Respects user's system accessibility settings
3. **Consistency**: Matches other applications on the user's system
4. **Flexibility**: Users can override when needed

## Browser Compatibility

The feature works with modern browsers that support:
- `window.matchMedia()` API
- CSS `prefers-color-scheme` media query
- `MediaQueryList.addEventListener()` for change events

Fallback behavior: Defaults to dark theme on unsupported browsers.
