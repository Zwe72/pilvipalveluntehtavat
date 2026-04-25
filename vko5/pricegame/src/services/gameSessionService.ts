import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import type { Session } from "../types/Session";

export function subscribeSession(
  sessionId: string,
  callback: (data: any) => void
) {
  const ref = doc(db, "sessions", sessionId);

  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) return;

    callback({
      id: snap.id,
      ...snap.data()
    });
  });
}

export async function updateSession(
    sessionId: string,
    data: Partial<Session>
) {
    const ref = doc(db, "sessions", sessionId);
    await updateDoc(ref, data);
}