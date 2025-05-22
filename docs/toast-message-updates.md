# Toast Message Updates for API Responses

This document outlines the changes made to display API response messages in toast notifications for deployment-related operations.

## Changes Made

### 1. Updated Deployment Service API

- Added `ApiResponse` interface to represent the standard API response format:
  ```typescript
  export interface ApiResponse {
    message: string;
    success: boolean;
    data?: any;
  }
  ```

- Modified deployment service functions to return the API response:
  - `createDeployment`
  - `updateDeployment`
  - `deleteDeployment`
  - `activateDeployment`
  - `deactivateDeployment`
  - `stopAllDeployments`

### 2. Updated Deployment Page

- Added toast notifications for all API operations:
  - Fetching deployments
  - Deleting deployments
  - Activating/deactivating deployments
  - Stopping all deployments

- Now using the actual API response messages in toast notifications instead of hardcoded messages

### 3. Updated DeployButton Component

- Modified to use the `ApiResponse` interface
- Now displays API response messages when deploying strategies

### 4. Updated Strategy Page

- Updated strategy deletion to show API response messages
- Updated strategy cloning to show API response messages

## Usage Example

The toast notifications now display the actual message from the API response. For example:

```typescript
// API response:
{
  "message": "Deployment deleted successfully",
  "success": true
}

// Toast notification:
toast.showSuccess(response.message || 'Deployment deleted successfully');
```

This ensures that any customized messages from the backend are properly displayed to the user.
