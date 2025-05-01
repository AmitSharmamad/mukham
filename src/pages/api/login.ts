import { NextApiRequest, NextApiResponse } from 'next';

type LoginBody = {
  username: string;
  email: string;
  password: string;
};

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

    // Here you would normally authenticate against your actual backend
    // For now, we're mocking a response

    // This is a simplified mock - in a real app, you'd validate credentials
    // against your database and generate a proper JWT token
    const mockToken = Buffer.from(`${email || username}:${Date.now()}`).toString('base64');

    // Return a successful response with token
    return res.status(200).json({
      token: mockToken,
      user: {
        id: 'user123',
        username: username || email.split('@')[0],
        email: email || `${username}@example.com`
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred' });
  }
}
