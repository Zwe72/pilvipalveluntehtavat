import { useState } from 'react';
import type { Player } from '../types/Player';

interface QuizFormProps {
    players: Player[];
    currentUserId: string;
    productName: string;
    onSubmitGuess: (guess: number) => void;
}

export function QuizForm({ onSubmitGuess, productName }: QuizFormProps) {
  const [guess, setGuess] = useState("");

  return (
    <>
      <p>Arvattavan tuotteen nimi: {productName}</p>

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
    </>
  );
}