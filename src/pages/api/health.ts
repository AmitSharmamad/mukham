import type { NextApiRequest, NextApiResponse } from 'next';

// Simple health check endpoint
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Return a simple 200 OK with a message
  return res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
}
