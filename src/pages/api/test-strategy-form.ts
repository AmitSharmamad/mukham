// This is a mock API endpoint to test the Strategy Builder form submission
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Log the request method and body for debugging
  console.log('Request method:', req.method);
  console.log('Request body:', req.body);
  
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if timeframe is correctly formatted
  const timeframe = req.body.chart_timeframe;
  const allowedTimeframes = ['1m', '3m', '5m', '10m', '15m', '30m', '1h', '1d'];
  
  if (!allowedTimeframes.includes(timeframe)) {
    return res.status(400).json({ 
      error: 'Invalid timeframe format', 
      receivedValue: timeframe,
      expectedValues: allowedTimeframes 
    });
  }
  
  // Return success response with the received data
  return res.status(200).json({ 
    success: true, 
    message: 'Strategy created successfully',
    receivedData: req.body
  });
}
