import { doc, onSnapshot, runTransaction, updateDoc, setDoc } from "firebase/firestore";
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

export async function createSession(sessionId: string) {
  const ref = doc(db, "sessions", sessionId);

  await setDoc(ref, {
    status: "waiting",
    players: [],
    currentProduct: null,
    correctPrice: null,
    round: 0
  });
}

export async function updateSession(
    sessionId: string,
    data: Partial<Session>
) {
    const ref = doc(db, "sessions", sessionId);
    await updateDoc(ref, data);
}

export async function updatePlayerGuess(
    sessionId: string,
    userId: string,
    guess: number
) {
  const ref = doc(db, "sessions", sessionId);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);

    if (!snap.exists()) {
      throw new Error("Session ei löydy");
    }

    const data = snap.data();
    const players = data.players ?? [];

    const currentPlayer = players.find((p: any) => p.uid === userId);

    if (currentPlayer?.guess != null) {
    console.log("❌ Guess already submitted");
    return;
    }

    const updatedPlayers = players.map((p: any) => ({
        ...p,
        guess: p.uid === userId ? guess : (p.guess ?? null)
    }));

    const allGuessed = updatedPlayers.every(
        (p: any) => typeof p.guess === "number"
    );

    console.log("UPDATED PLAYERS:", updatedPlayers);
    console.log("ALL GUESSED:", allGuessed);

    transaction.update(ref, {
      players: updatedPlayers,
      status: allGuessed ? "finished" : "playing",
      correctPrice: allGuessed && data.currentProduct
        ? data.currentProduct?.price
        : null
    });
  });
}
export async function joinSession(
  sessionId: string,
  player: {
    uid: string;
    codename: string;
    score: number;
    guess: number | null;
  }
) {
  const ref = doc(db, "sessions", sessionId);

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(ref);

    if (!snap.exists()) {
      throw new Error("Session ei löydy");
    }

    const data = snap.data();
    const players = data.players ?? [];

    const alreadyExists = players.some((p: any) => p.uid === player.uid);
    if (alreadyExists) return;

    if (players.length >= 4) {
      throw new Error("Session täynnä");
    }

    transaction.update(ref, {
      players: [...players, player]
    });
  });
}
