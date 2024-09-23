<script setup lang="ts">
import type { GameStateType } from '../containers/Main/Main.vue'
import { onMounted, ref } from 'vue'
import { useAblyClientStore } from '../../stores/AblyClientStore'
import { useUserStore } from '../../stores/UserStore'

const props = defineProps<{
  wonGame: () => Promise<void>
  drawGame: () => Promise<void>
}>()

const x = '×'
const o = '⚪︎'

const model = defineModel<GameStateType>()

const userStore = useUserStore()
const ablyClientStore = useAblyClientStore()

const initialBoardValue = Array.from({ length: 9 }, () => null as string | null)

const board = ref<Array<string | null>>(initialBoardValue)
const myRole = ref<'×' | '⚪︎' | null>(null)
const currentPlayer = ref<'×' | '⚪︎' | null>(null)
const winner = ref<string | null>(null)

function play(index: number) {
  if (myRole.value !== currentPlayer.value) {
    console.log('自分のターンではありません')
    return
  }

  if (!board.value[index] && !winner.value) {
    ablyClientStore.channel?.publish('MOVE', {
      index,
      player: currentPlayer.value,
    })
  }
}

function checkWinner() {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ]
  lines.forEach((line) => {
    const [a, b, c] = line
    if (
      board.value[a]
      && board.value[a] === board.value[b]
      && board.value[a] === board.value[c]
    ) {
      winner.value = board.value[a]
    }
  })
}

function selectFirstPlayer() {
  const firstPlayer = Math.random() < 0.5 ? x : o
  const rndMyRole = Math.random() < 0.5 ? x : o
  currentPlayer.value = firstPlayer
  myRole.value = rndMyRole
  ablyClientStore.channel?.publish('GAME_START', {
    hostRole: rndMyRole,
    currentPlayer: firstPlayer,
  })
}

onMounted(() => {
  ablyClientStore.channel?.subscribe('GAME_START', (message) => {
    if (message.clientId === userStore.user.id?.toString())
      return

    currentPlayer.value = message.data.currentPlayer
    myRole.value = message.data.hostRole === x ? o : x
  })

  ablyClientStore.channel?.subscribe('MOVE', async (message) => {
    board.value[message.data.index] = message.data.player
    checkWinner()
    if (winner.value === myRole.value) {
      await props.wonGame()
    }

    currentPlayer.value = message.data.player === x ? o : x
  })

  if (model.value?.isHost) {
    selectFirstPlayer()
  }
})
</script>

<template>
  <div class="flex flex-col gap-8 items-center">
    <div class="flex flex-col gap-1 prose">
      <h2 class="mb-0">
        あなたは
        <span
          :class="{
            'pb-3 text-blue-500': myRole === x,
            'text-red-600': myRole === o,
          }"
        >{{ myRole }}</span>
        です！
      </h2>
      <h3 :class="{ 'text-primary': myRole === currentPlayer }">
        {{ myRole === currentPlayer ? 'あなたの' : '相手の' }}ターンです！
      </h3>
    </div>
    <div class="flex flex-col">
      <div class="board">
        <div
          v-for="(cell, index) in board"
          :key="index"
          class="cell rounded-md"
          :class="{
            'pb-3 text-blue-500': cell === x,
            'text-red-600': cell === o,
          }"
          @click="play(index)"
        >
          {{ cell }}
        </div>
      </div>
      <div v-if="winner">
        勝者: {{ winner === myRole ? '私' : '相手' }}
      </div>
    </div>
    <button class="btn btn-primary" @click="drawGame">
      引き分けにする
    </button>
  </div>
</template>

<style>
.board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  gap: 10px;
}
.cell {
  width: 100px;
  height: 100px;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 4em;
  cursor: pointer;
}
</style>
