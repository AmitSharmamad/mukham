export const PROFIT_LOSS_TYPES = [
  { label: 'Absolute', value: 'ABSOLUTE' },
  { label: 'Percentage', value: 'PERCENTAGE' },
];

export const TIMEFRAME_OPTIONS = [
  { label: '1 Minute', value: '1m' },
  { label: '3 Minutes', value: '3m' },
  { label: '5 Minutes', value: '5m' },
  { label: '10 Minutes', value: '10m' },
  { label: '15 Minutes', value: '15m' },
  { label: '30 Minutes', value: '30m' },
  { label: '1 Hour', value: '1h' },
  { label: '1 Day', value: '1d' },
];

// Mapping function to convert API timeframe to display format
export const mapTimeframeToDisplay = (apiTimeframe: string): string => {
  const option = TIMEFRAME_OPTIONS.find(opt => opt.value === apiTimeframe);
  return option?.value || '1m';
};