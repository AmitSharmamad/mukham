import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  RadioGroup, 
  FormControlLabel, 
  Radio, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  Box, 
  Grid, 
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent,
  Autocomplete,
  Chip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function NewStrategy({ initialData }: { initialData?: any }) {
  const [expanded, setExpanded] = useState<string | false>('name');
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [positionType, setPositionType] = useState(initialData?.position_type === 'LONG' ? 'buy' : initialData?.position_type === 'SHORT' ? 'sell' : '');
  const [instruments, setInstruments] = useState<string[]>(initialData?.instruments || []);
  const [chartType, setChartType] = useState('candlestick');
  const timeframeOptions = [
    { id: '1m', label: '1 Minute' },
    { id: '3m', label: '3 Minutes' },
    { id: '5m', label: '5 Minutes' },
    { id: '10m', label: '10 Minutes' },
    { id: '15m', label: '15 Minutes' },
    { id: '30m', label: '30 Minutes' },
    { id: '1h', label: '1 Hour' },
    { id: '1d', label: '1 Day' },
  ];

  const [chartTimeframe, setChartTimeframe] = useState(
    initialData?.chart_timeframe
      ? timeframeOptions.find(option => option.id === initialData.chart_timeframe)?.label || ''
      : ''
  );
  const [tradeType, setTradeType] = useState(initialData?.trade_type || 'MIS');
  const [qty, setQty] = useState(initialData?.qty || 0);
  const [entryExpression, setEntryExpression] = useState(initialData?.entry_expression || '');
  const [exitExpression, setExitExpression] = useState(initialData?.exit_expression || '');
  const [targetProfit, setTargetProfit] = useState(initialData?.target_profit || 0);
  const [stopLoss, setStopLoss] = useState(initialData?.stop_loss || 0);
  const [trailingStopLoss, setTrailingStopLoss] = useState(initialData?.trailing_stop_loss || 0);
  const [exitType, setExitType] = useState(initialData?.exit_type || '');
  const [capital, setCapital] = useState(initialData?.capital || 0);
  const [maxTrades, setMaxTrades] = useState(initialData?.max_trades || 0);
  const [entryStartTime, setEntryStartTime] = useState<Dayjs | null>(initialData?.entry_start_time ? dayjs(initialData.entry_start_time) : dayjs());
  const [entryEndTime, setEntryEndTime] = useState<Dayjs | null>(initialData?.entry_end_time ? dayjs(initialData.entry_end_time) : dayjs());
  const [startDate, setStartDate] = useState<Dayjs | null>(initialData?.start_date ? dayjs(initialData.start_date) : dayjs());
  const [endDate, setEndDate] = useState<Dayjs | null>(initialData?.end_date ? dayjs(initialData.end_date) : dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exchange, setExchange] = useState(initialData?.exchange || 'All');
  const [segment, setSegment] = useState(initialData?.segment || 'All');
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>(initialData?.instruments || []);

  const sections = ['name', 'positions', 'entry', 'exit', 'backtest'];

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleCollapseAll = () => {
    if (isAllExpanded) {
      setExpanded(false);
      setIsAllExpanded(false);
    } else {
      setIsAllExpanded(true);
    }
  };

  const handleTrailingStopLossChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTrailingStopLoss(Number(event.target.value));
  };

  const handleEndDateChange = (newValue: Dayjs | null) => {
    if (newValue && startDate && newValue.isBefore(startDate)) {
      return;
    }
    setEndDate(newValue);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleExchangeChange = (event: SelectChangeEvent<string>) => {
    setExchange(event.target.value);
  };

  const handleSegmentChange = (event: SelectChangeEvent<string>) => {
    setSegment(event.target.value);
  };

  const handleRemoveInstrument = (instrument: string) => {
    setSelectedInstruments((prev) => prev.filter((item) => item !== instrument));
  };

  const allInstruments = ['amit', 'ajit', 'narendra'];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container sx={{ marginTop: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" gutterBottom>Strategy Builder</Typography>
          <Button 
            variant="outlined" 
            onClick={handleCollapseAll}
            size="small"
          >
            {isAllExpanded ? 'Collapse All' : 'Expand All'}
          </Button>
        </Box>
        <form>
          {/* Name Section */}
          <Accordion 
            expanded={isAllExpanded || expanded === 'name'} 
            onChange={handleAccordionChange('name')}
            sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                backgroundColor: 'background.paper',
                borderRadius: expanded === 'name' ? '16px 16px 0 0' : 2
              }}
            >
              <Typography variant="h6">Name</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="Name" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="Description (Optional)" 
                    multiline 
                    rows={3} 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Positions Section */}
          <Accordion 
            expanded={isAllExpanded || expanded === 'positions'} 
            onChange={handleAccordionChange('positions')}
            sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                backgroundColor: 'background.paper',
                borderRadius: expanded === 'positions' ? '16px 16px 0 0' : 2
              }}
            >
              <Typography variant="h6">Positions</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <RadioGroup 
                    row 
                    value={positionType}
                    onChange={(e) => setPositionType(e.target.value)}
                  >
                    <FormControlLabel value="buy" control={<Radio />} label="Buy" />
                    <FormControlLabel value="sell" control={<Radio />} label="Sell" />
                  </RadioGroup>
                </Grid>
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    {selectedInstruments.map((instrument, index) => (
                      <Chip
                        key={index}
                        label={instrument}
                        onDelete={() => handleRemoveInstrument(instrument)}
                        color="primary"
                      />
                    ))}
                    <Button variant="outlined" onClick={handleOpenModal}>Add Instrument</Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Modal for Search Instruments */}
              <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
                <DialogTitle>Search Instruments</DialogTitle>
                <DialogContent>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Exchange</InputLabel>
                      <Select value={exchange} onChange={handleExchangeChange} label="Exchange">
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="NSE">NSE</MenuItem>
                        <MenuItem value="BSE">BSE</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>Segment</InputLabel>
                      <Select value={segment} onChange={handleSegmentChange} label="Segment">
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Equity">Equity</MenuItem>
                        <MenuItem value="Futures">Futures</MenuItem>
                        <MenuItem value="Options">Options</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Autocomplete
                    multiple
                    options={allInstruments}
                    getOptionLabel={(option) => option}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search for an instrument"
                        placeholder="Type to search..."
                      />
                    )}
                    onChange={(event, value) => setSelectedInstruments(value)}
                    value={selectedInstruments}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {selectedInstruments.map((instrument, index) => (
                      <Chip
                        key={index}
                        label={instrument}
                        onDelete={() => handleRemoveInstrument(instrument)}
                        color="primary"
                      />
                    ))}
                  </Box>
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedInstruments((prev) => [...prev]);
                    }}
                    color="primary"
                    variant="contained"
                  >
                    Select
                  </Button>
                  <Button onClick={handleCloseModal} color="primary">Close</Button>
                </DialogActions>
              </Dialog>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Candlestick Type</InputLabel>
                    <Select 
                      label="Candlestick Type" 
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                    >
                      <MenuItem value="candlestick">Candlestick</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Timeframe</InputLabel>
                    <Select 
                      label="Timeframe" 
                      value={chartTimeframe}
                      onChange={(e) => setChartTimeframe(e.target.value)}
                    >
                      {timeframeOptions.map(option => (
                        <MenuItem key={option.id} value={option.label}>{option.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Trade Type</InputLabel>
                    <Select 
                      label="Trade Type" 
                      value={tradeType}
                      onChange={(e) => setTradeType(e.target.value)}
                    >
                      <MenuItem value="MIS">MIS</MenuItem>
                      <MenuItem value="CNC/NRML">CNC/NRML</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="Max Allocation (Optional)" 
                    type="number" 
                    value={capital}
                    onChange={(e) => setCapital(Number(e.target.value))}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField 
                    fullWidth 
                    label="Max Quantity (Optional)" 
                    type="number" 
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Entry Condition Section */}
          <Accordion 
            expanded={isAllExpanded || expanded === 'entry'} 
            onChange={handleAccordionChange('entry')}
            sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                backgroundColor: 'background.paper',
                borderRadius: expanded === 'entry' ? '16px 16px 0 0' : 2
              }}
            >
              <Typography variant="h6">Entry Condition</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
              <TextField 
                fullWidth 
                label="Indicator Expression Builder" 
                value={entryExpression}
                onChange={(e) => setEntryExpression(e.target.value)}
              />
            </AccordionDetails>
          </Accordion>

          {/* Exit Condition Section */}
          <Accordion 
            expanded={isAllExpanded || expanded === 'exit'} 
            onChange={handleAccordionChange('exit')}
            sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                backgroundColor: 'background.paper',
                borderRadius: expanded === 'exit' ? '16px 16px 0 0' : 2
              }}
            >
              <Typography variant="h6">Exit Condition</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField 
                        fullWidth 
                        label="Target Profit" 
                        type="number" 
                        required 
                        value={targetProfit}
                        onChange={(e) => setTargetProfit(Number(e.target.value))}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Type</InputLabel>
                        <Select 
                          label="Type" 
                          value={exitType}
                          onChange={(e) => setExitType(e.target.value)}
                        >
                          <MenuItem value="absolute">Absolute</MenuItem>
                          <MenuItem value="percentage">Percentage</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField 
                        fullWidth 
                        label="Stop Loss (Optional)" 
                        type="number"
                        value={stopLoss}
                        onChange={(e) => setStopLoss(Number(e.target.value))}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select 
                          label="Type" 
                          value={exitType}
                          onChange={(e) => setExitType(e.target.value)}
                        >
                          <MenuItem value="absolute">Absolute</MenuItem>
                          <MenuItem value="percentage">Percentage</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField 
                        fullWidth 
                        label="Trailing Stop Loss (Optional)" 
                        type="number"
                        value={trailingStopLoss}
                        onChange={handleTrailingStopLossChange}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <InputLabel>Type</InputLabel>
                        <Select 
                          label="Type" 
                          value={exitType}
                          onChange={(e) => setExitType(e.target.value)}
                        >
                          <MenuItem value="absolute">Absolute</MenuItem>
                          <MenuItem value="percentage">Percentage</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                  <TextField 
                    fullWidth 
                    label="Indicator Expression Builder (Optional)" 
                    value={exitExpression}
                    onChange={(e) => setExitExpression(e.target.value)}
                    sx={{ mb: 2 }} 
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Backtest Parameters Section */}
          <Accordion 
            expanded={isAllExpanded || expanded === 'backtest'} 
            onChange={handleAccordionChange('backtest')}
            sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                backgroundColor: 'background.paper',
                borderRadius: expanded === 'backtest' ? '16px 16px 0 0' : 2
              }}
            >
              <Typography variant="h6">Backtest Parameters</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField 
                    fullWidth 
                    label="Initial Capital" 
                    type="number" 
                    required
                    value={capital}
                    onChange={(e) => setCapital(Number(e.target.value))}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <TimePicker
                    label="Entry Start Time (Optional)"
                    value={entryStartTime}
                    onChange={(newValue) => setEntryStartTime(newValue)}
                    sx={{ width: '100%' }}
                    ampm={false}
                    views={['hours', 'minutes']}
                    timeSteps={{ hours: 1, minutes: 1 }}
                    minTime={dayjs().set('hour', 0).set('minute', 0)}
                    maxTime={dayjs().set('hour', 23).set('minute', 59)}
                    slotProps={{
                      textField: { fullWidth: true },
                      actionBar: { actions: ['accept'] }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TimePicker
                    label="Entry End Time (Optional)"
                    value={entryEndTime}
                    onChange={(newValue) => setEntryEndTime(newValue)}
                    sx={{ width: '100%' }}
                    ampm={false}
                    views={['hours', 'minutes']}
                    timeSteps={{ hours: 1, minutes: 1 }}
                    minTime={dayjs().set('hour', 0).set('minute', 0)}
                    maxTime={dayjs().set('hour', 23).set('minute', 59)}
                    slotProps={{
                      textField: { fullWidth: true },
                      actionBar: { actions: ['accept'] }
                    }}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => {
                      setStartDate(newValue);
                      if (endDate && newValue && endDate.isBefore(newValue)) {
                        setEndDate(newValue);
                      }
                    }}
                    sx={{ width: '100%' }}
                    slotProps={{
                      textField: { fullWidth: true }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    minDate={startDate || undefined}
                    sx={{ width: '100%' }}
                    slotProps={{
                      textField: { fullWidth: true }
                    }}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button variant="contained" type="submit" size="large">
              Save
            </Button>
            <Button variant="outlined" size="large">
              Backtest
            </Button>
          </Box>
        </form>
      </Container>
    </LocalizationProvider>
  );
}