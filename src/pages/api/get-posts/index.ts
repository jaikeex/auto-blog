import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import clientPromise from 'lib/mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { user } = await getSession(req, res);
    const client = await clientPromise;
    const db = await client.db('autoblog');
    const userProfile = await db.collection('users').findOne({
      auth0Id: user.sub
    });

    const { lastPostDate, getNewerPosts } = req.body;

    const posts = await db
      .collection('posts')
      .find({
        userId: userProfile._id,
        created: {
          [getNewerPosts ? '$gt' : '$lt']: new Date(lastPostDate)
        }
      })
      .limit(getNewerPosts ? 0 : 2)
      .sort({ created: -1 })
      .toArray();
    res.status(200).json({ posts });
    return;
  } catch (error) {}
};

export default withApiAuthRequired(handler);
