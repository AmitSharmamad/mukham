# TradesTable Integration Documentation

## Overview
The TradesTable component has been successfully integrated into the StrategyForm to display detailed trade information from backtest results.

## Integration Details

### Location
- **File**: `/src/components/StrategyBuilder/StrategyForm.tsx`
- **Position**: After MetricsSection, before Performance Charts
- **Lines**: ~1715-1720

### Data Flow
1. **Raw Data Storage**: Added `rawBacktestData` state to store complete backtest response
2. **Data Passing**: TradesTable receives the raw backtest data directly from API response
3. **Instrument Filtering**: Uses `selectedInstruments` from StrategyForm for instrument dropdown

### Component Props
```tsx
<TradesTable 
  backtestData={rawBacktestData} 
  instruments={selectedInstruments}
  isVisible={true}
/>
```

### Interface Definitions
The TradesTable component defines its own `BacktestPosition` interface locally:
```tsx
interface BacktestPosition {
  id: string | number;
  entry_price_order: number;
  entry_time_order: string;
  exit_price_order: number;
  exit_time_order: string;
  exit_reason: string;
  profit_loss_absolute: number;
}
```

### Key Features
- **Instrument Selection**: Dropdown to filter trades by specific instruments or view all
- **Trade Details**: Shows entry/exit prices, times, reasons, and profit/loss for each trade
- **Visual Formatting**: Color-coded P&L, exit reason chips, formatted prices and dates
- **Summary Statistics**: Total P&L calculation for filtered trades
- **Profit/Loss Display**: Shows `profit_loss_absolute` values (gross P&L before transaction costs)

### Backend Data Structure
The component expects backtest data in the following format:
```json
{
  "results": [
    {
      "instrument_id": "0",
      "positions": [
        {
          "id": "...",
          "entry_price_order": 319.45,
          "entry_time_order": "2025-05-09T09:50:00+05:30",
          "exit_price_order": 315.99,
          "exit_time_order": "2025-05-09T15:29:00+05:30",
          "exit_reason": "EOD MIS Square-off",
          "profit_loss_absolute": -314.41
        }
      ]
    }
  ]
}
```

## Testing
- ✅ Component compiles without errors
- ✅ Integration preserves existing functionality
- ✅ Data mapping matches expected structure
- ✅ Application runs successfully

## Future Enhancements
- Add export functionality for trade data
- Implement advanced filtering options
- Add trade statistics charts
- Include transaction cost breakdown
