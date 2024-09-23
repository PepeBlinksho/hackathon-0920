<script setup lang="ts">
defineProps<{
  result: string
  goToHome: () => void
}>()
</script>

<template>
  <div class="flex flex-col prose">
    <h1>
      {{ result === 'won'
        ? '勝利です！！'
        : result === 'lose'
          ? '敗北です。。。'
          : '引き分けになりました' }}
    </h1>
    <button class="btn btn-primary" @click="goToHome">
      ホームに戻る
    </button>
  </div>
</template>
