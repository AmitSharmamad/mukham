import apiClient from '../utils/api';

export interface OHLC {
  time: number; // Unix timestamp in seconds
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface CandlestickData {
  exchange_security_id: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
}

export interface InstrumentData {
  id: string;
  name: string;
  exchange: string;
  symbol: string;
  ohlcData: OHLC[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface InstrumentCandlesticksResponse {
  data: {
    open: number[];
    high: number[];
    low: number[];
    close: number[];
    volume: number[];
    timestamp: (string | number)[];
  };
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
}

/**
 * Get processed instrument data in a format ready for charts
 */
export const getInstrumentData = async (instrumentId: number | string): Promise<InstrumentData> => {
  try {
    const response = await apiClient.get(`/instrument/${instrumentId}`);
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error('Failed to fetch instrument data');
  } catch (error) {
    console.error('Error fetching instrument data:', error);
    throw error;
  }
};

/**
 * Fetches candlestick data for an instrument and transforms it to the format required by lightweight-charts
 * @param instrumentId The ID of the instrument to fetch data for
 * @param page The page number to fetch (default: 1)
 * @param pageSize The number of items per page (default: 100)
 */
export const getInstrumentCandlesticks = async (
  instrumentId: number | string, 
  page: number = 1, 
  pageSize: number = 100
): Promise<{
  data: OHLC[],
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  }
}> => {
  try {
    console.log(`Fetching instrument data for ID: ${instrumentId}, page: ${page}, pageSize: ${pageSize}`);
    const response = await apiClient.get<InstrumentCandlesticksResponse>(
      `/instrument/${instrumentId}`,
      { params: { page, page_size: pageSize } }
    );
    
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.data) {
      const { open, high, low, close, volume, timestamp } = response.data.data;
      
      // Validate that all arrays have the same length
      const dataLength = open.length;
      if (!dataLength || 
          high.length !== dataLength || 
          low.length !== dataLength || 
          close.length !== dataLength || 
          volume.length !== dataLength || 
          timestamp.length !== dataLength) {
        console.error('API returned inconsistent data array lengths');
        throw new Error('Instrument data is incomplete or malformed');
      }
      
      const result: OHLC[] = [];
      
      // Transform from array-based format to object-based format expected by the chart
      for (let i = 0; i < dataLength; i++) {
        // Convert timestamp to Unix timestamp in seconds
        let timeValue: number;
        const currentTimestamp = timestamp[i];
        
        if (typeof currentTimestamp === 'string') {
          // Handle ISO date string
          try {
            timeValue = Math.floor(new Date(currentTimestamp).getTime() / 1000);
            // If the date is invalid, it will be NaN
            if (isNaN(timeValue)) {
              console.warn(`Invalid timestamp string: ${currentTimestamp}, using current time`);
              timeValue = Math.floor(Date.now() / 1000);
            }
          } catch (e) {
            console.error(`Error parsing timestamp: ${currentTimestamp}`, e);
            timeValue = Math.floor(Date.now() / 1000);
          }
        } else if (typeof currentTimestamp === 'number') {
          // If timestamp is already a number (Unix timestamp)
          // Check if it's in milliseconds (13 digits) and convert to seconds if needed
          timeValue = currentTimestamp > 10000000000 
            ? Math.floor(currentTimestamp / 1000) 
            : currentTimestamp;
        } else {
          console.warn(`Unknown timestamp format: ${currentTimestamp}, type: ${typeof currentTimestamp}`);
          timeValue = Math.floor(Date.now() / 1000);
        }
          
        result.push({
          time: timeValue,
          open: Number(open[i]),
          high: Number(high[i]),
          low: Number(low[i]),
          close: Number(close[i]),
          volume: Number(volume[i])
        });
      }
      
      console.log(`Successfully processed ${result.length} candlestick records`);
      
      // Check if we actually have valid data
      if (result.length === 0) {
        console.warn('No valid data points were processed');
      } else {
        // Log a sample of data
        console.log('Sample data point:', result[0]);
      }
      
      return {
        data: result,
        pagination: {
          page: response.data.pagination.page,
          pageSize: response.data.pagination.page_size,
          totalItems: response.data.pagination.total_items,
          totalPages: response.data.pagination.total_pages
        }
      };
    }
    
    console.error('API response is missing data:', response.data);
    throw new Error('Failed to fetch instrument candlestick data: No data in response');
  } catch (error) {
    console.error('Error fetching instrument candlestick data:', error);
    // Ensure we return a proper error even if the catch block fails
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(`Failed to fetch instrument candlestick data: ${String(error)}`);
    }
  }
};
