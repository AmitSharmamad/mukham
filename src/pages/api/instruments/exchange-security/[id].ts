import { NextApiRequest, NextApiResponse } from 'next';

export interface OHLC {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Function to generate mock OHLC data for testing
function generateMockOHLCData(id: string, days: number = 30): OHLC[] {
  const data: OHLC[] = [];
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  // Base price determined by the instrument ID for consistency
  const basePrice = 100 + (parseInt(id) % 900);
  
  // Generate data for each day
  for (let i = days; i >= 0; i--) {
    const time = Math.floor((now - i * dayMs) / 1000); // Convert to seconds
    const volatility = 0.02; // 2% daily volatility
    
    // Ensure prices don't go negative
    const dailyChange = basePrice * volatility * (Math.random() * 2 - 1);
    const open = Math.max(1, basePrice + (i > 0 ? data[days - i].close - basePrice : 0));
    const close = Math.max(1, open + dailyChange);
    const high = Math.max(open, close) * (1 + Math.random() * 0.01); // Up to 1% higher
    const low = Math.min(open, close) * (1 - Math.random() * 0.01); // Up to 1% lower
    const volume = Math.floor(1000 + Math.random() * 9000); // Random volume between 1000-10000
    
    data.push({
      time,
      open,
      high,
      low,
      close,
      volume
    });
  }
  
  return data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    
    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid instrument ID'
      });
    }

    // In a real application, you would make an API call to fetch OHLC data
    // For demo purposes, we're generating mock data
    const ohlcData = generateMockOHLCData(id);
    
    // Return the instrument data
    res.status(200).json({
      success: true,
      data: {
        id,
        name: `Instrument ${id}`,
        exchange: 'NSE',
        symbol: `INSTR${id}`,
        ohlcData
      }
    });
  } catch (error) {
    console.error('Error fetching instrument data:', error);
    res.status(500).json({ 
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
