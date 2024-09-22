<script setup lang="ts">
import type { GameStateType } from '../containers/Main/Main.vue'
import { onMounted, ref } from 'vue'
import { useAblyClientStore } from '../../stores/AblyClientStore'
import { useUserStore } from '../../stores/UserStore'
// import { useAbly } from './useAbly'; // 仮定: AblyのカスタムHookを作成し、それを使用

const model = defineModel<GameStateType>()

const userStore = useUserStore()
const ablyClientStore = useAblyClientStore()

const initialBoardValue = Array.from({ length: 9 }, () => null as string | null)

const board = ref<Array<string | null>>(initialBoardValue)
const myRole = ref<'X' | 'O' | null>(null)
const currentPlayer = ref<'X' | 'O' | null>(null)
const winner = ref<string | null>(null)
// const { publishMove, subscribeToMoves } = useAbly();

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

// subscribeToMoves((move) => {
//   board.value[move.index] = move.player;
//   checkWinner();
//   currentPlayer.value = currentPlayer.value === 'X' ? 'O' : 'X';
// });

function reset() {
  board.value = initialBoardValue
}

// とりあえずHOSTが先行になるようにしてる
function selectFirstPlayer() {
  const firstPlayer = Math.random() < 0.5 ? 'X' : 'O'
  currentPlayer.value = firstPlayer
  myRole.value = firstPlayer
  ablyClientStore.channel?.publish('GAME_START', {
    hostRole: firstPlayer,
  })
}

onMounted(() => {
  ablyClientStore.channel?.subscribe('GAME_START', (message) => {
    if (message.clientId === userStore.user.id?.toString())
      return

    currentPlayer.value = message.data.hostRole
    myRole.value = message.data.hostRole === 'X' ? 'O' : 'X'
  })

  ablyClientStore.channel?.subscribe('MOVE', (message) => {
    board.value[message.data.index] = message.data.player
    checkWinner()
    currentPlayer.value = message.data.player === 'X' ? 'O' : 'X'
  })

  // channelをsubscribeする
  if (model.value?.isHost) {
    selectFirstPlayer()
  }
})
</script>

<template>
  <div class="flex flex-col">
    <div class="board">
      <div v-for="(cell, index) in board" :key="index" class="cell" @click="play(index)">
        {{ cell }}
      </div>
    </div>
    <div class="btn" @click="reset">
      リセット
    </div>
    <div>
      自分のロール: {{ myRole }}
    </div>
    <div>
      現在のターン: {{ myRole === currentPlayer ? '私' : '相手' }}
    </div>
    <div v-if="winner">
      勝者: {{ winner === myRole ? '私' : '相手' }}
    </div>
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
  font-size: 2em;
  cursor: pointer;
}
</style>
