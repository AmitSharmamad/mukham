import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Switch,
  FormControlLabel,
  useTheme,
  Tooltip,
  IconButton
} from '@mui/material';
import { 
  TrendingUp,
  TrendingDown,
  Store,
  RocketLaunch,
  EmojiEvents,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/metricsUtils';

// Mock data for leaderboard entries
const mockLeaderboardData = [
  {
    id: 'user1',
    username: 'TradingMaster',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    totalPnL: 25480.75,
    deployedStrategies: 8,
    marketplaceStrategies: 3,
    rank: 1,
    winRate: 72.5
  },
  {
    id: 'user2', 
    username: 'AlgoWizard',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    totalPnL: 18250.30,
    deployedStrategies: 12,
    marketplaceStrategies: 5,
    rank: 2,
    winRate: 68.2
  },
  {
    id: 'user3',
    username: 'QuantTrader',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    totalPnL: 15670.90,
    deployedStrategies: 6,
    marketplaceStrategies: 2,
    rank: 3,
    winRate: 64.8
  },
  {
    id: 'user4',
    username: 'StrategyBuilder',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
    totalPnL: 12890.45,
    deployedStrategies: 9,
    marketplaceStrategies: 4,
    rank: 4,
    winRate: 61.3
  },
  {
    id: 'user5',
    username: 'MarketAnalyst',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    totalPnL: 11240.80,
    deployedStrategies: 7,
    marketplaceStrategies: 1,
    rank: 5,
    winRate: 59.7
  },
  {
    id: 'user6',
    username: 'TrendFollower',
    avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
    totalPnL: 9875.25,
    deployedStrategies: 5,
    marketplaceStrategies: 3,
    rank: 6,
    winRate: 57.2
  },
  {
    id: 'user7',
    username: 'RiskManager',
    avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    totalPnL: 8960.60,
    deployedStrategies: 11,
    marketplaceStrategies: 2,
    rank: 7,
    winRate: 55.8
  },
  {
    id: 'user8',
    username: 'DayTrader',
    avatar: 'https://randomuser.me/api/portraits/women/8.jpg',
    totalPnL: 7820.35,
    deployedStrategies: 4,
    marketplaceStrategies: 1,
    rank: 8,
    winRate: 53.1
  },
  {
    id: 'user9',
    username: 'SwingTrader',
    avatar: 'https://randomuser.me/api/portraits/men/9.jpg',
    totalPnL: 6940.15,
    deployedStrategies: 8,
    marketplaceStrategies: 4,
    rank: 9,
    winRate: 51.6
  },
  {
    id: 'user10',
    username: 'TechAnalyst',
    avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
    totalPnL: 5780.90,
    deployedStrategies: 6,
    marketplaceStrategies: 0,
    rank: 10,
    winRate: 49.2
  }
];

export interface LeaderboardEntry {
  id: string;
  username: string;
  avatar: string;
  totalPnL: number;
  deployedStrategies: number;
  marketplaceStrategies: number;
  rank: number;
  winRate: number;
}

interface LeaderboardProps {
  maxEntries?: number;
}

export const Leaderboard = ({ maxEntries = 10 }: LeaderboardProps) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [showAnonymous, setShowAnonymous] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    // In a real app, this would be an API call
    setLeaderboardData(mockLeaderboardData.slice(0, maxEntries));
  }, [maxEntries]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <EmojiEvents sx={{ color: '#FFD700' }} />; // Gold
      case 2:
        return <EmojiEvents sx={{ color: '#C0C0C0' }} />; // Silver
      case 3:
        return <EmojiEvents sx={{ color: '#CD7F32' }} />; // Bronze
      default:
        return <Typography variant="h6" color="text.secondary">{rank}</Typography>;
    }
  };

  const getDisplayName = (username: string, rank: number) => {
    if (showAnonymous) {
      return `Trader #${rank}`;
    }
    return username;
  };

  const getPnLColor = (pnl: number) => {
    return pnl >= 0 ? theme.palette.success.main : theme.palette.error.main;
  };

  const getPnLIcon = (pnl: number) => {
    return pnl >= 0 ? <TrendingUp /> : <TrendingDown />;
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        borderRadius: 2,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(45, 45, 60, 0.8)' : 'rgba(255, 255, 255, 0.8)'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          Community Leaderboard
        </Typography>
        <FormControlLabel
          control={
            <Switch
              checked={showAnonymous}
              onChange={(e) => setShowAnonymous(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {showAnonymous ? <VisibilityOff /> : <Visibility />}
              Anonymous Mode
            </Box>
          }
        />
      </Box>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Top performers in our trading community based on total profit & loss
      </Typography>

      <TableContainer>
        <Table size="medium">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Rank</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Trader</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Total P&L</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Win Rate</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Deployed</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>Published</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboardData.map((entry) => (
              <TableRow 
                key={entry.id} 
                hover
                sx={{ 
                  '&:hover': { 
                    backgroundColor: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(0, 0, 0, 0.03)' 
                  }
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 40 }}>
                    {getRankIcon(entry.rank)}
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      src={showAnonymous ? undefined : entry.avatar}
                      sx={{ width: 40, height: 40 }}
                    >
                      {showAnonymous ? '?' : entry.username.charAt(0)}
                    </Avatar>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {getDisplayName(entry.username, entry.rank)}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                    <Box sx={{ color: getPnLColor(entry.totalPnL), fontSize: '0.8rem' }}>
                      {getPnLIcon(entry.totalPnL)}
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: 600,
                        color: getPnLColor(entry.totalPnL)
                      }}
                    >
                      {formatCurrency(entry.totalPnL, '₹')}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell align="center">
                  <Chip 
                    label={`${entry.winRate.toFixed(1)}%`}
                    size="small"
                    sx={{ 
                      backgroundColor: entry.winRate >= 60 
                        ? theme.palette.success.light + '40'
                        : entry.winRate >= 50 
                        ? theme.palette.warning.light + '40'
                        : theme.palette.error.light + '40',
                      color: entry.winRate >= 60 
                        ? theme.palette.success.main
                        : entry.winRate >= 50 
                        ? theme.palette.warning.main
                        : theme.palette.error.main,
                      fontWeight: 600
                    }}
                  />
                </TableCell>
                
                <TableCell align="center">
                  <Tooltip title="Active deployed strategies">
                    <Chip 
                      icon={<RocketLaunch sx={{ fontSize: '0.8rem !important' }} />}
                      label={entry.deployedStrategies}
                      size="small"
                      sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(66, 66, 120, 0.8)' 
                          : 'rgba(230, 230, 250, 0.8)'
                      }}
                    />
                  </Tooltip>
                </TableCell>
                
                <TableCell align="center">
                  <Tooltip title="Strategies published on marketplace">
                    <Chip 
                      icon={<Store sx={{ fontSize: '0.8rem !important' }} />}
                      label={entry.marketplaceStrategies}
                      size="small"
                      sx={{ 
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(120, 66, 66, 0.8)' 
                          : 'rgba(255, 230, 230, 0.8)'
                      }}
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Rankings updated every 24 hours based on verified trading performance
        </Typography>
      </Box>
    </Paper>
  );
};

export default Leaderboard;