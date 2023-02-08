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
      prompt: `What is ${req.query.prompt}`,
      max_tokens: 128,
      temperature: 0.2
    });
  
    res.status(200).json(completion.data.choices[0].text);
  } catch(e:any){
    console.log(e.response.data.error.message);
    return res
      .status(500)
      .send({completion: "false"});
  }
}
