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

  const postContentResponse = await openAI.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0.1,
    messages: [
      {
        role: 'system',
        content: 'You are a blog post generator.'
      },
      {
        role: 'user',
        content: `
    Write a long and detailed SEO-friendly blog post about ${topic}, 
    that targets the following comma-separated keywords: ${keywords}.
    The response should be formatted in SEO-friendly HTML,
    limited to the following HTML tags: p, h1, h2, h4, h5, h6, strong, li, ol, ul, i.`
      }
    ]
  });

  const postContent = postContentResponse.data?.choices[0]?.message.content || '';

  const postTitleResponse = await openAI.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0.1,
    messages: [
      {
        role: 'system',
        content: 'You are a blog post generator.'
      },
      {
        role: 'user',
        content: `
    Write a long and detailed SEO-friendly blog post about ${topic}, 
    that targets the following comma-separated keywords: ${keywords}.
    The response should be formatted in SEO-friendly HTML,
    limited to the following HTML tags: p, h1, h2, h4, h5, h6, strong, li, ol, ul, i.`
      },
      {
        role: 'assistant',
        content: postContent
      },
      {
        role: 'user',
        content: `Generate appropriate title for the above blog post.`
      }
    ]
  });

  const postMetaResponse = await openAI.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0.1,
    messages: [
      {
        role: 'system',
        content: 'You are a blog post generator.'
      },
      {
        role: 'user',
        content: `
    Write a long and detailed SEO-friendly blog post about ${topic}, 
    that targets the following comma-separated keywords: ${keywords}.
    The response should be formatted in SEO-friendly HTML,
    limited to the following HTML tags: p, h1, h2, h4, h5, h6, strong, li, ol, ul, i.`
      },
      {
        role: 'assistant',
        content: postContent
      },
      {
        role: 'user',
        content: `
        Generate SEO-friendly meta description content for the above blog post.`
      }
    ]
  });

  const postTitle = postTitleResponse.data?.choices[0]?.message.content || '';
  const postMeta = postMetaResponse.data?.choices[0]?.message.content || '';

  console.log(postTitle);

  const strippedTitle = postTitle.replace(/^"|"$/g, '');

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

  const post = await db.collection('posts').insertOne({
    content: postContent,
    title: strippedTitle,
    description: postMeta,
    topic,
    keywords,
    userId: userProfile._id,
    created: new Date()
  });

  res.status(200).json({ postId: post.insertedId });
};

export default withApiAuthRequired(handler);
