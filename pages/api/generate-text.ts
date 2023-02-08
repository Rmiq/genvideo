import type { NextApiRequest, NextApiResponse } from 'next'
const { Configuration, OpenAIApi } = require("openai");

type Data = {
  completion: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const configuration = new Configuration({
		apiKey: process.env.OPENAPI_API_KEY,
	});
	const openai = new OpenAIApi(configuration);

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `Generate 10s video transcript for ${req.query.prompt}`,
    max_tokens: 1024,
    temperature: 0.7
  });

  res.status(200).json(completion.data.choices[0].text);
}
