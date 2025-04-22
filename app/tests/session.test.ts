// session.test.ts
import { createSession } from "@/lib/firebase";

test("cria sessão com vídeo", async () => {
  const session = await createSession("abc123");
  expect(session.videoId).toBe("abc123");
});
