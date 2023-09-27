import { currentProfilePages } from '@/lib/current-profile-pages';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const profile = await currentProfilePages(req);
  } catch (error) {
    console.log('[MESSAGES_POST]', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
