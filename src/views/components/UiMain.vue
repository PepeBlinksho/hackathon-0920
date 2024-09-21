<script setup lang="ts">
import { UserType } from '../../stores/UserStore';

defineProps<{
  user: UserType,
  startGame: () => Promise<void>
}>()
</script>

<template>
  <div class="w-full h-full">
    <div class="flex flex-col gap-5">
      <div>
        {{ user }}
      </div>
      <button class="btn btn-primary"
              @click="startGame">
        対戦する
      </button>
    </div>
  </div>
</template>
