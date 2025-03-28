import StrategyForm from './new';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function StrategyDetail() {
  return (
    <>
      <StrategyForm />
      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Backtesting Results</h2>
      <br />
      <TableContainer component={Paper} style={{ marginTop: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Instrument</TableCell>
              <TableCell>LTP</TableCell>
              <TableCell>P&L</TableCell>
              <TableCell>W | L</TableCell>
              <TableCell>Trades</TableCell>
              <TableCell>WS</TableCell>
              <TableCell>LS</TableCell>
              <TableCell>Max DD</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>ADANIENT</TableCell>
              <TableCell>NSE</TableCell>
              <TableCell style={{ color: 'green' }}>+84.40 (+3.47%)</TableCell>
              <TableCell>6 | 13</TableCell>
              <TableCell>20</TableCell>
              <TableCell>2</TableCell>
              <TableCell>4</TableCell>
              <TableCell>-0.9800</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>ADANIPORTS</TableCell>
              <TableCell>NSE</TableCell>
              <TableCell style={{ color: 'green' }}>+26.15 (+2.1%)</TableCell>
              <TableCell>6 | 14</TableCell>
              <TableCell>21</TableCell>
              <TableCell>2</TableCell>
              <TableCell>5</TableCell>
              <TableCell>0.0000</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
