import { useEffect, useState } from 'react';
import NewStrategy from './new';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

export default function StrategyDetail() {
  const [strategyData, setStrategyData] = useState(null);

  useEffect(() => {
    const storedStrategy = localStorage.getItem('selectedStrategy');
    if (storedStrategy) {
      setStrategyData(JSON.parse(storedStrategy));
    }
  }, []);

  return (
    <>
      {strategyData && <NewStrategy initialData={strategyData} />}
      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Backtesting Results</h2>
      <br />
      <TableContainer component={Paper} style={{ marginTop: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: '0.875rem' }}>Instrument</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>LTP</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>P&L</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>W | L</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>Trades</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>WS</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>LS</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>Max DD</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>Deploy</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontSize: '0.875rem', fontWeight: 'bold' }}>Total</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}></TableCell>
              <TableCell sx={{ fontSize: '0.875rem', color: 'green' }}>+110.55 (+5.57%)</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>12 | 27</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>41</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>4</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>9</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>-0.9800</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}></TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontSize: '0.875rem' }}>ADANIENT</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>NSE</TableCell>
              <TableCell sx={{ fontSize: '0.875rem', color: 'green' }}>+84.40 (+3.47%)</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>6 | 13</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>20</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>2</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>4</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>-0.9800</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>
                <Button variant="contained" color="primary" size="small">
                  Deploy
                </Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontSize: '0.875rem' }}>ADANIPORTS</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>NSE</TableCell>
              <TableCell sx={{ fontSize: '0.875rem', color: 'green' }}>+26.15 (+2.1%)</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>6 | 14</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>21</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>2</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>5</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>0.0000</TableCell>
              <TableCell sx={{ fontSize: '0.875rem' }}>
                <Button variant="contained" color="primary" size="small">
                  Deploy
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
