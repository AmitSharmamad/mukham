# Waitlist Feature Documentation

## Overview
The waitlist feature allows unauthenticated users to join a waitlist by providing their email address. This feature is designed to capture interest from potential users before they sign up for a full account.

## Implementation Details

### Components Created
1. **Waitlist Page** (`/src/pages/waitlist.tsx`)
   - Clean, user-friendly form with email input
   - Form validation for email format
   - Loading states and error handling
   - Success message after successful submission

2. **Waitlist Service** (`/src/services/waitlistService.ts`)
   - Handles API calls to join the waitlist
   - Proper error handling and type safety

3. **API Route** (`/src/pages/api/waitlist.ts`)
   - Next.js API route that proxies requests to the backend
   - Forwards POST requests to `http://localhost:9090/api/waitlist`
   - Handles errors and returns appropriate responses

### UI Changes
- **Navbar Update**: Added "Join Waitlist" button for unauthenticated users
- The button appears next to the "Login" button with a subtle styling
- Only visible when user is not authenticated

### User Flow
1. Unauthenticated user visits the site
2. User sees "Join Waitlist" button in the top-right corner
3. User clicks the button and is redirected to `/waitlist`
4. User enters their email address
5. Form validates the email format
6. API call is made to the backend
7. On success (201 response), user sees a success message
8. User can return to the home page

### API Integration
- Backend API endpoint: `POST http://localhost:9090/api/waitlist`
- Expected payload: `{"email": "user@example.com"}`
- Expected response: Status 201 with success message

### Error Handling
- Client-side email validation
- Network error handling
- Backend error message display
- Loading states during API calls

## Usage
The feature is automatically available for unauthenticated users. No additional configuration is needed beyond ensuring the backend API is running on port 9090.
