import Head from "next/head";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createFFmpeg, fetchFile, FFmpeg } from "@ffmpeg/ffmpeg";
import { GetServerSidePropsContext, NextPage } from "next/types";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const supabase = createServerSupabaseClient(context);

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      }
    };

  const { data } = await supabase.from("users").select("role");
  console.log(data);

  // Enable experimental mode for WASM
  context.res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  context.res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");

  return {
    props: {}
  };
};

let ffmpeg = {} as FFmpeg; // Empty initialziation for types

const Home: NextPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<any>({
    1: "What is Bitcoin? It's a digital",
    2: "currency that enables fast, secure",
    3: "transactions with no middleman.",
    4: "It's decentralized, meaning it's"
  }); // TO DO: Fix types for script response
  const [generatedVideo, setGeneratedVideo] = useState<string>("");
  const [generatedVideoProgress, setGeneratedVideoProgress] = useState<Number>(
    0
  );
  const [isLoading, setIsLoading] = useState(false);

  const load = async () => {
    // ffmpeg = createFFmpeg({
    // 	log: true,
    // 	progress: (params) => {
    // 		setGeneratedVideoProgress(Math.round(params.ratio * 100));
    // 	},
    // 	corePath: "https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js",
    // });
    // await ffmpeg.load();
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    setGeneratedVideoProgress(0);
    try {
      const res = await fetch(`/api/generate-text?prompt=${data.prompt}`);
      const json = await res.json();
      const script = JSON.parse(json);
      console.log(script);
      setGeneratedScript(script);

      // try {
      // 	const res = await fetch(`api/generate-video?topic=${data.prompt}`);
      // 	const video = await res.json();

      // 	// Load files
      // 	ffmpeg.FS("writeFile", "test.mp4", await fetchFile(video.url));
      // 	ffmpeg.FS("writeFile", "Roboto-Regular.ttf", await fetchFile(`${window.location}/Roboto-Regular.ttf`));

      // 	// Edit Video
      // 	const drawTexts: any = [];
      // 	const MAX_TIME = video.duration;
      // 	const MAX_SECTIONS = Object.keys(script).length;

      // 	Object.keys(script).map((key, index) => {
      // 		const startTime = (MAX_TIME * index) / MAX_SECTIONS;
      // 		const endTime = (MAX_TIME * (index + 1)) / MAX_SECTIONS;
      // 		const cleanText = script[key].replace(/\'/g, "");
      // 		drawTexts.push(
      // 			`drawtext=fontfile='Roboto-Regular.ttf':text='${cleanText}':fontcolor=white:fontsize=24:box=1:boxcolor=black@0.5:boxborderw=5:x=(w-text_w)/2:y=(h-text_h)/2:enable='between(t,${startTime},${endTime})'`
      // 		);
      // 	});

      // 	const ffmpegParams = ["-i", "test.mp4", "-vf", `[in]${drawTexts.join(",")}[out]`, "-y", "out.mp4"];
      // 	await ffmpeg.run(...ffmpegParams);

      // 	// Get edited video
      // 	const dataV = ffmpeg.FS("readFile", "out.mp4");
      // 	const url = URL.createObjectURL(new Blob([dataV.buffer], { type: "image/gif" }));
      // 	setIsLoading(false);
      // 	setGeneratedVideo(url);
      // } catch (err) {
      // 	console.log(err);
      // }
    } catch (err) {
      console.log(err);
      setGeneratedScript("Something went wrong!");
    }
    setIsLoading(false);
    setOpenCreateModal(false);
  };

  const onGenerateVideo = () => {};

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`modal ${openCreateModal && "modal-open"}`}>
        <div className="modal-box">
          <form onSubmit={handleSubmit(onSubmit)}>
            {!isLoading ? (
              <>
                <h2 className="font-bold text-2xl mb-6">
                  Generate video with AI
                </h2>
                <h3 className="font-bold text-lg my-2">
                  What is your video topic?
                </h3>

                <input
                  placeholder="i.e. bitcoin"
                  className="input input-bordered"
                  {...register("prompt", { required: true })}
                />
              </>
            ) : (
              <div className="flex justify-center flex-col items-center my-8">
                <p>Processing, it might take up to 10s...</p>
                <progress className="progress w-56 my-2"></progress>
              </div>
            )}
            <div className="modal-action">
              <input
                type="submit"
                className="btn submit"
                disabled={isLoading}
                value={"Generate"}
              />
            </div>
          </form>
        </div>
      </div>

      <div className="drawer drawer-mobile">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Main content */}
          <main className="h-screen w-full flex m-auto">
            {/* Left pane */}
            <div className="flex flex-col min-w-[60%] p-12">
              <div className="pr-8">
                <p className="pb-4">Generated script:</p>
                {Object.keys(generatedScript).length > 0 &&
                  Object.keys(generatedScript).map((key, index) => (
                    <div key={index} className="bg-slate-100 my-2 p-2 flex">
                      <input type="time" step="1" max='00:59' className="mr-2" />
                      <input type="time" step="1" className="mr-2" />
                      {/* <input
                        className="bg-slate-100 block w-full"
                        value={generatedScript[key]}
                        onChange={e => {
                          const temp = { ...generatedScript };
                          temp[key] = e.target.value;
                          setGeneratedScript(temp);
                        }}
                      /> */}
                    </div>
                  ))}
              </div>
            </div>
            {/* Right pane */}
            <div className="min-w-[40%] py-8 flex justify-center items-center border-l mb-32 bg-slate-100">
              <p>Video goes here</p>
            </div>
          </main>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-20 bg-slate-100 text-base-content">
            <li>
              <button onClick={() => setOpenCreateModal(true)}>+</button>
            </li>
          </ul>
        </div>
      </div>
      {/* Footer */}
      <div className="min-w-full fixed bottom-0 border p-8 pb-16 bg-white">
        <div className="flex items-center justify-center">
          <button onClick={onGenerateVideo}>
            <svg
              className="h-12 w-12 text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              {" "}
              <circle cx="12" cy="12" r="10" />{" "}
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
