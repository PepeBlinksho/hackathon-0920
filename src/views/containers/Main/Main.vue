<script setup lang="ts">
import type { RemovableRef } from '@vueuse/core'
import { useStorage } from '@vueuse/core'
import { computed, onBeforeMount, reactive, ref, watch } from 'vue'
import { useUserModule } from '../../../modules/useUserModule'
import { useAblyClientStore } from '../../../stores/AblyClientStore'
import { useUserStore } from '../../../stores/UserStore'
import StripeForm from '../../components/StripeForm.vue'
import TicTacToe from '../../components/TicTacToe.vue'
import UiMain from '../../components/UiMain.vue'
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
  await userModule.query(userId.value)
  mounted.value = true
}

const isShowProgress = computed(() => {
  return !mounted.value || gameState.isMatching
})

watch(() => {
  return gameState.isGameFinish
}, (isGameFinish) => {
  if (isGameFinish) {
    ablyClientStore.leaveChannel()
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
  <div class="w-full h-screen">
    <div v-if="gameState.result">
      ゲーム終了画面
      result: {{ gameState.result }}
      <button class="btn btn-success" @click="goToHome">
        ホームに戻る
      </button>
    </div>
    <!-- matching -->
    <div v-else-if="gameState.isMatching">
      マッチング中
    </div>
    <!-- in gage -->
    <div v-else-if="gameState.isGameStart" class="flex flex-col gap-10">
      ゲーム中
      <div class="flex gap-4">
        <button class="btn btn-success" @click="gameFunc.drawGame(gameState)">
          引き分けにする
        </button>
      </div>
      <TicTacToe
        v-model="gameState"
        :won-game="() => gameFunc.wonGame(gameState)"
        :draw-game="() => gameFunc.drawGame(gameState)"
      />
    </div>
    <div v-else-if="mounted">
      <UiMain
        :user="userStore.$state.user"
        :start-game="() => gameFunc.startGame(gameState)"
      />
      <StripeForm :user="userStore.$state.user" />
    </div>
    <UiProgress v-if="isShowProgress" />
  </div>
</template>
