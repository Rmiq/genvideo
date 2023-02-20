import { createClient } from "pexels";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const client = createClient(process.env.REACT_APP_PEXELS_API_KEY || "");
	const query = req.query.topic as string;
	const orientation = "portrait";

	let url = "";
	let duration = 0;

	await client.videos.search({ query, per_page: 1, orientation: orientation }).then((videos) => {
		// @ts-ignore
		let videoFiles = videos.videos[0].video_files;
		videoFiles = videoFiles.filter((e: any) => {
			return e.quality == "sd"; // Remove HD videos to avoid OOM
		});
		console.log(videoFiles);
		url = videoFiles[0].link;
		// @ts-ignore
		duration = videos.videos[0].duration;
	});

	res.status(200).json({ duration: duration, url: url });
}
