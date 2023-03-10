import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import clientPromise from 'lib/mongodb';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { user } = await getSession(req, res);
  const client = await clientPromise;
  const db = await client.db('autoblog');
  const userProfile = await db.collection('users').findOne({
    auth0Id: user.sub
  });

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  const openAI = new OpenAIApi(config);

  const topic = req.body.topic;
  const keywords = req.body.keywords;

  if (!topic || !keywords) {
    res.status(400);
    return;
  }

  if (topic.trim().length > 100 || keywords.trim().length > 100) {
    res.status(400);
    return;
  }

  if (!userProfile?.availableTokens) {
    res.status(403);
    return;
  }

  const response = await openAI.createCompletion({
    model: 'text-davinci-003',
    temperature: 0.1,
    max_tokens: 3600,
    prompt: `
    Write a long and detailed SEO-friendly blog post about ${topic}, 
    that targets the following comma-separated keywords: ${keywords}.
    The content should be formatted in SEO-friendly HTML.
    The response must also include appropriate HTML title and meta description content.
    The return format must be stringified JSON in the following format:
    {
      "content": post content goes here,
      "title": title goes here,
      "description": meta description goes here
    }`
  });

  await db.collection('users').updateOne(
    {
      auth0Id: user.sub
    },
    {
      $inc: {
        availableTokens: -1
      }
    }
  );

  const parsed = JSON.parse(response.data.choices[0]?.text.replaceAll('\n', ''));
  const post = await db.collection('posts').insertOne({
    title: parsed?.title,
    content: parsed?.content,
    description: parsed?.description,
    topic,
    keywords,
    userId: userProfile._id,
    created: new Date()
  });

  res.status(200).json({ postId: post.insertedId });
};

/* @ts-ignore */
export default withApiAuthRequired(handler);
