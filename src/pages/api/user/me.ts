import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

// Mock user data - in a real app, this would come from a database
const users = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'user'
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Extract the token
    const token = authHeader.substring(7);
    
    // Verify the token - in a real app, use a proper JWT secret
    const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
    
    try {
      const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
      
      // Find the user by ID - in a real app, query from database
      const user = users.find(u => u.id === decoded.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Return user data without sensitive information
      return res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      });
    } catch (error) {
      // Invalid token
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Error in /api/user/me:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}