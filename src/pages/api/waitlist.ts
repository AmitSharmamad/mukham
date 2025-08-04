import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, nature_of_work, trading_type, experience_level, work_type, age } = req.body;

  if (!email || !nature_of_work || !trading_type || !experience_level || !work_type || !age) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Forward the request to the backend API
    const response = await axios.post('http://localhost:9090/api/waitlist', {
      email,
      nature_of_work,
      trading_type,
      experience_level,
      work_type,
      age
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Return the response from the backend
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Waitlist API error:', error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || 'Failed to join waitlist';
      return res.status(status).json({ message });
    }

    res.status(500).json({ message: 'Internal server error' });
  }
}
