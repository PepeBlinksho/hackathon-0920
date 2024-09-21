import { useGameResource } from "../resources/useGameResource";
import { useGameStore } from "../stores/GameStore";
import { v4 as uuidv4 } from 'uuid';

export function useGameModule() {
  const gameStore = useGameStore()
  const resource = useGameResource()

  return {
    async query() {
      const res = await resource.query()
      return res.data.game
    },
    async createGame(userId: number) {
      const channelName = uuidv4()
      const res = await resource.create(channelName, userId)
      this.setGameStore(channelName, res.data.id)
    },
    async start(id: number, opponentId: number) {
      await resource.start(id, opponentId)
    },
    async draw(id: number) {
      await resource.draw(id)
    },
    async won(id: number, userId: number) {
      await resource.won(id, userId)
    },
    setGameStore(channelName: string, id: number) {
      gameStore.setGame({
        channelName,
        id,
        opponentId: null
      })
    }
  };
}
