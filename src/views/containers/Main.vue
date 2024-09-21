<script setup lang="ts">
import { useUserStore } from '../../stores/UserStore';
import UiMain from '../components/UiMain.vue'
import { onBeforeMount } from 'vue';

const userStore = useUserStore()

onBeforeMount(() => {
  // TODO: APIで登録する
  userStore.setUserId()
})
</script>

<template>
  <UiMain />
</template>
