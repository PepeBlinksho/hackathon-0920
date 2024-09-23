import type { Ref } from 'vue'
import Ably from 'ably'
import { defineStore } from 'pinia'

export interface AblyClientType {
  client: Ably.Realtime | null
  channel: Ably.RealtimeChannel | null
}

export const useAblyClientStore = defineStore('ablyClient', {
  state: () => {
    return {
      client: null,
      channel: null,
    } as AblyClientType
  },
  getters: {
    get() { },
  },
  actions: {
    async createAblyClient(clientId: number, mounted: Ref<boolean, boolean>) {
      this.client = new Ably.Realtime('bChQFw.-4kZ1w:htx52h3aHW2FP8wrIh6xvWIPLeMso0z8gkXj80alg8E')
      const tokenParams = await this.client.auth.createTokenRequest({ clientId: clientId.toString() })
      this.client.auth.authorize(tokenParams)
      this.client.connection.once('connected', () => {
        console.info('Connected to Ably!')
        mounted.value = true
      })
    },
    connectToChannel(
      channelName: string,
      subscribeCallback: (message: Ably.InboundMessage) => void,
      presenceCallback: (member: Ably.PresenceMessage) => void,
    ) {
      if (!this.client)
        return
      this.channel = this.client.channels.get(channelName)
      // ゲームのイベントロジック実装
      // userIdを送るようにする
      this.channel.subscribe(subscribeCallback)
      this.channel.presence.subscribe(presenceCallback)
      this.channel.presence.enter()
    },
    // ゲーム終了時
    leaveChannel() {
      this.channel?.unsubscribe()
      this.channel?.detach()
    },
  },
})
