import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { status } = req.query;
    
    // TODO: Replace with actual database call
    // Example: const deployments = await fetchDeploymentsFromDatabase({ status });
    
    // For now, return empty array since hardcoded data is removed
    const filteredDeployments: any[] = [];
    
    return res.status(200).json({
      success: true,
      message: 'Deployments fetched successfully',
      data: filteredDeployments
    });
  } catch (error) {
    console.error('Error fetching deployments:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
