import { updateSession } from "./services/gameSessionService";
import type { Session } from "./types/Session";

const PRODUCTS = [
  { title: "iPhone 15", price: 999 },
  { title: "PS5", price: 499 },
  { title: "MacBook Air", price: 1299 }
];

export async function startGame(session: Session) {
  if (!session) return;

  const product = PRODUCTS[0];

  await updateSession(session.id, {
    status: "playing",
    currentProduct: product,
    correctPrice: null,
    round: 1
  });
}

export async function nextRound(session: Session) {
  const newRound = (session.round ?? 0) + 1;
  const nextIndex = (session.round ?? 0) % PRODUCTS.length;
  const product = PRODUCTS[nextIndex];

  await updateSession(session.id, {
    status: "playing",
    currentProduct: product,
    correctPrice: null,
    round: newRound,
    players: session.players.map(p => ({
      ...p,
      guess: null
    }))
  });
}