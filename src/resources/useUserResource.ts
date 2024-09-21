import axios from "axios";

export function useUserResource() {
  return {
    async query() {
      const url = 'https://nogame-f18ee607639d.herokuapp.com/api/user.json';
      return axios.get(url);
    },
  };
}
