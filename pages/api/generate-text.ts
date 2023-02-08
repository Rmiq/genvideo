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
		apiKey: process.env.REACT_APP_OPENAPI_API_KEY,
	});
	const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Generate 20s video transcript for ${req.query.prompt} topic. Divide it into 4 section, each section should include the topic`,
      max_tokens: 1024,
      temperature: 0.7
    });
  
    res.status(200).json(completion.data.choices[0].text);
  } catch(e){
    console.log(e.response.data.error.message);
    return res
      .status(500)
      .send({completion: "false"});
  }
}
