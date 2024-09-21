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
      gameStore.setGame({channelName})
      await resource.create(channelName, userId)
    }
  };
}
