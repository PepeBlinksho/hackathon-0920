<script setup lang="ts">
import type { Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js'
import type { UserType } from '../../stores/UserStore'
import { loadStripe } from '@stripe/stripe-js'
import { onMounted, reactive } from 'vue'

const props = defineProps<{
  user: UserType
}>()

interface StateType {
  stripe: Stripe | null
  stripeElements: StripeElements | null
  cardForm: StripePaymentElement | null
}

const state = reactive<StateType>({
  stripe: null,
  stripeElements: null,
  cardForm: null,
})

async function payment(event: any) {
  event.target.disabled = true
  event.target.textContent = '決済処理中'

  const elements = state.stripeElements
  if (state.stripe && elements) {
    const returnUrl = import.meta.env.MODE === 'development' ? 'http://localhost:5173/' : 'https://hackathon-2mix.web.app'
    await state.stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    })
  }
}

onMounted(async () => {
  state.stripe = await loadStripe('pk_test_51Op74tIfAB2tP1ySnaqwHzzWnrlu8cxh6EskQR0Vkz5xIdn3JXMAlOK1LzEEDOihALjX3aHB0V8aRzE8OV4iwkZV00qLKysZ8K')
  const clientSecret = props.user.client_secret
  if (!state.stripe) {
    console.log('stripeの取得ができていません')
    return
  }

  state.stripeElements = state.stripe.elements({
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  })

  state.cardForm = state.stripeElements.create('payment')
  state.cardForm.mount('#payment-element')
})
</script>

<template>
  <form id="payment-form" class="flex flex-col">
    <div id="payment-element" />
    <button
      class="btn btn-primary w-full mt-3"
      type="button"
      @click="payment($event)"
    >
      カード情報を保存する
    </button>
  </form>
</template>
