import React, { useState, useEffect } from 'react';
import { Typography, Box } from '@mui/material';

interface LiveClockProps {
  color?: string;
  fontSize?: string;
}

const LiveClock: React.FC<LiveClockProps> = ({ 
  color = 'green', 
  fontSize = '1rem' 
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setTime(timeString);
    };

    // Update time immediately
    updateTime();

    // Set up interval to update every second
    const interval = setInterval(updateTime, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography
        variant="body2"
        sx={{
          color: color,
          fontSize: fontSize,
          fontFamily: 'monospace',
          fontWeight: 'bold',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          letterSpacing: '0.5px'
        }}
      >
        {time}
      </Typography>
    </Box>
  );
};

export default LiveClock;
