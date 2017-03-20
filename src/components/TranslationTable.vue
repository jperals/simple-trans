<template>
  <table v-if="json">
    <tr>
      <th>
        id
      </th>
      <th v-for="(translation, languageId) in json.translations">
        {{ languageId }}
      </th>
    </tr>
    <tr v-for="msgid in json.msgids">
      <td class="not-editable">
        <div v-html="msgid"></div>
      </td>
      <td v-for="(translation, language) in json.translations"
          contenteditable="true"
          @keyup="saveTranslation(language, msgid, $event)"
          @blur="saveTranslation(language, msgid, $event)"
          @paste="saveTranslation(language, msgid, $event)"
          @delete="saveTranslation(language, msgid, $event)"
          @focus="saveTranslation(language, msgid, $event)">
          <div v-html="translation[msgid]"></div>
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
          console.log(language)
          console.log(msgid)
          console.log(event.target.children[0].innerHTML)
        }
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

  td.not-editable {
    color: #888;
  }

  td > div {
    padding: 12px;
  }

</style>
