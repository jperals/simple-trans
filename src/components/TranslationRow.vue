<template>
  <tr  v-bind:id="getRowId(rowIndex)">
    <td class="msgid">
          <textarea disabled
                    class="non-editable"
                    :style="{ height: Number(cellHeight || 0) - 32 + 'px' }">{{ msgId }}</textarea>
    </td>
    <translation-cell v-for="(translation, languageId) in translations"
                      v-on:cellheight="calculateHeight"
                      :cell-height="cellHeight"
                      :key="languageId"
                      :msg-id="msgId"
                      :language-id="languageId"
                      :translation-data="translation">
    </translation-cell>
  </tr>
</template>

<script>
  import TranslationCell from './TranslationCell.vue'
  export default {
    components: {
      'translation-cell': TranslationCell
    },
    data: function () {
      return {
        cellHeight: 0
      }
    },
    props: [
      'rowIndex',
      'msgId',
      'translations'
    ],
    methods: {
      getRowId (index) {
        return 'msgid-' + index
      },
      calculateHeight (height) {
        this.cellHeight = Math.max(this.cellHeight || 0, height)
      }
    }
  }
</script>
