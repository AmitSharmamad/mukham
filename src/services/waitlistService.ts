import axios from 'axios';

interface WaitlistRequest {
  email: string;
  nature_of_work: string;
  trading_type: string;
  experience_level: string;
  work_type: string;
  age: number;
}

interface WaitlistResponse {
  message: string;
  email: string;
}

export const joinWaitlist = async (data: WaitlistRequest): Promise<WaitlistResponse> => {
  try {
    const response = await axios.post('/api/waitlist', data, {
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
