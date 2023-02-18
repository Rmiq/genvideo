import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const ffmpeg = createFFmpeg({
  log: true,
  corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js"
});

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
	context.res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
	context.res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  
	return {
		props: {},
	};
};

const Home: NextPage = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm();

	const [generatedScript, setGeneratedScript] = useState("");
	const [generatedVideo, setGeneratedVideo] = useState("");
	const [isLoading, setIsLoading] = useState(false);

  const load = async () => {
    await ffmpeg.load();
  }

  useEffect(() => {
    load();
  }, [])

	const onSubmit = async (data: any) => {
		setIsLoading(true);
		try {
			const res = await fetch(`/api/generate-text?prompt=${data.prompt}`);
			const json = await res.json();
			const cleanResponse = json.replace("\n\n", "");
			setGeneratedScript(cleanResponse);

			try {
				const res = await fetch(`api/generate-video?topic=${data.prompt}`);
				const json = await res.json();
				setIsLoading(false);
				setGeneratedVideo(json);
        ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(json));
        // ffmpeg.FS('writeFile', 'font.woff', await fetchFile('./font.woff'));
        await ffmpeg.run('-i', 'test.mp4', '-vf', "drawtext=text='Stack Overflow':font='Times New Roman':fontcolor=white:fontsize=24:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=(h-text_h)/2", '-codec:a', 'copy', 'out.mp4');
        const dataV = ffmpeg.FS('readFile', 'out.mp4');
        const url = URL.createObjectURL(new Blob([dataV.buffer], { type: 'image/gif' }));
        setGeneratedVideo(url);

			} catch (err) {
				console.log(err);
			}
		} catch (err) {
			console.log(err);
			setGeneratedScript("Something went wrong!");
		}
	};

	return (
		<div>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className="container p-16">
				<h1 className="text-3xl font-bold">GenVideo</h1>
				<form className="flex flex-col my-8" onSubmit={handleSubmit(onSubmit)}>
					<label>Video topic</label>
					<input placeholder="i.e. bitcoin" className="input" {...register("prompt", { required: true })} />
					<input type="submit" className="btn submit my-4" value={isLoading ? "Loading..." : "Generate script"} />
				</form>
				<div className="flex">
					<div className="min-w-[50%] pr-8">
						<p>Generated script:</p>
						<textarea readOnly={true} className="textarea w-full min-h-[400px]" value={generatedScript} />
					</div>
					<div className="min-w-[50%] pl-8">
						<p>Generated video:</p>
						<video controls src={generatedVideo} className="max-w-[400px]" />
					</div>
				</div>
			</main>
		</div>
	);
};

export default Home;
