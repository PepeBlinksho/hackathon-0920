<script setup lang="ts">
import type { RemovableRef } from '@vueuse/core'
import { loadStripe } from '@stripe/stripe-js'
import { useStorage } from '@vueuse/core'
import { onMounted, reactive } from 'vue'
import { useUserModule } from '../../modules/useUserModule.ts'
import { useUserStore } from '../../stores/UserStore'

const userStore = useUserStore()
const userModule = useUserModule()
const userId: RemovableRef<number | null> = useStorage('userId', null)

export interface DataType {
  stripe: any
  stripeElements: any
  cardForm: any
  result: any
}

const data = reactive<DataType>({
  stripe: null,
  stripeElements: null,
  cardForm: null,
  result: null,
})

async function payment(event: any) {
  event.target.disabled = true
  event.target.textContent = '決済処理中'

  const elements = data.stripeElements
  if (data.stripe) {
    await data.stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: 'http://localhost:5173/',
      },
    })
  }
}

onMounted(async () => {
  data.stripe = await loadStripe('pk_test_51Op74tIfAB2tP1ySnaqwHzzWnrlu8cxh6EskQR0Vkz5xIdn3JXMAlOK1LzEEDOihALjX3aHB0V8aRzE8OV4iwkZV00qLKysZ8K')
  // ここでuserId取得してこないとuserStoreが空になってしまう
  await userModule.query(userId.value)
  const clientSecret = userStore.user.client_secret
  data.stripeElements = data.stripe.elements({
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  })
  data.cardForm = data.stripeElements.create('payment')
  data.cardForm.mount('#payment-element')
})
</script>

<template>
  <form id="payment-form">
    <div id="payment-element" />
    <button type="button" @click="payment($event)">
      カード情報を保存する
    </button>
  </form>
</template>
