<template>
  <textarea class="translation"
            v-if="languageId"
            v-model="translationData[msgId]"
            @keyup="saveTranslation(languageId, msgId, $event)"
            @blur="saveTranslation(languageId, msgId, $event)"
            @paste="saveTranslation(languageId, msgId, $event)"
            @delete="saveTranslation(languageId, msgId, $event)"
            @focus="saveTranslation(languageId, msgId, $event)"
            :placeholder="msgId">
  </textarea>
  <textarea class="msgid"
            v-else
            v-model="msgId">
  </textarea>
</template>
<style scoped>
  textarea {
    border: 0 none;
    resize: none;
    width: calc(100% - 2 * 12px);
    min-height: 80px;
    display: block;
    outline: none;
  }
</style>
<script>
  export default {
    props: [
      'languageId',
      'msgId',
      'translationData'
    ],
    methods: {
      saveTranslation (language, msgid, event) {
        if (event) {
          event.preventDefault()
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
              console.log(response)
            })
        }
      }
    }
  }
</script>
