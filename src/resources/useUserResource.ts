import axios from "axios";

export function useUserResource() {
  return {
    async query(userId: number | null) {
      const url = `https://nogame-f18ee607639d.herokuapp.com/api/user.json?user_id=${userId}`;
      return axios.get(url);
    },
  };
}
