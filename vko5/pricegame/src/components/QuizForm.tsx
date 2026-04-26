import { useState } from 'react';
import type { Player } from '../types/Player';

interface QuizFormProps {
    players: Player[];
    currentUserId: string;
    productName: string;
    onSubmitGuess: (guess: number) => void;
}

export function QuizForm({ 
  players, 
  currentUserId, 
  onSubmitGuess, 
  productName 
}: QuizFormProps) {

    const [guess, setGuess] = useState("");

    const currentPlayer = players.find(p => p.uid === currentUserId);
    const hasGuessed = currentPlayer?.guess != null;

  return (
    <>
      <p>Arvattavan tuotteen nimi: {productName}</p>

      {hasGuessed ? (
        <p>Olet jo arvannut: {currentPlayer?.guess} €</p>
      ) : (
      <form onSubmit={e => {
          e.preventDefault();
          onSubmitGuess(Number(guess));
          setGuess("");
        }}>
        <input
          type="number"
          value={guess}
          onChange={e => setGuess(e.target.value)}
          placeholder="Arvaa hinta (€)"
          required
        />
        <button>Arvaa hinta</button>
      </form>
      )}
    </>
  );
}