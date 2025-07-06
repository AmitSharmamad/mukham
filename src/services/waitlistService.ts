import axios from 'axios';

interface WaitlistRequest {
  email: string;
}

interface WaitlistResponse {
  message: string;
  email: string;
}

export const joinWaitlist = async (email: string): Promise<WaitlistResponse> => {
  try {
    const response = await axios.post('/api/waitlist', {
      email
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to join waitlist');
    }
    throw new Error('An unexpected error occurred');
  }
};
