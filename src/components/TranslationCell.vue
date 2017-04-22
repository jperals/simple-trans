<template>
  <td v-bind:class="{ 'non-editable': !languageId, 'msgid': !languageId }">
    <textarea class="translation"
              v-if="languageId"
              v-model="translationData[msgId]"
              @keyup="change(languageId, msgId, $event)"
              @paste="change(languageId, msgId, $event)"
              @delete="change(languageId, msgId, $event)"
              :placeholder="msgId">
    </textarea>
    <textarea disabled
              class="msgid"
              v-else
              v-model="msgId">
    </textarea>
    <div class="status">
      <span v-if="unresolved" class="saving">
        <span class="message">Saving…</span>
        <icon name="circle-o-notch" class="icon spinner"></icon>
      </span>
      <span v-if="saved" class="saved">
        <span class="message">Saved</span>
        <icon name="check" class="icon"></icon>
      </span>
      <span v-if="error" class="error" v-bind:title="error">
        <span class="message">Error</span>
        <icon name="exclamation-triangle" class="icon"></icon>
      </span>
    </div>
  </td>
</template>
<style scoped>
  td {
    position: relative;
    padding: 0;
  }
  textarea {
    border: 1px solid transparent;
    background: transparent;
    resize: none;
    width: calc(100% - 2 * 12px);
    display: block;
    outline: none;
    padding: 12px;
    /*margin-left: -1px;*/
  }
  textarea:focus {
    border-color: rgba(63, 207, 63, .75);
    width: calc(100% - 2 * 12px - 1px);
  }
  .status {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0 6px;
    font-size: 14px;
  }
  .status .saving {
    color: rgba(127, 127, 127, .25);
  }
  .status .saved {
    color: rgba(63, 207, 63, .75);
    animation-name: fade-out;
    animation-duration: 3s;
    animation-delay: 2s;
    animation-fill-mode: forwards;
  }
  .status .error {
    color: rgba(207, 63, 63, .75);
  }
  .status .message {
    line-height: 14px;
    vertical-align: bottom;
  }
  .status .icon {
    vertical-align: middle;
    height: 14px;
    width: 14px;
  }
  .spinner {
    animation-name: infinite-spinning;
    animation-duration: 1s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
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
  import 'vue-awesome/icons/exclamation-triangle'
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
        error: false,
        saved: false,
        unresolved: 0
      }
    },
    mounted: function () {
      this.autosize()
    },
    methods: {
      change (language, msgid, event) {
        this.autosize()
        this.saveTranslation(language, msgid, event)
      },
      saveTranslation (language, msgid, event) {
        if (event) {
          this.autosize()
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
            .catch(function (error) {
              this.unresolved -= 1
              this.error = error
            }.bind(this))
        }
      },
      autosize () {
        var textarea = this.$el.querySelector('textarea')
        var height = textarea.scrollHeight - 24 + 'px'
        textarea.style.height = height
      }
    }
  }
</script>
