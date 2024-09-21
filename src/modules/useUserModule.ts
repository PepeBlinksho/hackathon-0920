import { useUserResource } from "../resources/useUserResource";
import { useUserStore } from "../stores/UserStore";

export function useUserModule() {
  const userStore = useUserStore()
  const resource = useUserResource()

  return {
    async query() {
      // resourceからAPIを叩く
      const res = await resource.query()
      console.log(res.data)
      // return data;
      userStore.setUser({
        "id": 13,
        "point": 0,
        "created_at": "2024-09-21T03:41:02.913Z",
        "updated_at": "2024-09-21T03:41:02.913Z"
      })
    },
  };
}
