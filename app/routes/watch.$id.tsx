import { useLoaderData } from "@remix-run/react";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { db } from "~/services/firebase"; // ajuste para o seu path real
import {
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
} from "firebase/firestore";

// Carrega o ID da sessão (ex: watch/abc123)
export async function loader({ params }: LoaderFunctionArgs) {
  return json({ sessionId: params.id });
}

type PlayerState = {
  playing: boolean;
  played: number; // porcentagem (0-1)
  timestamp: number; // segundos
  updatedAt: number; // timestamp do último update
  url: string; // URL do vídeo
  id: string; // ID da sessão
};

export default function WatchPage() {
  const { sessionId } = useLoaderData<typeof loader>();
  const [playerState, setPlayerState] = useState<PlayerState | null>(null);
  const playerRef = useRef<ReactPlayer>(null);
  const lastSyncedTime = useRef<number>(0); // evita conflitos de sync

  useEffect(() => {
    const sessionRef = doc(db, "sessions", sessionId??'');
    // Get initial state from Firestore
    getDoc(sessionRef).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as PlayerState;
        setPlayerState(data);
        console.log("🔥 Estado inicial da sessão:", data);
      }
    });

    // Listen for changes in Firestore
    const unsub = onSnapshot(sessionRef, (docSnap) => {
      if (!docSnap.exists()) return;
      const data = docSnap.data() as PlayerState;

      // Do not update if the timestamp is too close to the last synced time
      if (Math.abs(data.timestamp - lastSyncedTime.current) > 0.3) {
        setPlayerState(data);
      }
    });

    return () => unsub();
  }, [sessionId]);

  useEffect(() => {
    if (!playerRef.current || !playerState) return;
  
    const current = playerRef.current.getCurrentTime?.() ?? 0;
    const expected = playerState.timestamp ?? 0;
  
    // If there's a big difference between the current time and the expected time, seek to the expected time
    if (Math.abs(current - expected) > 1) {
      console.log(`⏩ Seeking player de ${current.toFixed(1)}s para ${expected.toFixed(1)}s`);
      playerRef.current.seekTo(expected, "seconds");
    }
  }, [playerState?.timestamp]);

  // Envia atualizações para o Firestore
  const updateSession = async (updates: Partial<PlayerState>) => {
    const sessionRef = doc(db, "sessions", sessionId);
    const timestamp = playerRef.current?.getCurrentTime() ?? 0;
    lastSyncedTime.current = timestamp;

    await updateDoc(sessionRef, {
      ...updates,
      timestamp,
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      {playerState && (
        <ReactPlayer
          ref={playerRef}
          url={`${playerState.url??''}`} // troque pela URL da sessão
          playing={playerState.playing}
          muted={true}
          onPlay={() => updateSession({ playing: true })}
          onPause={() => updateSession({ playing: false })}
          onSeek={(seconds) => updateSession({ timestamp: seconds })}
          onProgress={({ playedSeconds }) => {
            lastSyncedTime.current = playedSeconds;
          }}
          onReady={() => {
            if (!playerRef.current) return
            const updatedAt = playerState.updatedAt ?? 0;
            const currentTime = Date.now() - updatedAt;
            const seconds = Math.floor(currentTime / 1000) + (playerState.timestamp ?? 0);
            playerRef.current.seekTo(seconds ?? 0, "seconds");
            
            
          }}
          controls
          width="80%"
          height="80%"
        />
      )}
    </div>
  );
}
