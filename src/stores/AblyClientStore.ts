import { defineStore } from 'pinia'
import Ably from 'ably'

export type AblyClientType = {
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
    get() {}
  },
  actions: {
    createAblyClient() {
      this.client = new Ably.Realtime('bChQFw.-4kZ1w:htx52h3aHW2FP8wrIh6xvWIPLeMso0z8gkXj80alg8E')
      this.client.connection.once("connected", () => {
        console.log("Connected to Ably!")
      })
    },
    connectToChannel(channelName: string) {
      if (!this.client) return
      this.channel = this.client.channels.get(channelName, {
      })
      // ゲームのイベントロジック実装
      // userIdを送るようにする
      this.channel.subscribe("MESSAGE", (message) => {
        console.log("Message received: " + message)
      });

      this.channel.publish("MESSAGE", "Here is my first message!")
      this.channel.presence.subscribe((member) => {
        console.log(member.clientId + ' entered realtime-chat');
      });
    },
    // ゲーム終了時
    leaveChannel() {
      this.channel?.unsubscribe()
    }
  },
})
