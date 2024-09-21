import { defineStore } from 'pinia'

export type GameType = {
  "channelName": string | null,
}

export const useGameStore = defineStore('game', {
  state: () => {
    return {
      game: {
        "channelName": null,
      } as GameType
    }
  },
  getters: {
    get() {}
  },
  actions: {
    setGame(game: GameType) {
      this.game = game;
    },
    resetGame() {
      this.game.channelName = null;
    }
  },
})
