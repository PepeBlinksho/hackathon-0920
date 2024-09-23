import type Ably from 'ably'
import type { GameStateType } from './Main.vue'
import { useGameModule } from '../../../modules/useGameModule'
import { useAblyClientStore } from '../../../stores/AblyClientStore'
import { useGameStore } from '../../../stores/GameStore'
import { useUserStore } from '../../../stores/UserStore'

export function _useGameFunc() {
  const gameStore = useGameStore()
  const userStore = useUserStore()

  const ablyClientStore = useAblyClientStore()
  const gameModule = useGameModule()

  return {
    async wonGame(gameState: GameStateType) {
      ablyClientStore.$state.channel?.publish('RESULT', {
        result: 'lose',
      })

      gameState.result = 'won'
      gameState.isGameFinish = true
      await gameModule.won(gameStore.$state.game.id!, userStore.user.id!)
    },

    async drawGame(gameState: GameStateType) {
      ablyClientStore.$state.channel?.publish('RESULT', {
        result: 'draw',
      })

      gameState.result = 'draw'
      gameState.isGameFinish = true
      await gameModule.draw(gameStore.$state.game.id!)
    },

    // 負けの場合を実装する

    async startGame(gameState: GameStateType) {
      gameState.isMatching = true
      const game = await gameModule.query()
      if (!game) {
        await this.createGame(gameState)
      }
      else {
        gameModule.setGameStore(
          game.channel_name,
          game.id,
        )

        this.participateGame(game.channel_name, gameState)
      }
    },

    participateGame(channelId: string, gameState: GameStateType) {
      ablyClientStore.connectToChannel(
        channelId,
        this.subscribeCallback(gameState),
        this.presenceCallback(gameState),
      )
    },

    async createGame(gameState: GameStateType) {
      await gameModule.createGame(userStore.user.id!)
      gameState.isHost = true
      this.participateGame(gameStore.$state.game.channelName!, gameState)
    },

    subscribeCallback(gameState: GameStateType) {
      return (message: Ably.InboundMessage) => {
        if (gameState.isGameFinish) {
          console.log('ゲームは終了しています。')
          return
        }

        if (message.name === 'RESULT' && message.clientId !== userStore.user.id?.toString()) {
          gameState.result = message.data.result
          gameState.isGameFinish = true
          return
        }

        if (message.name === 'GAME_START') {
          gameState.isMatching = false
          gameState.isGameStart = true
        }

        // this.channel.publish("MESSAGE", "Here is my first message!")
        // gameのロジックを書く
        // 受信したらゲームが動くようにする.subscribeは送信者も受信可能
      }
    },

    presenceCallback(gameState: GameStateType) {
      return async (member: Ably.PresenceMessage) => {
        if (gameState.isGameFinish) {
          console.log('ゲームは終了しています。')
          return
        }

        // 相手がルームに入った場合: 試合開始
        if (member.action === 'enter' && member.clientId !== userStore.user.id?.toString()) {
          ablyClientStore.$state.channel?.publish('GAME_START', {})

          await gameModule.start(gameStore.$state.game.id!, Number(member.clientId))
          return
        }

        // 相手が落ちた場合: 勝ち
        if (member.action === 'leave' && member.clientId !== userStore.user.id?.toString()) {
          console.log('回線落ち')
          await this.wonGame(gameState)
        }
      }
    },
  }
}
