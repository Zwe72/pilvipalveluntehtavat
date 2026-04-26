import { type Player } from "../types/Player";

export function RoundResult({
  players,
  correctPrice,
}: {
  players: Player[];
  correctPrice: number;
}) {

    const SortedPlayers = [...players]
        .filter(p => p.guess !== null)
        .sort((a, b) =>
         Math.abs(a.guess! - correctPrice) - Math.abs(b.guess! - correctPrice)
    );
    
    const winnerUid = SortedPlayers[0]?.uid;
  return (
    <div>
      <h3>Kierroksen tulos</h3>

      <p>Oikea hinta: {correctPrice} €</p>

      <ul>
        {players.map(p => {
            const isWinner = p.uid === winnerUid;

            return (
          <li key={p.uid}
          style={{fontWeight: isWinner ? "bold" : "normal" }}
          >
            {isWinner && "🏆 "}
            {p.codename}: {p.guess ?? "-"} €
            {p.guess !== null
              ? ` (ero ${Math.abs(p.guess - correctPrice)} €)`
              : " (ei arvausta)"}
          </li>
        );
        })}
      </ul>
    </div>
  );
}