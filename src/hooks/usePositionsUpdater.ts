import { useCallback, useState } from 'react';
import { Position } from '../services/deploymentService';
import { DeploymentEvent } from './useDeploymentEvents';

export interface PositionUpdate {
  positionId: number;
  updates: Partial<Position>;
  eventType: string;
}

export const usePositionsUpdater = () => {
  const [positionUpdates, setPositionUpdates] = useState<Map<number, PositionUpdate>>(new Map());

  const updatePositionFromEvent = useCallback((event: DeploymentEvent, currentPositions: Position[]) => {
    const { event_type, data } = event;
    
    // Ensure position_id is a number
    const positionId = typeof data.position_id === 'string' ? parseInt(data.position_id, 10) : data.position_id;
    if (!positionId || isNaN(positionId)) {
      console.warn('Invalid position_id in event:', data.position_id);
      return;
    }
    
    switch (event_type) {
      case 'position_opened':
        // For new positions, we might need to add it to the list
        // This would typically come with a full position object
        if (positionId) {
          setPositionUpdates(prev => new Map(prev.set(positionId, {
            positionId: positionId,
            updates: {
              status: 'OPEN' as const,
              entry_price: data.entry_price,
              quantity: data.quantity,
              entry_time: data.entry_time || event.timestamp,
            },
            eventType: event_type
          })));
        }
        break;

      case 'position_closed':
        if (positionId) {
          setPositionUpdates(prev => new Map(prev.set(positionId, {
            positionId: positionId,
            updates: {
              status: 'CLOSED' as const,
              exit_price: data.exit_price,
              exit_time: data.exit_time || event.timestamp,
              pnl: data.pnl,
            },
            eventType: event_type
          })));
        }
        break;

      case 'position_update':
        if (positionId) {
          const updates: Partial<Position> = {};
          
          // Only update fields that are provided
          if (data.current_price !== undefined) {
            // For open positions, we might want to calculate unrealized PnL
            const position = currentPositions.find(p => p.id === positionId);
            if (position && position.status === 'OPEN') {
              const direction = data.direction || (position.quantity > 0 ? 'LONG' : 'SHORT');
              if (direction === 'LONG') {
                updates.pnl = (data.current_price - position.entry_price) * Math.abs(position.quantity);
              } else {
                updates.pnl = (position.entry_price - data.current_price) * Math.abs(position.quantity);
              }
            }
          }
          
          if (data.unrealized_pnl !== undefined) {
            updates.pnl = data.unrealized_pnl;
          }

          if (Object.keys(updates).length > 0) {
            setPositionUpdates(prev => new Map(prev.set(positionId, {
              positionId: positionId,
              updates,
              eventType: event_type
            })));
          }
        }
        break;

      case 'stop_loss_triggered':
      case 'target_profit_triggered':
      case 'eod_square_off':
        if (positionId) {
          setPositionUpdates(prev => new Map(prev.set(positionId, {
            positionId: positionId,
            updates: {
              status: 'CLOSED' as const,
              exit_price: data.exit_price || data.trigger_price,
              exit_time: event.timestamp,
              pnl: data.pnl,
            },
            eventType: event_type
          })));
        }
        break;
    }
  }, []);

  const applyUpdatesToPositions = useCallback((positions: Position[]): Position[] => {
    if (positionUpdates.size === 0) return positions;

    return positions.map(position => {
      const update = positionUpdates.get(position.id);
      if (update) {
        return {
          ...position,
          ...update.updates,
          updated_at: new Date().toISOString(), // Mark as recently updated
        };
      }
      return position;
    });
  }, [positionUpdates]);

  const clearPositionUpdate = useCallback((positionId: number) => {
    setPositionUpdates(prev => {
      const newMap = new Map(prev);
      newMap.delete(positionId);
      return newMap;
    });
  }, []);

  const clearAllUpdates = useCallback(() => {
    setPositionUpdates(new Map());
  }, []);

  const hasUpdates = positionUpdates.size > 0;
  const getUpdatedPositionIds = useCallback(() => Array.from(positionUpdates.keys()), [positionUpdates]);

  return {
    updatePositionFromEvent,
    applyUpdatesToPositions,
    clearPositionUpdate,
    clearAllUpdates,
    hasUpdates,
    getUpdatedPositionIds,
    positionUpdates
  };
};
