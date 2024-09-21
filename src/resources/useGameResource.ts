import axios from "axios";

export function useGameResource() {
  return {
    async query() {
      const url = 'https://nogame-f18ee607639d.herokuapp.com/api/games/fetch_waiting.json';
      return axios.get(url);
    },
    async create(channelName: string, userId: number) {
      const url = 'https://nogame-f18ee607639d.herokuapp.com/api/games.json';
      return axios.post(url, {
        "game": {
          "channel_name": channelName,
        },
        "user_id": userId
      });
    },
    async start(id: number, opponentId: number) {
      const url = `https://nogame-f18ee607639d.herokuapp.com/api/games/${id}/update_playing`;
      return axios.post(url, {
        opponent_id: opponentId
      });
    }
  };
}
