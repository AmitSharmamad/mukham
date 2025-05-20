import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // This is a server-side function to handle the OAuth callback
  // Extract token from query parameters
  const { token } = req.query;

  if (!token || Array.isArray(token)) {
    return res.status(400).redirect('/login?error=invalid_token');
  }

  // Redirect to our client-side handler with the token
  res.redirect(`/auth/callback?token=${token}`);
}
