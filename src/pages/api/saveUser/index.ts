import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from 'lib/mongodb';
import { Db } from 'mongodb';

async function addUser(req: NextApiRequest, res: NextApiResponse) {
  const { user } = req.body;
  if (!user) {
    return res.status(400).json({ error: 'User data is missing in the request' });
  }

  let db: Db;
  try {
    const client = await clientPromise;
    db = await client.db('autoblog');
  } catch (error) {
    return res.status(500).json({ error: 'Unable to connect to database' });
  }

  try {
    await db.collection('users').insertOne(user);
    return res.status(200).json({ message: 'User added successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error adding user to database' });
  }
}

export default addUser;
