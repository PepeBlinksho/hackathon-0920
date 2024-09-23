<script setup lang="ts">
import type { UserType } from '../../stores/UserStore'
import { loadStripe } from '@stripe/stripe-js'
import { onMounted, reactive } from 'vue'

const props = defineProps<{
  user: UserType
}>()

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
  const clientSecret = props.user.client_secret
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
