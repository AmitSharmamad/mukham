import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

type LoginBody = {
  username: string;
  email: string;
  password: string;
};

// Mock user data - in a real app, this would come from a database
const users = [
  {
    id: '1',
    email: 'demo@example.com',
    username: 'demo',
    password: 'password', // In a real app, never store plain text passwords
    name: 'Demo User'
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only process POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, email, password } = req.body as LoginBody;

    // Validate request body
    if ((!username && !email) || !password) {
      return res.status(400).json({
        message: 'Please provide either username or email, and password',
        field: !username && !email ? 'username/email' : 'password'
      });
    }

    // Find the user by username or email
    const user = users.find(u => 
      (email && u.email === email) || 
      (username && u.username === username)
    );

    // User not found or password doesn't match
    if (!user || user.password !== password) {
      return res.status(401).json({
        message: 'Invalid credentials',
        field: !user ? 'username/email' : 'password'
      });
    }

    // Generate JWT token
    const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { userId: user.id },
      SECRET_KEY,
      { expiresIn: '24h' }
    );

    // Return a successful response with token
    return res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred' });
  }
}
