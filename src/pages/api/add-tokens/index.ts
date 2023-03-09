import { getSession } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from 'lib/mongodb';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15'
});

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = await getSession(req, res);

  const lineItems = [
    {
      price: process.env.STRIPE_PRODUCT_PRICE_ID,
      quantity: 1
    }
  ];

  const protocol = process.env.NODE_ENV === 'development' ? 'http://' : 'https://';
  const host = req.headers.host;

  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: 'payment',
    success_url: `${protocol}${host}/success`
  });

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

  res.status(200).json({ session: checkoutSession });
};

export default handler;
