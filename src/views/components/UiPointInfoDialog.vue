<template>
  <dialog id="point-info-modal" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        ポイントについて
      </h3>
      <p class="py-4">
        ポイントは今後商品と交換が可能になります<br>
        たくさん貯めておくといいことがあるかも？？
      </p>
      <div class="modal-action">
        <form method="dialog">
          <!-- if there is a button in form, it will close the modal -->
          <button class="btn">
            閉じる
          </button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
