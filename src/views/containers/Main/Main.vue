<script setup lang="ts">
import type { RemovableRef } from '@vueuse/core'
import { useStorage } from '@vueuse/core'
import { computed, onBeforeMount, reactive, ref } from 'vue'
import { useUserModule } from '../../../modules/useUserModule'
import { useAblyClientStore } from '../../../stores/AblyClientStore'
import { useUserStore } from '../../../stores/UserStore'
import InGame from '../../components/InGame.vue'
import StripeForm from '../../components/StripeForm.vue'
import UiGameInfoDialog from '../../components/UiGameInfoDialog.vue'
import UiGameResult from '../../components/UiGameResult.vue'
import UiHome from '../../components/UiHome.vue'
import UiPointInfoDialog from '../../components/UiPointInfoDialog.vue'
import UiProgress from '../../components/UiProgress.vue'
import { _useGameFunc } from './_useGameFunc'

export interface GameStateType {
  isGameStart: boolean
  isGameFinish: boolean
  isMatching: boolean
  isHost: boolean
  result: 'won' | 'lose' | 'draw' | null
}

const userStore = useUserStore()
const ablyClientStore = useAblyClientStore()
const gameFunc = _useGameFunc()

const userModule = useUserModule()
const userId: RemovableRef<number | null> = useStorage('userId', null)

const mounted = ref(false)
const gameState = reactive<GameStateType>({
  isGameStart: false,
  isGameFinish: false,
  isMatching: false,
  isHost: false,
  result: null,
})

async function goToHome() {
  gameState.isGameFinish = false
  gameState.isGameStart = false
  gameState.isMatching = false
  gameState.isHost = false
  gameState.result = null
  mounted.value = false
  ablyClientStore.leaveChannel()
  await userModule.query(userId.value)
  mounted.value = true
}

const isShowProgress = computed(() => {
  if (!mounted.value) {
    return {
      text: 'now loading...',
    }
  }

  if (gameState.isMatching) {
    return {
      text: 'now matching...',
    }
  }

  return {
    text: '',
  }
})

onBeforeMount(async () => {
  await userModule.query(userId.value)

  if (!ablyClientStore.client) {
    await ablyClientStore.createAblyClient(userStore.user.id!, mounted)
  }
})
</script>

<template>
  <div class="w-full h-screen max-w-108 flex flex-col items-center justify-center m-auto">
    <div v-if="gameState.result">
      <UiGameResult
        :result="gameState.result"
        :go-to-home
      />
    </div>
    <!-- in gage -->
    <div v-else-if="gameState.isGameStart">
      <InGame
        v-model="gameState"
        :won-game="() => gameFunc.wonGame(gameState)"
        :draw-game="() => gameFunc.drawGame(gameState)"
      />
    </div>
    <div v-else-if="!isShowProgress.text">
      <div class="flex flex-col gap-3">
        <UiHome
          :user="userStore.$state.user"
          :start-game="() => gameFunc.startGame(gameState)"
        />
        <StripeForm
          v-if="!userStore.$state.user.payment_method_created"
          :user="userStore.$state.user"
        />
      </div>
    </div>
    <UiProgress
      v-if="isShowProgress.text"
      :text="isShowProgress.text"
    />
    <footer class="fixed bottom-0 footer footer-center text-base-content p-4">
      <aside>
        <p>Copyright © {{ new Date().getFullYear() }} - All right reserved by 2-mix</p>
      </aside>
    </footer>
    <UiPointInfoDialog />
    <UiGameInfoDialog />
  </div>
</template>
