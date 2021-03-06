<template>
  <td ref="table-cell">
    <textarea class="translation"
              v-if="languageId"
              ref="textarea"
              @keyup="change(languageId, msgId, $event)"
              @paste="change(languageId, msgId, $event)"
              @delete="change(languageId, msgId, $event)"
              :style="{ height: Number(cellHeight || 0) - 32 + 'px' }"
              :placeholder="msgId">{{ translation }}</textarea>
    <div class="status">
      <span v-if="unresolved" class="saving">
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
  textarea:focus {
    background-color: rgb(250, 255, 250);
    outline: 1px solid rgba(63, 207, 63, .75);
    outline-offset: 0;
  }
  textarea::placeholder {
    color: rgba(0, 0, 0, .25);
  }
  .status {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 6px;
    font-size: 14px;
    pointer-events: none;
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
    margin-left: 4px;
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
  import store from './store'
  Vue.component('icon', Icon)
  export default {
    props: [
      'cellHeight',
      'languageId',
      'msgId',
      'translation'
    ],
    data: function () {
      return {
        translationCopy: this.translation,
        error: false,
        saved: false,
        unresolved: 0
      }
    },
    mounted: function () {
      this.notifyHeight()
    },
    methods: {
      change (language, msgid, event) {
        this.saveTranslation(language, msgid, event)
        this.notifyHeight()
      },
      saveTranslation (languageId, msgid, event) {
        if (event && event.target.value !== this.translation) {
          event.preventDefault()
          this.saved = false
          this.unresolved += 1
          store.dispatch('setTranslation', {
            languageId,
            msgid,
            projectId: store.state.project,
            translation: event.target.value
          })
          .then(function (response) {
            return response.text() // Wait for ReadableStream to finish
          })
          .then(function (response) {
            this.unresolved -= 1
            this.saved = this.unresolved < 1
            this.error = this.error && !this.saved
          }.bind(this))
          .catch(function (error) {
            this.unresolved -= 1
            this.error = error
          }.bind(this))
        }
      },
      notifyHeight () {
        this.$emit('cellheight', this.languageId, this.$refs.textarea.scrollHeight)
      }
    }
  }
</script>
