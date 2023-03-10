import type { NextApiRequest, NextApiResponse } from 'next';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import clientPromise from 'lib/mongodb';
import { ObjectId } from 'mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { user } = await getSession(req, res);
    const client = await clientPromise;
    const db = await client.db('autoblog');
    const userProfile = await db.collection('users').findOne({
      auth0Id: user.sub
    });

    const { postId } = req.body;

    await db.collection('posts').deleteOne({
      userId: userProfile._id,
      _id: new ObjectId(postId)
    });

    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
  }
  return;
};

export default withApiAuthRequired(handler);
