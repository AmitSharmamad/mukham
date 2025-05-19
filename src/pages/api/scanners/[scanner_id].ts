import type { NextApiRequest, NextApiResponse } from 'next';

// This file handles specific scanner operations by ID
// Most of the functionality is implemented in /api/scanners.ts
// This is just to handle specific scanner operations via a RESTful API structure

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Redirect to the main scanners endpoint with the ID from the path
  req.query.id = req.query.id || req.query.scanner_id;
  
  // Reflect the desired operation to the main scanners handler
  return require('./scanners').default(req, res);
}
