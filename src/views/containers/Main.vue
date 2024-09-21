<script setup lang="ts">
import { useUserModule } from '../../modules/useUserModule';
import { useUserStore } from '../../stores/UserStore';
import UiProgress from '../components/UiProgress.vue';
import UiMain from '../components/UiMain.vue'
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import { RemovableRef, useStorage } from '@vueuse/core';
import { useGameModule } from '../../modules/useGameModule';
import { useAblyClientStore } from '../../stores/AblyClientStore';
import { useGameStore } from '../../stores/GameStore';
import type Ably from 'ably'

type GameStateType = {
  isGameStart: boolean,
  isGameFinish: boolean,
  result:  'won' | 'lose' | 'draw' | null
}

const userStore = useUserStore()
const ablyClientStore = useAblyClientStore()
const gameStore = useGameStore()

const userModule = useUserModule()
const gameModule = useGameModule()
const userId: RemovableRef<number | null> = useStorage('userId', null)

const mounted = ref(false)
const gameState = reactive<GameStateType>({
  isGameStart: false,
  isGameFinish: false,
  result: null
})

const wonGame = async () => {
  gameState.isGameFinish = true;
  gameState.result = 'won';
  console.log('won')
  await gameModule.won(gameStore.$state.game.id!, userStore.user.id!)
}

const drawGame = async () => {
  gameState.isGameFinish = true;
  gameState.result = 'draw';
  console.log('draw')
  await gameModule.draw(gameStore.$state.game.id!)
}

// 負けの場合を実装する

const subscribeCallback = (message: Ably.InboundMessage) => {
  console.log(message)
  // this.channel.publish("MESSAGE", "Here is my first message!")
  // gameのロジックを書く
  // 受信したらゲームが動くようにする.subscribeは送信者も受信可能
}

const presenceCallback = async (member: Ably.PresenceMessage) => {
  console.log(member)
  if (gameState.isGameFinish) {
    console.log('ゲームは終了しています。')
    return
  }

  // 相手がルームに入った場合: 試合開始
  if (member.action === 'enter' && member.clientId !== userStore.user.id?.toString()) {
    gameState.isGameStart = true
    await gameModule.start(gameStore.$state.game.id!, Number(member.clientId))
    return;
  }

  // 相手が落ちた場合: 勝ち
  if (member.action === 'leave' && member.clientId !== userStore.user.id?.toString()) {
    await wonGame()
    return;
  }
}

const participateGame = (channelId: string) => {
  ablyClientStore.connectToChannel(channelId, subscribeCallback, presenceCallback)
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

watch(() => { return gameState.isGameFinish }, (isGameFinish) => {
  console.log(isGameFinish)
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
    <!-- in gage -->
    <template v-if="gameState.isGameStart">
      ゲーム中
      <button class="btn btn-info" @click="wonGame">勝ち</button>
      <button class="btn btn-success" @click="drawGame">引き分けにする</button>
    </template>
    <template v-else-if="gameState.result">
      ゲーム終了画面
      result: {{ gameState.result }}
    </template>
    <template v-else>
      <UiProgress v-if="isShowProgress" />
      <UiMain v-else :user="userStore.$state.user"
                     :startGame />
    </template>
  </div>
</template>
