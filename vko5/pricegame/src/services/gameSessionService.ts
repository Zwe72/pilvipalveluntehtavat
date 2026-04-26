import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import type { Session } from "../types/Session";

export function subscribeSession(
  sessionId: string,
  callback: (data: Session | null) => void
) {
  const ref = doc(db, "sessions", sessionId);

  return onSnapshot(ref, (snap) => {
    console.log("🔥 SNAP EXISTS:", snap.exists());

    if (!snap.exists()) {
        console.log("❌ SESSION EI LÖYDY:", sessionId);
        callback(null);
        return;
    }

    const data = snap.data();
    
    console.log("SESSION UPDATE:", data);

    callback({
      ...(data as Session),
      id: snap.id
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