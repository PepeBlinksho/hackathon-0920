import { useUserResource } from '../resources/useUserResource'
import { useUserStore } from '../stores/UserStore'

export function useUserModule() {
  const userStore = useUserStore()
  const resource = useUserResource()

  return {
    async query(userId: number | null) {
      const res = await resource.query(userId)
      userStore.setUser(res.data.user)
    },
  }
}
