<script setup lang="ts">
import type { RemovableRef } from '@vueuse/core'
import { loadStripe } from '@stripe/stripe-js'
import { useStorage } from '@vueuse/core'
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { useUserModule } from '../../../modules/useUserModule'
import { useAblyClientStore } from '../../../stores/AblyClientStore'
import { useUserStore } from '../../../stores/UserStore'
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

export interface DataType {
  stripe: any
  stripeElements: any
  cardForm: any
  result: any
}

const data = reactive<DataType>({
  stripe: null,
  stripeElements: null,
  cardForm: null,
  result: null,
})

async function payment(event: any) {
  event.target.disabled = true
  event.target.textContent = '決済処理中'

  const elements = data.stripeElements
  if (data.stripe) {
    await data.stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: 'http://localhost:5173/',
      },
    })
  }
}

onMounted(async () => {
  data.stripe = await loadStripe('pk_test_51Op74tIfAB2tP1ySnaqwHzzWnrlu8cxh6EskQR0Vkz5xIdn3JXMAlOK1LzEEDOihALjX3aHB0V8aRzE8OV4iwkZV00qLKysZ8K')
  // ここでuserId取得してこないとuserStoreが空になってしまう
  await userModule.query(userId.value)
  const clientSecret = userStore.user.client_secret
  data.stripeElements = data.stripe.elements({
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  })
  data.cardForm = data.stripeElements.create('payment')
  data.cardForm.mount('#payment-element')
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
    <div v-else-if="gameState.isGameStart" class="flex flex-col gap-10">
      ゲーム中
      <div class="flex gap-4">
        <button class="btn btn-info" @click="gameFunc.wonGame(gameState)">
          勝ち
        </button>
        <button class="btn btn-success" @click="gameFunc.drawGame(gameState)">
          引き分けにする
        </button>
      </div>
      <TicTacToe v-model="gameState" />
    </div>
    <div v-else>
      <UiMain
        :user="userStore.$state.user"
        :start-game="() => gameFunc.startGame(gameState)"
      />
    </div>
    <UiProgress v-if="isShowProgress" />
    <form id="payment-form">
      <div id="payment-element" />
      <button type="button" @click="payment($event)">
        カード情報を保存する
      </button>
    </form>
  </div>
</template>
