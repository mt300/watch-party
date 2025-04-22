import { Icon } from "@iconify-icon/react";
import type { MetaFunction } from "@remix-run/node";
import { DocumentData } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { v4 as uuidv4 } from "uuid";
import { Button } from "~/components/ui/button";
import ToggleIcon from "~/components/ui/toggle-icon";
import useDebounce from "~/hooks/use-debounce";
import humanizeSeconds from "~/lib/text";
import { cn } from "~/lib/utils";
import { firebaseService } from "~/services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { db } from "~/services/firebase";


const {
  addVideo,
  createRoom,
  getRoom,
  getVideos,
  pauseVideo,
  playVideo,
  removeVideo,
  seekVideo,
  stopVideo,
} = firebaseService;

const Alert = withReactContent(Swal);
const USER_ID = uuidv4();

export const meta: MetaFunction = () => {
  return [
    { title: "Watch Party" },
    { name: "description", content: "Watch videos with everyone" },
  ];
};

export default function Index() {
  const [currentVideo, setCurrentVideo] = useState<DocumentData>();
  const [duration, setDuration] = useState<number>();
  const [muted, setMuted] = useState(true);
  const [manulSeek, setManulSeek] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState<number>(0);
  const [room, setRoom] = useState<DocumentData>();
  const [url, setUrl] = useState<string>("");
  const [videos, setVideos] = useState<DocumentData[]>([]);

  const player = useRef<ReactPlayer>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const rid = searchParams.get("rid") || "";

  const fetchNewRoom = async (id: string) => {};

  const goSeek = (roomData?: DocumentData) => {};

  const handleStartVideo = async (vid: string) => {};

  const handleAddUrl = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!url) return;
  };

  const handlePlayerReady = () => {
    setDuration(player.current?.getDuration());
    goSeek(room);
  };

  const handlePlayerProgress = (state: OnProgressProps) => {
    if (!manulSeek) setPlayedSeconds(state.playedSeconds);
  };

  const seekVideoDebounced = useDebounce((rid: string, seconds: number) => {},
  250);

  const handlePlayerSeek = async (seconds: number) => {};

  const handlePlayerEnded = async () => {};

  const handleVideoDelete = async (id: string) => {};

  useEffect(() => {
    if (!rid) {
      const newId = uuidv4();
    }
  }, [rid, setSearchParams]);
  useEffect(() => {
    console.log("start fetching data ");
    // setDoc(doc(db, "test", "123"), { hello: "world" }).then(() => {
    //   console.log("Document written successfully");
    //   Swal.fire({
    //     title: "Document written successfully",
    //     icon: "success",
    //     showCancelButton: false,
    //     confirmButtonText: "OK",
    //   });
    // }
    // ).catch((error) => {
    //   console.error("Error writing document: ", error);
    //   Swal.fire({
    //     title: "Error writing document",
    //     icon: "error",
    //     showCancelButton: false,
    //     confirmButtonText: "OK",
    //   });
    // }
    // );
  }, []);
  return (
    <div className="container mx-auto root">
      <h1 className="text-6xl font-thin text-slate-300 py-12">Watch Party</h1>
      <div className="flex items-center w-full">
        <div className="flex-none flex flex-col w-full gap-4">
          <form onSubmit={handleAddUrl}>
            <div className="rounded bg-neutral-900 w-fit">

            
            <div
              className={cn(
                "flex py-2 gap-2 items-center rounded bg-neutral-900 h-12 text-white text-sm bg-opacity-90 hover:bg-neutral-700 border border-transparent px-2 max-w-md"
              )}
            >
              <img
                src="/youtube.png"
                alt="youtube"
                className="flex-none w-10"
              />
              <div className="w-full outline-none text-slate-700 rounded px-2 shadow-inner h-8 bg-white flex items-center">
                <input
                  name="rid"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Add a youtube URL to watch with your friends"
                  className="w-full outline-none text-slate-700 bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="flex-none w-8 h-8 flex items-center justify-center hover:bg-red-600 rounded"
              >
                <Icon icon="mdi:add-circle" style={{ fontSize: 24 }} />
              </button>
            
            </div>
            <div
              className={cn(
                "flex py-2 gap-2 items-center rounded bg-neutral-900 h-12 text-white text-sm bg-opacity-90 hover:bg-neutral-700 border border-transparent px-2 max-w-md"
              )}
            >
              
              <div className="w-3/5  p-2 shadow-inner h-6 items-center">
                <span>Session Name </span>
              </div>
              <div className="w-full outline-none text-slate-700 rounded ps-2 shadow-inner h-8 bg-white flex items-center">
                <input
                  name="session-name"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Add a youtube URL to watch with your friends"
                  className="w-full outline-none text-slate-700 bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="flex-none w-8 h-8 flex items-center justify-center hover:bg-red-600 rounded"
              >
                <Icon icon="mdi:add-circle" style={{ fontSize: 24 }} />
              </button>
            </div>
            </div>
          </form>
          <div
            className={cn(`w-full flex gap-2 p-2 rounded bg-opacity-90`, {
              "bg-neutral-900": videos.length,
              "bg-slate-200 shadow-inner": !videos.length,
            })}
          >
            <div className="flex-none w-96 flex flex-col">
              {videos.map((video) => (
                <button
                  key={video.id}
                  className={`cursor-pointer h-9 p-1 pl-2 w-full flex gap-2 items-center text-white rounded justify-between ${
                    video.id === room?.vid
                      ? "border-neutral-600 bg-red-500 hover:bg-red-600"
                      : "border-transparent bg-transparent"
                  }`}
                  onClick={() => handleStartVideo(video.id)}
                >
                  <div className="w-full text-left truncate font-light text-sm">
                    {video.title || `https://youtu.be/${video.vid}`}
                  </div>
                  {video.id === room?.vid && (
                    <ToggleIcon
                      active={room?.playing}
                      from="mdi:pause-circle-filled"
                      to="mdi:play-circle-filled"
                      size={28}
                      className="flex items-center"
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="w-full">
              {!currentVideo && (
                <div
                  className={cn("pt-[56.25%] relative", {
                    "bg-black": videos.length,
                  })}
                />
              )}
              {currentVideo && (
                <div className="overflow-hidden pt-[56.25%] relative h-0 bg-black group">
                  <ReactPlayer
                    ref={player}
                    url={`https://www.youtube.com/embed/${currentVideo?.vid}`}
                    playing={room?.playing}
                    controls={false}
                    muted={muted}
                    width="100%"
                    height="100%"
                    className="absolute top-0 left-0"
                    onEnded={handlePlayerEnded}
                    onReady={handlePlayerReady}
                    onProgress={handlePlayerProgress}
                    config={{
                      youtube: {
                        playerVars: {
                          showinfo: 0,
                          controls: 0,
                          enablejsapi: 1,
                          modestbranding: 1,
                          cc_load_policy: 3,
                          iv_load_policy: 3,
                        },
                      },
                    }}
                  />
                  <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center">
                    {!room?.playing && (
                      <Button
                        className="w-24 h-24 rounded-full text-white"
                        onClick={() => handleStartVideo(currentVideo.id)}
                      >
                        <Icon icon="mdi:play" style={{ fontSize: 48 }} />
                      </Button>
                    )}
                    <Button
                      className="absolute top-4 right-4 transition-opacity opacity-0 group-hover:opacity-100 flex items-center justify-center w-12 h-12 bg-neutral-800 hover:bg-neutral-900 cursor-pointer text-white rounded"
                      onClick={() => handleVideoDelete(currentVideo.id)}
                      title="Remove video from the playlist"
                    >
                      <Icon icon="mdi:close" style={{ fontSize: 24 }} />
                    </Button>
                    <div className="absolute w-full bottom-0 transition-opacity opacity-0 group-hover:opacity-100 flex gap-3 p-2 items-center bg-gradient-to-t from-neutral-900 to-transparent">
                      <ToggleIcon
                        className="cursor-pointer text-white w-6 h-6 flex items-center justify-center flex-none"
                        onClick={() => handleStartVideo(currentVideo.id)}
                        active={room?.playing}
                        from="mdi:pause-circle-filled"
                        to="mdi:play-circle-filled"
                        size={24}
                      />
                      <div className="w-full h-5">
                        {duration && (
                          <input
                            type="range"
                            min="1"
                            max={duration}
                            value={playedSeconds}
                            onChange={(e) =>
                              handlePlayerSeek(Number(e.target.value))
                            }
                            className="w-full accent-red-500"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-none">
                        <ToggleIcon
                          className="cursor-pointer pb-[3px] text-white w-6 h-6 flex items-center justify-center"
                          onClick={() => setMuted(!muted)}
                          active={muted}
                          from="material-symbols:volume-off"
                          to="material-symbols:volume-up"
                        />
                        <div className="text-white text-xs whitespace-nowrap w-24 font-light text-right">
                          {[
                            humanizeSeconds(playedSeconds),
                            humanizeSeconds(duration),
                          ].join(" / ")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
