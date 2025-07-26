# WebSocket Migration Guide

## Overview

The application has been migrated from the old WebSocket implementation to a new page-specific WebSocket system based on the `events.md` documentation. This new system provides better organization, improved performance, and more maintainable code.

## What Was Removed

### Old Files/Components
- `src/context/DeploymentContext.tsx` - Replaced with `WebSocketContext`
- `src/hooks/useDeploymentEvents.ts` - Replaced with page-specific hooks
- Old `DeploymentEventHandler` - Replaced with `GlobalEventHandler`

### Old WebSocket Connection
- Manual WebSocket connection management in components
- Hard-coded WebSocket URLs (`ws://localhost:9099/ws/api/deployment/events/ws`)
- Single-purpose deployment-only events

## New WebSocket System

### Architecture

1. **WebSocketService** (`src/services/WebSocketService.ts`)
   - Core WebSocket connection management
   - Automatic reconnection with exponential backoff
   - Page context awareness

2. **WebSocketContext** (`src/context/WebSocketContext.tsx`)
   - React context provider for WebSocket functionality
   - Global event management
   - Connection status tracking

3. **Page-Specific Hooks**
   - `useDashboardWebSocket.ts` - Dashboard-specific events
   - `useDeploymentListWebSocket.ts` - Deployment list events
   - `useDeploymentDetailWebSocket.ts` - Individual deployment events
   - `usePortfolioWebSocket.ts` - Portfolio/balance events
   - `useGlobalAlerts.ts` - Global alert notifications

4. **Event Handlers**
   - `GlobalEventHandler` - Handles global events and toast notifications

### Key Features

#### Page Context Awareness
The WebSocket connection automatically filters events based on the current page:
```typescript
// Dashboard context
{ page_type: "dashboard", page_params: {} }

// Deployment detail context
{ page_type: "deployment_detail", page_params: { deployment_id: "uuid" } }
```

#### Event Types
Events are now structured according to the documentation:
```typescript
interface WebEvent {
  event_type: string;           // e.g., "dashboard.summary_updated"
  page_type: PageType;          // "dashboard" | "deployment_list" | etc.
  priority: EventPriority;      // "high" | "medium" | "low"
  data: any;                   // Event-specific data
  metadata?: Record<string, any>;
  timestamp: string;
  expires_at?: string;
}
```

#### Automatic Connection Management
- Connects automatically when user is authenticated
- Reconnects on connection loss with exponential backoff
- Graceful handling of connection errors

## Usage Examples

### Dashboard Page
```typescript
import { useDashboardWebSocket } from '../hooks/useDashboardWebSocket';

const Dashboard = () => {
  const { summary, activities, alerts, isConnected } = useDashboardWebSocket();
  
  return (
    <div>
      {summary && <div>Total P&L: {summary.total_pnl}</div>}
      <div>Status: {isConnected ? 'Connected' : 'Disconnected'}</div>
    </div>
  );
};
```

### Deployment Detail Page
```typescript
import { useDeploymentDetailWebSocket } from '../hooks/useDeploymentDetailWebSocket';

const DeploymentDetail = ({ deploymentId }) => {
  const { 
    positions, 
    signals, 
    metrics,
    getOpenPositions 
  } = useDeploymentDetailWebSocket(deploymentId);
  
  const openPositions = getOpenPositions();
  
  return (
    <div>
      <div>Open Positions: {openPositions.length}</div>
      <div>Recent Signals: {signals.length}</div>
    </div>
  );
};
```

### Global Alerts
```typescript
import { useGlobalAlerts } from '../hooks/useGlobalAlerts';

const Navigation = () => {
  const { 
    criticalCount, 
    unreadCount, 
    hasUnreadCriticalAlerts 
  } = useGlobalAlerts();
  
  return (
    <div>
      <Badge count={unreadCount}>
        <NotificationIcon />
      </Badge>
      {hasUnreadCriticalAlerts() && <CriticalAlert />}
    </div>
  );
};
```

## WebSocket Server Requirements

The server must implement the event filtering and page context system as described in `events.md`:

### Connection URL
```
ws://localhost:9090/api/events/ws?page_type=dashboard&page_params={}
```

### Authentication
Include JWT token in connection or send as first message:
```json
{
  "type": "auth",
  "token": "jwt_token_here"
}
```

### Page Context Updates
```json
{
  "type": "update_context",
  "page_context": {
    "page_type": "deployment_detail",
    "page_params": { "deployment_id": "uuid" }
  }
}
```

## Migration Checklist

### ✅ Completed
- [x] Created new WebSocket service and context
- [x] Implemented page-specific hooks
- [x] Updated dashboard page
- [x] Updated deployment list page
- [x] Updated deployment detail page
- [x] Created portfolio page
- [x] Created settings page
- [x] Replaced old event handlers
- [x] Updated application providers

### 🔄 Remaining Tasks
- [ ] Update server to implement new event system
- [ ] Test real WebSocket connection
- [ ] Update remaining components that use old hooks
- [ ] Remove old files completely
- [ ] Update documentation

### ⚠️ Known Issues
- Some components still reference old `useDeploymentEvents` hook
- Server needs to be updated to match new event structure
- Old WebSocket debug components need updating

## Testing

To test the new WebSocket system:

1. Start the development server
2. Navigate to different pages (dashboard, deployment list, etc.)
3. Check browser console for WebSocket connection logs
4. Verify page context updates correctly
5. Test reconnection by temporarily losing connection

## Benefits

1. **Better Performance**: Events are filtered server-side by page context
2. **Cleaner Code**: Page-specific hooks reduce complexity
3. **Type Safety**: Strong TypeScript types for all events
4. **Maintainability**: Clear separation of concerns
5. **Reliability**: Automatic reconnection and error handling
6. **Scalability**: Easy to add new page types and events

## Next Steps

1. Update the backend to implement the new event system
2. Test with real WebSocket server
3. Remove old components and files
4. Add comprehensive error handling
5. Implement proper offline/online state handling
