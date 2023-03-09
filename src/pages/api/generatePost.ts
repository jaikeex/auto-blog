import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  });
  const openAI = new OpenAIApi(config);

  const topic = req.body.topic;
  const keywords = req.body.keywords;

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

  res.status(200).json({ post: response.data.choices[0]?.text.replaceAll('\n', '') });
};

export default handler;
