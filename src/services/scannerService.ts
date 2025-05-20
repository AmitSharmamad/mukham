import { v4 as uuidv4 } from 'uuid';

// Types
interface Scanner {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  instruments: any[];
  conditions: string[];
  isActive: boolean;
  createdAt: string;
  lastRunAt?: string;
  matchCount: number;
}

// Mock data for scanners
let scanners: Scanner[] = [
  {
    id: '1',
    name: 'Golden Crossover Detector',
    description: 'Detects when 50 EMA crosses above 200 EMA',
    timeframe: '1 Hour',
    instruments: [{ symbol: 'NIFTY', exchange: 'NSE' }],
    conditions: ['EMA(50) crosses above EMA(200)'],
    isActive: true,
    createdAt: new Date().toISOString(),
    lastRunAt: new Date().toISOString(),
    matchCount: 3
  },
  {
    id: '2',
    name: 'RSI Oversold',
    description: 'Detects when RSI drops below 30',
    timeframe: '15 Minutes',
    instruments: [{ symbol: 'BANKNIFTY', exchange: 'NSE' }],
    conditions: ['RSI(14) < 30'],
    isActive: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    matchCount: 0
  },
  {
    id: '3',
    name: 'MACD Bullish Crossover',
    description: 'Detects when MACD line crosses above signal line',
    timeframe: '1 Day',
    instruments: [
      { symbol: 'RELIANCE', exchange: 'NSE' },
      { symbol: 'INFY', exchange: 'NSE' }
    ],
    conditions: ['MACD Line crosses above Signal Line'],
    isActive: true,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    lastRunAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    matchCount: 5
  }
];

// Service functions
export const getScanners = async (): Promise<Scanner[]> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(scanners);
    }, 500);
  });
};

export const getScanner = async (id: string): Promise<Scanner | undefined> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const scanner = scanners.find(s => s.id === id);
      resolve(scanner);
    }, 300);
  });
};

export const createScanner = async (scannerData: Omit<Scanner, 'id' | 'createdAt' | 'matchCount'>): Promise<Scanner> => {
  // Create a new scanner with the provided data
  const newScanner: Scanner = {
    ...scannerData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    matchCount: 0
  };
  
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      scanners = [...scanners, newScanner];
      resolve(newScanner);
    }, 700);
  });
};

export const updateScanner = async (id: string, scannerData: Partial<Scanner>): Promise<Scanner | undefined> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = scanners.findIndex(s => s.id === id);
      if (index === -1) {
        resolve(undefined);
        return;
      }
      
      const updatedScanner = {
        ...scanners[index],
        ...scannerData
      };
      
      scanners = [
        ...scanners.slice(0, index),
        updatedScanner,
        ...scanners.slice(index + 1)
      ];
      
      resolve(updatedScanner);
    }, 500);
  });
};

export const deleteScanner = async (id: string): Promise<boolean> => {
  // Simulate API call delay
  return new Promise((resolve) => {
    setTimeout(() => {
      const initialLength = scanners.length;
      scanners = scanners.filter(s => s.id !== id);
      resolve(scanners.length < initialLength);
    }, 400);
  });
};

export const activateScanner = async (id: string): Promise<Scanner | undefined> => {
  try {
    // In a real application, this would make an API call to the backend
    // Example of how this would work with a real API:
    // const response = await fetch(`/api/scanners/${id}/activate`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // const data = await response.json();
    // if (data.success) return data.scanner;
    
    // For now, we'll use the mock implementation
    return updateScanner(id, { isActive: true, lastRunAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error activating scanner:', error);
    throw error;
  }
};

export const deactivateScanner = async (id: string): Promise<Scanner | undefined> => {
  try {
    // In a real application, this would make an API call to the backend
    // Example of how this would work with a real API:
    // const response = await fetch(`/api/scanners/${id}/deactivate`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // const data = await response.json();
    // if (data.success) return data.scanner;
    
    // For now, we'll use the mock implementation
    return updateScanner(id, { isActive: false });
  } catch (error) {
    console.error('Error deactivating scanner:', error);
    throw error;
  }
};

export const runScannerNow = async (id: string): Promise<any> => {
  try {
    // In a real application, this would make an API call to the backend
    // Example of how this would work with a real API:
    // const response = await fetch(`/api/scanners/${id}/scan`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' }
    // });
    // const data = await response.json();
    // if (data.success) return data;
    
    // For now, we'll use a mock implementation
    const mockResults = {
      success: true,
      message: 'Scan completed successfully',
      matches: [
        { symbol: 'NIFTY', exchange: 'NSE', price: 22145.50, matchTime: new Date().toISOString() },
        { symbol: 'RELIANCE', exchange: 'NSE', price: 2560.75, matchTime: new Date().toISOString() }
      ],
      matchCount: 2
    };
    
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Update the scanner's match count
        updateScanner(id, { 
          matchCount: mockResults.matchCount,
          lastRunAt: new Date().toISOString()
        });
        resolve(mockResults);
      }, 1500);
    });
  } catch (error) {
    console.error('Error running scanner:', error);
    throw error;
  }
};

export default {
  getScanners,
  getScanner,
  createScanner,
  updateScanner,
  deleteScanner,
  activateScanner,
  deactivateScanner,
  runScannerNow
};
