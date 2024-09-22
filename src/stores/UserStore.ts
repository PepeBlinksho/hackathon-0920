import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export interface UserType {
  id: number | null
  point: number | null
  client_secret: string
  created_at: string | null
  updated_at: string | null
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      user: {
        id: null,
        userId: '',
        point: null,
        client_secret: '',
        created_at: null,
        updated_at: null,
      } as UserType,
    }
  },
  getters: {
    get() {},
  },
  actions: {
    setUser(user: UserType) {
      this.user = user
      useStorage('userId', user.id)
    },
  },
})
