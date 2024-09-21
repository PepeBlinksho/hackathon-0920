<script setup lang="ts">
import { UserType } from '../../stores/UserStore';

defineProps<{
  user: UserType
}>()
</script>

<template>
  <div class="w-full h-full">
    <div class="flex">
      {{ user }}
    </div>
  </div>
</template>
