import axios from 'axios'

export function useUserResource() {
  return {
    async query(userId: number | null) {
      const url = `http://localhost:3000/api/user.json?user_id=${userId || ''}`
      return axios.get(url)
    },
  }
}
