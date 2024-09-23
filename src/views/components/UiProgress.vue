<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <div class="w-full h-screen flex items-center justify-center">
    <div class="flex flex-col gap-2 w-full items-center">
      <div class="text-xl font-extrabold text-primary">
        {{ text }}
      </div>
      <progress class="progress progress-primary w-3/4" />
    </div>
  </div>
</template>
