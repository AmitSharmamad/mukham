import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

// Mock data for scanners
let scanners = [
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Get all scanners or a specific scanner by ID
      if (req.query.id) {
        const scanner = scanners.find(s => s.id === req.query.id);
        if (!scanner) {
          return res.status(404).json({ success: false, message: 'Scanner not found' });
        }
        return res.status(200).json({ success: true, data: scanner });
      }
      return res.status(200).json({ success: true, data: scanners });

    case 'POST':
      // Create a new scanner
      try {
        const newScanner = {
          ...req.body,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          matchCount: 0
        };
        scanners = [...scanners, newScanner];
        return res.status(201).json({ success: true, data: newScanner });
      } catch (error) {
        return res.status(400).json({ success: false, message: 'Failed to create scanner' });
      }

    case 'PUT':
      // Update an existing scanner
      try {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Scanner ID is required' });
        }

        const index = scanners.findIndex(s => s.id === id);
        if (index === -1) {
          return res.status(404).json({ success: false, message: 'Scanner not found' });
        }

        const updatedScanner = {
          ...scanners[index],
          ...req.body
        };

        scanners = [
          ...scanners.slice(0, index),
          updatedScanner,
          ...scanners.slice(index + 1)
        ];

        return res.status(200).json({ success: true, data: updatedScanner });
      } catch (error) {
        return res.status(400).json({ success: false, message: 'Failed to update scanner' });
      }

    case 'DELETE':
      // Delete a scanner
      try {
        const { id } = req.query;
        if (!id) {
          return res.status(400).json({ success: false, message: 'Scanner ID is required' });
        }

        const initialLength = scanners.length;
        scanners = scanners.filter(s => s.id !== id);

        if (scanners.length === initialLength) {
          return res.status(404).json({ success: false, message: 'Scanner not found' });
        }

        return res.status(200).json({ success: true, message: 'Scanner deleted successfully' });
      } catch (error) {
        return res.status(400).json({ success: false, message: 'Failed to delete scanner' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
  }
}
