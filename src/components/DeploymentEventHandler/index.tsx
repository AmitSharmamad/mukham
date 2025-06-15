import { useEffect } from 'react';
import { useDeploymentEvents } from '../../hooks/useDeploymentEvents';
import { useToastContext } from '../../context/ToastContext';

export const DeploymentEventHandler = () => {
  const { events } = useDeploymentEvents();
  const toast = useToastContext();

  useEffect(() => {
    if (events.length === 0) return;

    // Handle the most recent event
    const latestEvent = events[0];
    const { event_type, data, metadata } = latestEvent;

    switch (event_type) {
      case 'position_opened':
        toast.showSuccess(
          'Position Opened',
          `${metadata.strategy_name}: ${data.direction} ${data.quantity} @ ₹${data.entry_price}`
        );
        break;

      case 'position_closed':
        const pnlColor = data.pnl >= 0 ? 'success' : 'error';
        const pnlText = data.pnl >= 0 ? `+₹${data.pnl}` : `-₹${Math.abs(data.pnl)}`;
        if (pnlColor === 'success') {
          toast.showSuccess(
            'Position Closed - Profit',
            `${pnlText} (${data.exit_reason})`
          );
        } else {
          toast.showError(
            'Position Closed - Loss',
            `${pnlText} (${data.exit_reason})`
          );
        }
        break;

      case 'stop_loss_triggered':
        toast.showWarning(
          'Stop Loss Triggered',
          `Position stopped out at ₹${data.trigger_price}`
        );
        break;

      case 'target_profit_triggered':
        toast.showSuccess(
          'Target Profit Reached',
          `Position hit target at ₹${data.trigger_price}`
        );
        break;

      case 'entry_signal_detected':
        toast.showInfo(
          'Entry Signal Detected',
          `${metadata.strategy_name}: Signal at ₹${data.market_price}`
        );
        break;

      case 'exit_signal_detected':
        toast.showInfo(
          'Exit Signal Detected',
          `${metadata.strategy_name}: Exit signal at ₹${data.market_price}`
        );
        break;

      case 'deployment_error':
        toast.showError(
          'Deployment Error',
          `${data.error_message} (${data.context})`
        );
        break;

      case 'trailing_stop_updated':
        toast.showInfo(
          'Trailing Stop Updated',
          `New stop loss: ₹${data.new_stop_loss_price} (was ₹${data.previous_stop_loss_price})`
        );
        break;

      case 'eod_square_off':
        const eodPnlText = data.pnl >= 0 ? `+₹${data.pnl}` : `-₹${Math.abs(data.pnl)}`;
        toast.showWarning(
          'EOD Square-off',
          `MIS position closed: ${eodPnlText}`
        );
        break;

      case 'entry_window_closed':
        toast.showWarning(
          'Entry Window Closed',
          'Trading window is now outside allowed hours'
        );
        break;

      // Don't show notifications for evaluation events and position updates
      // as they can be too frequent
      case 'evaluation_started':
      case 'no_signal':
      case 'position_update':
        break;

      default:
        // For unknown event types, optionally log or show generic notification
        console.log('Unhandled deployment event type:', event_type, data);
        break;
    }
  }, [events, toast]);

  // This component doesn't render anything
  return null;
};

export default DeploymentEventHandler;
