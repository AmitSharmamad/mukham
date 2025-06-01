// filepath: /Users/amit/workspace/mukham/src/pages/api/instruments.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { exchange, segment, page = 1, pageSize = 20, query } = req.query;
    
    // Construct the API URL with query parameters
    let url = `http://localhost:8080/api/instruments/masters?`;
    
    // Add exchange parameter if provided
    if (exchange) {
      url += `exchange=${exchange}&`;
    }
    
    // Add segment parameter if provided
    if (segment) {
      url += `segment=${segment}&`;
    }
    
    // Add pagination parameters
    url += `page=${page}&pageSize=${pageSize}`;
    
    // Add search query if provided (assuming the backend API supports it)
    if (query) {
      url += `&search=${query}`;
    }
    
    // Fetch data from the external API
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return the data in the format expected by the frontend
    // Ensure data format matches what the frontend expects
    res.status(200).json({
      result: true,
      data: data.data || [],
      total: data.total || 0,
      page: data.page || parseInt(page as string),
      pageSize: data.pageSize || parseInt(pageSize as string)
    });
  } catch (error) {
    console.error('Failed to fetch instruments from backend:', error);
    
    // Return error response when backend is not available
    res.status(500).json({
      result: false,
      error: 'Failed to fetch instruments from backend',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
}
