<script setup lang="ts">
import { useUserModule } from '../../modules/useUserModule';
import { useUserStore } from '../../stores/UserStore';
import UiProgress from '../components/UiProgress.vue';
import UiMain from '../components/UiMain.vue'
import { computed, onBeforeMount, ref } from 'vue';
import { RemovableRef, useStorage } from '@vueuse/core';
import { useGameModule } from '../../modules/useGameModule';
import { useAblyClientStore } from '../../stores/AblyClientStore';
import { useGameStore } from '../../stores/GameStore';

const userStore = useUserStore()
const ablyClientStore = useAblyClientStore()
const gameStore = useGameStore()

const userModule = useUserModule()
const gameModule = useGameModule()
const userId: RemovableRef<number | null> = useStorage('userId', null)

const mounted = ref(false)

const participateGame = (channelId: string) => {
  ablyClientStore.connectToChannel(channelId)
}

const createGame = async () => {
  await gameModule.createGame(userStore.user.id!);
  participateGame(gameStore.$state.game.channelName!)
}

const startGame = async () => {
  const game = await gameModule.query()
  if (!game) {
    await createGame()
  }
  else {
    gameModule.setGameStore(
      game.channel_name,
      game.id
    )

    participateGame(game.channel_name)
  }
}

const isShowProgress = computed(() => {
  return !mounted;
})

onBeforeMount(async () => {
  await userModule.query(userId.value)

  if (!ablyClientStore.client) {
    await ablyClientStore.createAblyClient(userStore.user.id!)
  }

  mounted.value = true
})
</script>

<template>
  <div class="w-full h-screen">
    <UiProgress v-if="isShowProgress" />
    <UiMain v-else :user="userStore.$state.user"
                   :startGame />
  </div>
</template>
