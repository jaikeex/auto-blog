import Cors from 'micro-cors';
import Stripe from 'stripe';
import type { NextApiRequest, NextApiResponse } from 'next';
/* @ts-ignore */
import verifyStripe from '@webdeveducation/next-verify-stripe';
import clientPromise from 'lib/mongodb';
import { getSession } from '@auth0/nextjs-auth0';

const cors = Cors({
  allowMethods: ['POST', 'HEAD']
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15'
});

export const config = {
  api: {
    bodyParser: false
  }
};

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let event: any;
  if (req.method === 'POST') {
    try {
      event = await verifyStripe({
        req,
        stripe,
        endpointSecret
      });
    } catch (error) {
      console.log('ERROR: ', error);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const auth0Id = paymentIntent.metadata.sub;
        const client = await clientPromise;
        const db = client.db('autoblog');

        await db.collection('users').updateOne(
          {
            auth0Id: auth0Id.sub
          },
          {
            $inc: {
              availableTokens: 10
            },
            $setOnInsert: {
              auth0Id: auth0Id.sub
            }
          },
          {
            upsert: true
          }
        );
      default:
        console.log('DEFAULT EVENT: ', event.type);
    }
    res.status(200).json({ received: true });
  }
};

export default handler;
