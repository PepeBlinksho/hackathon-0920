<script setup lang="ts">
import type { UserType } from '../../stores/UserStore'
import { computed, ref } from 'vue'
import InfoSvg from './InfoSvg.vue'

const props = defineProps<{
  user: UserType
  startGame: () => Promise<void>
}>()

const isInfoHover = ref(false)
const isPointInfoHover = ref(false)

function openModal(modalId: string) {
  const modal = document.getElementById(modalId) as HTMLDialogElement
  modal?.showModal()
}

const isBtnDisabled = computed(() => {
  return !props.user.payment_method_created
})
</script>

<template>
  <div class="w-full h-full">
    <div class="flex flex-col gap-5 prose">
      <div class="flex flex-col gap-2">
        <div
          class="cursor-pointer" @hover="isInfoHover = true"
          @click="openModal('game-info-modal')"
        >
          <div
            class="tooltip tooltip-secondary tooltip-right"
            :class="{ 'tooltip-open': isInfoHover }"
            data-tip="ゲームについて"
          >
            <InfoSvg />
          </div>
        </div>
        <h1 class="text-center mb-0">
          まる罰ゲーーーーーむ
        </h1>
      </div>
      <div class="stat py-0">
        <div
          class="stat-figure text-secondary cursor-pointer"
          @hover="isPointInfoHover = true"
          @click="openModal('point-info-modal')"
        >
          <div
            class="tooltip tooltip-secondary tooltip-left"
            :class="{ 'tooltip-open': isPointInfoHover }"
            data-tip="ポイントについて"
          >
            <InfoSvg />
          </div>
        </div>
        <div class="stat-title">
          所有Points
        </div>
        <div class="stat-value text-primary">
          {{ user.point }}
        </div>
      </div>
      <div
        v-if="isBtnDisabled"
        class="tooltip tooltip-secondary w-full"
        data-tip="カード情報登録後に対戦可能です"
      >
        <button
          class="btn btn-primary w-full btn-outline"
          :disabled="isBtnDisabled"
          @click="startGame"
        >
          対戦する
        </button>
      </div>
      <button
        v-else
        class="btn btn-primary w-full"
        :disabled="isBtnDisabled"
        @click="startGame"
      >
        対戦する
      </button>
    </div>
  </div>
</template>
