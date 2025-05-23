import { useState } from "react";
import { Icon } from "@iconify-icon/react";
import { cn } from "~/lib/utils";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { db } from "~/services/firebase";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


export function CreateSessionForm() {
    const navigate = useNavigate();
    const [url, setUrl] = useState<string>("");
    const [name, setName] = useState<string>("");

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
    );
}