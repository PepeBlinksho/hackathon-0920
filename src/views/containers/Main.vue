<script setup lang="ts">
import { useUserModule } from '../../modules/useUserModule';
import { useUserStore } from '../../stores/UserStore';
import UiProgress from '../components/UiProgress.vue';
import UiMain from '../components/UiMain.vue'
import { computed, onBeforeMount, ref } from 'vue';
import { RemovableRef, useStorage } from '@vueuse/core';
import { useGameModule } from '../../modules/useGameModule';
import { v4 as uuidv4 } from 'uuid';

const userStore = useUserStore()
const userModule = useUserModule()
const gameModule = useGameModule()
const userId: RemovableRef<number | null> = useStorage('userId', null)

const mounted = ref(false)

const createGame = async () => {
  await gameModule.createGame(uuidv4(), userStore.user.id!);
}

const searchGame = async () => {
  const games = await gameModule.query()
  if (!games) {
    await createGame()
  }
  else {
    // ある時の処理実装
    // gameに参加する
  }
}

const isShowProgress = computed(() => {
  return !mounted;
})

onBeforeMount(async () => {
  await userModule.query(userId.value)
  mounted.value = true
})
</script>

<template>
  <div class="w-full h-screen">
    <UiProgress v-if="isShowProgress" />
    <UiMain v-else :user="userStore.$state.user"
                   :searchGame />
  </div>
</template>
