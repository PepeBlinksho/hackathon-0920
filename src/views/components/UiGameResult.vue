<script setup lang="ts">
defineProps<{
  result: string
  goToHome: () => void
}>()
</script>

<template>
  <div>
    ゲーム終了画面
    result: {{ result }}
    <button class="btn btn-success" @click="goToHome">
      ホームに戻る
    </button>
  </div>
</template>
