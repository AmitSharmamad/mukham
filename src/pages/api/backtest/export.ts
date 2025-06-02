import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { strategy_id } = req.query;

  if (!strategy_id) {
    return res.status(400).json({ error: 'Strategy ID is required' });
  }

  try {
    // Mock Excel data generation
    // In a real implementation, you would:
    // 1. Fetch the backtest data from your database using strategy_id
    // 2. Use a library like 'exceljs' or 'xlsx' to generate the Excel file
    // 3. Return the file as a binary response

    // For now, we'll create a simple CSV-like Excel response
    const mockBacktestData = generateMockExcelData(strategy_id as string);
    
    // Set headers for Excel file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="backtest_data_${strategy_id}.xlsx"`);
    
    // Return mock Excel data (in a real implementation, this would be actual Excel binary data)
    return res.status(200).send(mockBacktestData);
    
  } catch (error) {
    console.error('Error exporting backtest data:', error);
    return res.status(500).json({ error: 'Failed to export backtest data' });
  }
}

// Mock function to generate Excel data
// In a real implementation, you would use a library like 'exceljs' to create actual Excel files
function generateMockExcelData(strategyId: string): Buffer {
  // This is a simplified CSV-like content that could be interpreted as Excel
  // In production, you'd use proper Excel generation libraries
  const csvContent = `Strategy ID,${strategyId}
Date,Instrument,Entry Price,Exit Price,Quantity,P&L,Exit Reason
2024-01-01,RELIANCE,2800,2850,10,500,Target
2024-01-02,TCS,3500,3480,15,-300,Stop Loss
2024-01-03,INFY,1800,1820,20,400,Target
2024-01-04,HDFC,1600,1580,25,-500,Stop Loss
2024-01-05,ICICIBANK,900,920,30,600,Target`;

  return Buffer.from(csvContent, 'utf-8');
}
