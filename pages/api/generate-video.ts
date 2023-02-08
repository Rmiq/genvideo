import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "pexels";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const client = createClient(process.env.PEXELS_API_KEY || "");
	const query = req.query.topic;
	const orientation = "portrait";

	let videoURL = "";

	await client.videos.search({ query, per_page: 1, orientation: orientation }).then((videos) => {
		videoURL = videos.videos[0].video_files[0].link;
	});

	res.status(200).json(videoURL);
}
