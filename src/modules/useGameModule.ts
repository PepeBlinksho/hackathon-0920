import { useGameResource } from "../resources/useGameResource";
// import { useGameStore } from "../stores/GameStore";

export function useGameModule() {
  // const gameStore = useGameStore()
  const resource = useGameResource()

  return {
    async query() {
      const res = await resource.query()
      return res.data.game
    },
    async createGame(channelName: string, userId: number) {
      await resource.create(channelName, userId)
      // gameStoreに格納する
    }
  };
}
