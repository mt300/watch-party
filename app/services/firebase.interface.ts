import { DocumentData, DocumentSnapshot, FieldValue } from "firebase/firestore";

export interface FirebaseService {
  /**
   * Upserts a user document in the "users" collection.
   * @param uid - The unique identifier of the user.
   */
  upsertUser(uid: string): Promise<void>;

  /**
   * Creates a room document in the "parties" collection.
   * @param rid - The unique identifier of the room.
   */
  createRoom(rid: string): Promise<void>;

  /**
   * Subscribes to a room document in the "parties" collection.
   * @param rid - The unique identifier of the room.
   * @param callback - A callback function to handle the document snapshot.
   */
  getRoom(
    rid: string,
    callback: (doc: DocumentSnapshot<DocumentData>) => void
  ): Promise<() => void>;

  /**
   * Subscribes to the "users" collection and retrieves all user documents.
   * @param callback - A callback function to handle the array of user documents.
   */
  getUsers(callback: (docs: DocumentData[]) => void): Promise<() => void>;

  /**
   * Subscribes to the "videos" subcollection of a room and retrieves all video documents.
   * @param rid - The unique identifier of the room.
   * @param callback - A callback function to handle the array of video documents.
   */
  getVideos(
    rid: string,
    callback: (docs: DocumentData[]) => void
  ): Promise<() => void>;

  /**
   * Adds a user to a room in the "users" subcollection.
   * @param rid - The unique identifier of the room.
   * @param uid - The unique identifier of the user.
   */
  enterRoom(rid: string, uid: string): Promise<void>;

  /**
   * Adds a video document to the "videos" subcollection of a room.
   * @param rid - The unique identifier of the room.
   * @param uid - The unique identifier of the user adding the video.
   * @param vid - The unique identifier of the video.
   * @param title - The title of the video (optional).
   */
  addVideo(
    rid: string,
    uid: string,
    vid: string,
    title?: string
  ): Promise<{ uid: string }>;

  /**
   * Updates the room document to play a video.
   * @param rid - The unique identifier of the room.
   * @param body - The body containing video playback details.
   */
  playVideo(
    rid: string,
    body: {
      startedAt?: FieldValue;
      vid?: string;
      currentTime?: number;
      playing: boolean;
    }
  ): Promise<void>;

  /**
   * Updates the room document to seek a video to a specific time.
   * @param rid - The unique identifier of the room.
   * @param currentTime - The current time to seek to.
   */
  seekVideo(rid: string, currentTime: number): Promise<void>;

  /**
   * Updates the room document to pause a video.
   * @param rid - The unique identifier of the room.
   * @param currentTime - The current time of the video (optional).
   */
  pauseVideo(rid: string, currentTime?: number): Promise<void>;

  /**
   * Updates the room document to stop a video.
   * @param rid - The unique identifier of the room.
   */
  stopVideo(rid: string): Promise<void>;

  /**
   * Removes a video document from the "videos" subcollection of a room.
   * @param rid - The unique identifier of the room.
   * @param id - The unique identifier of the video to remove.
   */
  removeVideo(rid: string, id: string): Promise<void>;
}
