import { getSession } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db('autoblog');

  await db.collection('users').updateOne(
    {
      auth0Id: user.sub
    },
    {
      $inc: {
        availableTokens: 10
      },
      $setOnInsert: {
        auth0Id: user.sub
      }
    },
    {
      upsert: true
    }
  );

  res.status(200).json({ name: 'John Doe' });
};

export default handler;
