<template>
  <tr  v-bind:id="getRowId(rowIndex)">
    <td class="msgid">
          <textarea disabled
                    class="non-editable"
                    :style="{ height: Number(cellHeight || 0) - 32 + 'px' }">{{ msgId }}</textarea>
    </td>
    <translation-cell v-for="(translation, languageId) in translations"
                      v-on:cellheight="updateHeight"
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
        cellHeights: {}
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
      updateHeight (languageId, height) {
        this.cellHeights[languageId] = height
        this.cellHeights = Object.assign({}, this.cellHeights)
      }
    },
    computed: {
      cellHeight: function () {
        let max = 0
        for (let k of Object.keys(this.cellHeights)) {
          max = Math.max(max, this.cellHeights[k])
        }
        return max
      }
    }
  }
</script>
