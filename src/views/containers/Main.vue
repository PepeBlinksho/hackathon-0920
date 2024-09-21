<script setup lang="ts">
import { useUserModule } from '../../modules/useUserModule';
import { useUserStore } from '../../stores/UserStore';
import UiMain from '../components/UiMain.vue'
import { onBeforeMount, ref } from 'vue';

const userStore = useUserStore()
const userModule = useUserModule()

const mounted = ref(false)

onBeforeMount(async () => {
  // TODO: APIで登録する
  await userModule.query()
  mounted.value = true
})
</script>

<template>
  <div>
    <UiMain v-if="mounted" :user="userStore.$state" />
    <div v-else>
      loading....
    </div>
  </div>
</template>
