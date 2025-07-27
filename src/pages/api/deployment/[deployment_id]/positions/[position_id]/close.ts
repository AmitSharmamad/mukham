import type { NextApiRequest, NextApiResponse } from 'next';

interface Position {
  id: number;
  deployment_id: string;
  instrument_id: number;
  quantity: number;
  entry_price: number;
  entry_time: string;
  exit_price?: number;
  exit_time?: string;
  exit_reason?: string;
  pnl?: number;
  status: 'OPEN' | 'CLOSED' | 'CANCELLED';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { deployment_id, position_id } = req.query;

  if (!deployment_id || !position_id) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required parameters: deployment_id and position_id' 
    });
  }

  // In a real application, we would look up the position and update it
  // For this mock, we'll just return a success response with the position data
  
  const closingPrice = 150.75;
  const pnl = 256.50;
  
  const closedPosition: Position = {
    id: Number(position_id),
    deployment_id: String(deployment_id),
    instrument_id: 12345,
    quantity: 10,
    entry_price: 135.25,
    entry_time: "2025-05-20T10:30:45Z",
    exit_price: closingPrice,
    exit_time: "2025-05-23T14:30:45Z",
    exit_reason: "USER_REQUESTED",
    pnl: pnl,
    status: "CLOSED",
    metadata: {
      closing_reason: "USER_REQUESTED"
    },
    created_at: "2025-05-20T10:30:45Z",
    updated_at: "2025-05-23T14:30:45Z"
  };
  
  return res.status(200).json({
    success: true,
    data: closedPosition,
    message: "Position closed successfully"
  });
}
