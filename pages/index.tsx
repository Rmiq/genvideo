import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { useForm } from "react-hook-form";

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
