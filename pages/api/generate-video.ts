import { createClient } from "pexels";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	const client = createClient(process.env.REACT_APP_PEXELS_API_KEY || "");
	const query = req.query.topic as string;
	const orientation = "portrait";

	let videoURL = "";

	await client.videos.search({ query, per_page: 1, orientation: orientation }).then((videos) => {
    // @ts-ignore
    videoURL = videos.videos[0].video_files[videos.videos[0].video_files.length-1].link;
    // console.log(videos.videos[0].video_files)
	});

	res.status(200).json(videoURL);
}
