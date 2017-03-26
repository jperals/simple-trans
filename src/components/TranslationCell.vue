<template>
  <td v-bind:class="{ 'non-editable': !languageId, 'msgid': !languageId }">
    <textarea class="translation"
              v-if="languageId"
              v-model="translationData[msgId]"
              @keyup="saveTranslation(languageId, msgId, $event)"
              @paste="saveTranslation(languageId, msgId, $event)"
              @delete="saveTranslation(languageId, msgId, $event)"
              :placeholder="msgId">
    </textarea>
    <textarea class="msgid"
              v-else
              v-model="msgId">
    </textarea>
    <div class="status">
      <icon name="circle-o-notch" class="spinner" v-if="unresolved"></icon>
      <icon name="check" class="checkmark" v-if="saved"></icon>
    </div>
  </td>
</template>
<style scoped>
  td {
    position: relative;
  }
  textarea {
    border: 0 none;
    resize: none;
    width: calc(100% - 2 * 12px);
    min-height: 80px;
    display: block;
    outline: none;
  }
  .status {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0 6px;
  }
  .spinner {
    color: rgba(127, 127, 127, .25);
    animation-name: infinite-spinning;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  .checkmark {
    color: rgba(63, 207, 63, .75);
    animation-name: fade-out;
    animation-duration: 3s;
    animation-delay: 2s;
    animation-fill-mode: forwards;
  }
  @keyframes fade-out {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  @keyframes infinite-spinning {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
<script>
  import Vue from 'vue'
  import 'vue-awesome/icons/check'
  import 'vue-awesome/icons/circle-o-notch'
  import Icon from 'vue-awesome/components/Icon.vue'
  Vue.component('icon', Icon)
  export default {
    props: [
      'languageId',
      'msgId',
      'translationData'
    ],
    data: function () {
      return {
        saved: false,
        unresolved: 0
      }
    },
    methods: {
      saveTranslation (language, msgid, event) {
        if (event) {
          event.preventDefault()
          this.saved = false
          this.unresolved += 1
          var headers = new Headers()
          headers.append('Content-Type', 'application/json')
          const url = 'http://localhost:3000/translate'
          const opts = {
            headers: headers,
            method: 'PUT',
            body: JSON.stringify({
              language: language,
              msgid: msgid,
              translation: event.target.value
            })
          }
          fetch(
            url,
            opts)
            .then(function (response) {
              return response.text() // Wait for ReadableStream to finish
            })
            .then(function (response) {
              this.unresolved -= 1
              this.saved = this.unresolved < 1
            }.bind(this))
        }
      }
    }
  }
</script>
