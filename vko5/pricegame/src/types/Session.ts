import type { Player } from "./Player";

export type Product = {
    title: string;
    price: number;
}

export type Session = {
    id: string;
    sessionName: string;
    status: "waiting" | "playing" | "finished";
    players: Player[];
    currentRound: number;
    currentProduct: Product | null;
    correctPrice: number | null;
    createdAt: number;
    createdBy: string;
}