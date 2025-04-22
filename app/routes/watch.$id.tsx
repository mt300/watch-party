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
    // console.log("🔥 Conectando ao Firestore para a sessão:", sessionRef.firestore.toJSON());
    // Obtém estado inicial
    getDoc(sessionRef).then((docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as PlayerState;
        setPlayerState(data);
        console.log("🔥 Estado inicial da sessão:", data);
      }
    });

    // Escuta atualizações do Firestore
    const unsub = onSnapshot(sessionRef, (docSnap) => {
      if (!docSnap.exists()) return;
      const data = docSnap.data() as PlayerState;

      // Evita sobrescrever estados locais com dados atrasados
      if (Math.abs(data.timestamp - lastSyncedTime.current) > 1) {
        setPlayerState(data);
      }
    });

    return () => unsub();
  }, [sessionId]);
  useEffect(() => {
    
   
  })
//   useEffect(() => {
    
//   }, [playerState]);
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
            
            if (playerState?.playing) {
                playerRef.current.getInternalPlayer().playVideo();
            } else {
                playerRef.current.getInternalPlayer().pauseVideo();
            }
          }}
          controls
          width="80%"
          height="80%"
        />
      )}
    </div>
  );
}
