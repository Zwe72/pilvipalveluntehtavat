import { useState, useEffect } from 'react'
import './App.css'

import LoginForm from './LoginForm';
import { auth, logout } from './authService';
import { onAuthStateChanged, type User } from 'firebase/auth';

import { RoundResult } from './components/RoundResult';
import { QuizForm } from './components/QuizForm';

import { subscribeSession, updateSession, updatePlayerGuess, joinSession} from './services/gameSessionService';
import { type Session } from './types/Session';

import { createSession } from './services/gameSessionService';
import { startGame, nextRound } from './gameController';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [codename, setCodename] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const sessionId = "pWQ8TndPALsYnoIIPahC";

  useEffect(() => {
    const init = async () => {
    await createSession(sessionId);
    };

    init();

    const unsubscribeSession = subscribeSession(sessionId, (data) => {
      console.log("🔥 FIRESTORE DATA:", data);

      if (!data) {
      console.error("❌ Session document ei löydy!");
      return;
    }

    setSession(data);
    });


    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setLoadingUser(false);

      if (firebaseUser) {
        const name = firebaseUser.email ?? "Player";
        setCodename(name);

        await joinSession(sessionId, {
          uid: firebaseUser.uid,
          codename: name,
          score: 0,
          guess: null
        });
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSession();
    };   
  }, []);

  useEffect(() => {
    if (!session) return;

    if (session.status === "waiting" && session.players.length >= 1) {
      startGame(session);
    }
  }, [session]);

  async function submitGuess(guess: number) {
    if (!session || !user) return;
    if (!session.currentProduct) return;
    if (session.status !== "playing") return;
    

    await updatePlayerGuess(session.id, user.uid, guess);
  }

  async function resetRound() {
  if (!session) return;
  await nextRound(session);
  }
  
    if (loadingUser) return <p>Ladataan käyttäjää...</p>;
    if (!user) return <LoginForm />;
    if (!session) return <p>⚠️ Session ei latautunut</p>;

  const currentPlayer = session.players?.find(p => p.uid === user.uid);
  const hasGuessed = currentPlayer?.guess != null;

  return (
    <div>
      <p>👋 Tervetuloa, {codename}</p>
      <button onClick={logout}>Kirjaudu ulos</button>

      {session.status === "playing" && !hasGuessed && (
        <QuizForm
        onSubmitGuess={submitGuess}
        players={session.players ?? []}
        currentUserId={user.uid}
        productName={session.currentProduct?.title ?? ""}
        />
      )}

      {session.status === "playing" && hasGuessed && (
        <p>⏳ Odotetaan muita pelaajia vastaamaan...</p>
      )}

      {session.status === "finished" && session.correctPrice != null && (
        <>
        <RoundResult
        players={session.players}
        correctPrice={session.correctPrice}
        />

        <button onClick={resetRound}>
          🔄 Uusi kierros
        </button>
        </>
      )}
    </div>
  );
}

export default App;
