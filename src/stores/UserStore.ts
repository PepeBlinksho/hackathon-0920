import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid';

type UserType = {
  "id": number | null,
  "userId": string,
  "point": number | null,
  "created_at": string | null,
  "updated_at": string| null,
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: {
        "id": null,
        "userId": "",
        "point": null,
        "created_at": null,
        "updated_at": null
      } as UserType
    }
  },
  getters: {
    get() {}
  },
  actions: {
    setUserId() {
      const userId = useStorage('userId', uuidv4())
      this.user.userId = userId.value
    },
  },
})
