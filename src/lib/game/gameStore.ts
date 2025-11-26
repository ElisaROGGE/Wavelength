import { writable } from "svelte/store";
import type { Player } from "./types";

function createGameStore() {
  const { subscribe, set, update } = writable<{
    players: Player[];
  }>({
    players: []
  });

  return {
    subscribe,

    setPlayers(players: Player[]) {
      set({ players });
    },

    addPlayer(name: string) {
      update((s) => ({
        players: [...s.players, {
            name, score: 0,
            id: 0
        }]
      }));
    },

    removePlayer(index: number) {
      update((s) => ({
        players: s.players.filter((_, i) => i !== index)
      }));
    },

    updatePlayerScore(index: number, delta: number) {
      update((s) => {
        const next = s.players.map((p, i) =>
          i === index ? { ...p, score: Math.max(0, p.score + delta) } : p
        );
        return { players: next };
      });
    },

    reset() {
      set({ players: [] });
    }
  };
}

export const gameStore = createGameStore();
