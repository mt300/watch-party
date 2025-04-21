import { initializeApp } from "firebase/app";
import {
  DocumentData,
  DocumentSnapshot,
  FieldValue,
  getFirestore,
} from "firebase/firestore";
import { FirebaseService } from "./firebase.interface";

const app = initializeApp(JSON.parse(process.env.FIREBASE_CONFIG ?? "{}"));
const db = getFirestore(app);

export { app, db };

/* create a interface of this file */

export const firebaseService: FirebaseService = {
  upsertUser: function (uid: string): Promise<void> {
    throw new Error("Function not implemented.");
  },
  createRoom: function (rid: string): Promise<void> {
    throw new Error("Function not implemented.");
  },
  getRoom: function (
    rid: string,
    callback: (doc: DocumentSnapshot<DocumentData>) => void
  ): Promise<() => void> {
    throw new Error("Function not implemented.");
  },
  getUsers: function (
    callback: (docs: DocumentData[]) => void
  ): Promise<() => void> {
    throw new Error("Function not implemented.");
  },
  getVideos: function (
    rid: string,
    callback: (docs: DocumentData[]) => void
  ): Promise<() => void> {
    throw new Error("Function not implemented.");
  },
  enterRoom: function (rid: string, uid: string): Promise<void> {
    throw new Error("Function not implemented.");
  },
  addVideo: function (
    rid: string,
    uid: string,
    vid: string,
    title?: string
  ): Promise<void> {
    throw new Error("Function not implemented.");
  },
  playVideo: function (
    rid: string,
    body: {
      startedAt?: FieldValue;
      vid?: string;
      currentTime?: number;
      playing: boolean;
    }
  ): Promise<void> {
    throw new Error("Function not implemented.");
  },
  seekVideo: function (rid: string, currentTime: number): Promise<void> {
    throw new Error("Function not implemented.");
  },
  pauseVideo: function (rid: string, currentTime?: number): Promise<void> {
    throw new Error("Function not implemented.");
  },
  stopVideo: function (rid: string): Promise<void> {
    throw new Error("Function not implemented.");
  },
  removeVideo: function (rid: string, id: string): Promise<void> {
    throw new Error("Function not implemented.");
  },
};
