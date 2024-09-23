<template>
  <dialog id="game-info-modal" class="modal">
    <div class="modal-box flex flex-col gap-4">
      <div>
        <h3 class="text-lg font-bold">
          ゲームの開始方法
        </h3>
        <p class="py-4">
          1. クレジットカード登録： まずはクレジットカード情報を登録してください。<br>
          2. 対戦開始： クレジットカードの登録後、画面に表示される「対戦を開始」ボタンを押してゲームを開始してください。<br>
          3. マッチング： ボタンを押すとマッチングが始まり、対戦相手が見つかるまでお待ちください。<br>
          4. ゲームスタート： 対戦相手が見つかったら、ゲームが自動的に開始されます。
        </p>
      </div>
      <div class="divider my-0" />
      <div>
        <h3 class="text-lg font-bold">
          ゲームのルール
        </h3>
        <p class="py-4">
          1. ゲームプレイ： 通常のマルバツゲームと同様に、交互にマスを選んでいきます。先に縦、横、または斜めの一列を完成させたプレイヤーが勝者となります。<br>
          <span class="text-primary">2. 引き分けオプション</span>： 対戦中、どちらも勝ちが見えない場合は、「引き分け」ボタンを押すことでゲームを引き分けにすることができます。<br>
          3. 勝敗と報酬： 勝者には<span class="text-primary">950ポイント</span>が付与され、これはゲーム内のギフトと交換可能(今後実装予定)です。敗者からは<span class="text-primary">1,000円</span>が自動で決済されます。<br>
        </p>
        <div class="text-primary mt-4">
          注意点:
          回線の切断、ブラウザタブの削除を行うと自動的に敗北判定になります。
        </div>
        <div class="divider my-0" />
      </div>
      <div>
        <h3 class="text-lg font-bold">
          引き分けについて
        </h3>
        <p class="py-4">
          引き分けの場合はどちらにも決済が発生せず、試合が終了します！<br>
          負けそうになったら積極的に引き分けにしましょう！
        </p>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
