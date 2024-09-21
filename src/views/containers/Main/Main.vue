<script setup lang="ts">
import type { RemovableRef } from '@vueuse/core'
import { useStorage } from '@vueuse/core'
import { computed, onBeforeMount, reactive, ref, watch } from 'vue'
import { useUserModule } from '../../../modules/useUserModule'
import { useAblyClientStore } from '../../../stores/AblyClientStore'
import { useUserStore } from '../../../stores/UserStore'
import UiMain from '../../components/UiMain.vue'
import UiProgress from '../../components/UiProgress.vue'
import { _useGameFunc } from './_useGameFunc'

export interface GameStateType {
  isGameStart: boolean
  isGameFinish: boolean
  isMatching: boolean
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
  result: null,
})

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
    await ablyClientStore.createAblyClient(userStore.user.id!)
  }

  mounted.value = true
})
</script>

<template>
  <div class="w-full h-screen">
    <div v-if="gameState.result">
      ゲーム終了画面
      result: {{ gameState.result }}
    </div>
    <!-- matching -->
    <div v-else-if="gameState.isMatching">
      マッチング中
    </div>
    <!-- in gage -->
    <div v-else-if="gameState.isGameStart">
      ゲーム中
      <button class="btn btn-info" @click="gameFunc.wonGame(gameState)">
        勝ち
      </button>
      <button class="btn btn-success" @click="gameFunc.drawGame(gameState)">
        引き分けにする
      </button>
    </div>
    <div v-else>
      <UiMain
        :user="userStore.$state.user"
        :start-game="() => gameFunc.startGame(gameState)"
      />
    </div>
    <UiProgress v-if="isShowProgress" />
  </div>
</template>
