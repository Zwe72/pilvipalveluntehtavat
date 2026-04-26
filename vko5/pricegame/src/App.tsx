import { useState, useEffect } from 'react'
import './App.css'

import LoginForm from './LoginForm';
import { auth, logout } from './authService';
import { onAuthStateChanged, type User } from 'firebase/auth';

import { RoundResult } from './components/RoundResult';
import { QuizForm } from './components/QuizForm';

import { subscribeSession, updateSession } from './services/gameSessionService';
import { type Session } from './types/Session';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [codename, setCodename] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);

  // Initialize count from localStorage on mount
  useEffect(() => {
    const sessionId = "pWQ8TndPALsYnoIIPahC";
    console.log("🧠 USING SESSION ID:", sessionId);

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) return;

      const name = firebaseUser.email ?? "Player";
      setCodename(name);
    });

    const unsubscribeSession = subscribeSession(sessionId, (data) => {
      console.log("🔥 APP SAI DATAA:", data);
      setSession(data);
    });

    return () => {
      unsubscribe();
      unsubscribeSession();
    };   
  }, []);

  useEffect(() => {
  console.log("🧠 SESSION STATE:", session);
  }, [session]);

  useEffect(() => {
    if (!session || !user) return;

    const players = session.players ?? [];

    const exists = players.some(p => p.uid === user.uid);

    if (!exists && players.length < 4) {
      const newPlayer = {
        uid: user.uid,
        codename: user.email ?? "Player",
        score: 0,
        guess: null
      };

      updateSession(session.id, {
        players: [...players, newPlayer]
      });
    }
  }, [session, user]);

  async function submitGuess(guess: number) {
    if (!session || !user) return;
    
    if (!session.currentProduct) return;

    const players = session.players ?? [];

    const updatedPlayers = players.map(p =>
      p.uid === user.uid ? { ...p, guess } : p
    );

    await updateSession(session.id, {
      players: updatedPlayers,
      status: "finished",
      correctPrice: session.currentProduct?.price ?? 0
    });
  }

    if (!user) {
      return <LoginForm />;
    }

    if (!session) {
      return <p>Ladataan peliä...</p>;
    }

  return (
    <div>
      <p>👋 Tervetuloa, {codename}</p>
      <button onClick={logout}>Kirjaudu ulos</button>

      {session.status === "playing" && (
        <QuizForm
        onSubmitGuess={submitGuess}
        players={session.players ?? []}
        currentUserId={user.uid}
        productName={session?.currentProduct?.title ?? ""}
        />
      )}

      {session.status === "finished" && session.correctPrice != null && (
        <RoundResult
        players={session.players}
        correctPrice={session.correctPrice}
        />
      )}
    </div>
  );
}

export default App;
