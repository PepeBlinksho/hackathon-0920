import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export interface UserType {
  id: number | null
  point: number | null
  client_secret: string
  payment_method_created: boolean | null
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
        payment_method_created: false,
      } as UserType,
    }
  },
  getters: {
    get() { },
  },
  actions: {
    setUser(user: UserType) {
      this.user = user
      useStorage('userId', user.id)
    },
  },
})
