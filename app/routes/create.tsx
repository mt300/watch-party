import { Icon } from "@iconify-icon/react";
import type { MetaFunction } from "@remix-run/node";
import { DocumentData, setDoc, doc, Timestamp } from "firebase/firestore";
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
import { db } from "~/services/firebase";
import { useNavigate } from "react-router-dom";

export default function Create() {
    const navigate = useNavigate();
    const [room, setRoom] = useState<DocumentData>();
    const [url, setUrl] = useState<string>("");
    const [videos, setVideos] = useState<DocumentData[]>([]);
    const [name, setName] = useState<string>("");
    
    

    const fetchNewRoom = async (id: string) => {};

    const handleAddUrl = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!url) {
            Swal.fire({
                title: "Please add a youtube URL",
                icon: "error",
                showCancelButton: false,
                confirmButtonText: "OK",
            });
            return;
        }
        if (!name) {
            Swal.fire({
                title: "Please add a session name",
                icon: "error",
                showCancelButton: false,
                confirmButtonText: "OK",
            });
            return;
        }
        const id = uuidv4();
        setRoom({ id, url, name });
        try{
            // console.log("Saving on firebase", {id, url, name});
            await setDoc(doc(db, "sessions", id), {id, url, name, timestamp: 0, playing: false, updatedAt: Date.now()});
            // console.log("Room created", {id, url, name});
            navigate(`/watch/${id}`);
        }catch(e){
            console.log("Error saving on firebase",e);
            Swal.fire({
                title: "Error creating room",
                icon: "error",
                showCancelButton: false,
                confirmButtonText: "OK",
            });
        }
    };
  
    
    
    
    
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
                    
                    <div className="w-3/5  p-2 shadow-inner h-6 items-center">
                        <span>Session Name</span>
                    </div>
                    <div className="w-full outline-none text-slate-700 rounded ps-2 shadow-inner h-8 bg-white flex items-center">
                    <input
                        name="session-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Add a session name"
                        className="w-full outline-none text-slate-700 bg-transparent"
                    />
                    </div>
                    
                </div>
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
                </div>
              </form>
              
            </div>
          </div>
        </div>
      );
}