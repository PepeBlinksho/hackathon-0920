<script setup lang="ts">
import { useUserModule } from '../../modules/useUserModule';
import { useUserStore } from '../../stores/UserStore';
import UiProgress from '../components/UiProgress.vue';
import UiMain from '../components/UiMain.vue'
import { computed, onBeforeMount, ref } from 'vue';
import { RemovableRef, useStorage } from '@vueuse/core';

const userStore = useUserStore()
const userModule = useUserModule()
const userId: RemovableRef<number | null> = useStorage('userId', null)

const mounted = ref(false)

const isShowProgress = computed(() => {
  return !mounted;
})

onBeforeMount(async () => {
  await userModule.query(userId.value)
  mounted.value = true
})
</script>

<template>
  <div class="w-full h-screen">
    <UiProgress v-if="isShowProgress" />
    <UiMain v-else :user="userStore.$state.user" />
  </div>
</template>
