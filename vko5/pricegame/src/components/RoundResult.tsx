import { type Player } from "../types/Player";

export function RoundResult({
  players,
  correctPrice,
}: {
  players: Player[];
  correctPrice: number;
}) {
  return (
    <div>
      <h3>Kierroksen tulos</h3>

      <p>Oikea hinta: {correctPrice} €</p>

      <ul>
        {players.map(p => (
          <li key={p.uid}>
            {p.codename}: {p.guess ?? "-"} €
            {p.guess !== null
              ? ` (ero ${Math.abs(p.guess - correctPrice)} €)`
              : " (ei arvannut)"}
          </li>
        ))}
      </ul>
    </div>
  );
}