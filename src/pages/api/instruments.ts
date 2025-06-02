// filepath: /Users/amit/workspace/mukham/src/pages/api/instruments.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { exchange, segment, page = 1, pageSize = 20, query } = req.query;
    
    // Construct the API URL with query parameters
    let url = `http://localhost:8010/api/instrument-master?`;
    
    // Add pagination parameters
    url += `page=${page}&pageSize=${pageSize}`;
    
    // Add exchange parameter if provided
    if (exchange) {
      url += `&exchange=${exchange}`;
    }
    
    // Add segment parameter if provided
    if (segment) {
      url += `&segment=${segment}`;
    }
    
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
    
    // Transform the data to match the frontend interface
    const transformedData = data.data?.data?.map((item: any) => ({
      exchange_security_id: item.exchange_security_id,
      exchange: item.exchange,
      segment: item.segment,
      symbol: item.symbol, // This is the actual instrument name like "Tata Elixi", "Suzlon"
      instrument: item.name || item.symbol, // Use name as instrument, fallback to symbol
      instrument_id: item.exchange_security_id, // Use exchange_security_id as instrument_id
      start_date: item.start_date,
      expiry: item.expiry
    })) || [];
    
    // Return the data in the format expected by the frontend
    res.status(200).json({
      result: true,
      data: transformedData,
      total: data.data?.totalCount || 0,
      page: data.data?.page || parseInt(page as string),
      pageSize: data.data?.pageSize || parseInt(pageSize as string)
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
