<template>
  <table v-if="json">
    <tr>
      <th>
        source
      </th>
      <th v-for="(translation, languageId) in json.translations">
        {{ languageId }}
      </th>
    </tr>
    <tr v-for="(msgid, index) in json.msgids" v-bind:id="getRowId(index)">
      <td class="not-editable msgid">
        <textarea disabled="true">{{ msgid }}</textarea>
      </td>
      <td v-for="(translation, language) in json.translations">
          <textarea v-model="translation[msgid]"
                    @keyup="saveTranslation(language, msgid, $event)"
                    @blur="saveTranslation(language, msgid, $event)"
                    @paste="saveTranslation(language, msgid, $event)"
                    @delete="saveTranslation(language, msgid, $event)"
                    @focus="saveTranslation(language, msgid, $event)"
                    :placeholder="msgid">
          </textarea>
      </td>
    </tr>
  </table>
</template>

<script>
  export default {
    name: 'hello',
    data () {
      return {
        json: this.getJson()
      }
    },
    methods: {
      getJson () {
        const languages = ['en', 'zh', 'de']
        var opts = {
          headers: new Headers(),
          method: 'GET'
        }
        var promises = []
        languages.forEach(function (id) {
          promises.push(new Promise(function (resolve, reject) {
            fetch('static/l10n/' + id + '.json', opts)
              .then(function (response) {
                return response.text()
              })
              .then(function (data) {
                resolve(JSON.parse(data))
              })
          }))
        })
        Promise.all(promises)
          .then(function (results) {
            var translations = {}
            var msgids = Object.keys(results[0])
            languages.forEach(function (languageId, i) {
              translations[languageId] = results[i]
            })
            this.json = {
              'msgids': msgids,
              'translations': translations
            }
          }.bind(this))
      },
      saveTranslation (language, msgid, event) {
        if (event) {
          event.preventDefault()
          console.log(msgid)
          console.log(language)
          console.log(event.target.value)
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
      },
      getRowId (index) {
        return 'msgid-' + index
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  table {
    border-collapse: collapse;
  }

  th {
    text-align: left;
  }

  td {
    border: 1px solid #eee;
    vertical-align: top;
    min-width: 200px;
  }

  td:focus {
    border-color: black;
  }

  td.not-editable {
    color: #888;
  }

  th,
  td > div,
  td > textarea {
    padding: 12px;
  }

  .msgid {
    color: black;
  }

  textarea {
    border: 0 none;
    resize: none;
    width: calc(100% - 2*12px);
    min-height: 80px;
    display: block;
    outline: none;
  }

</style>
