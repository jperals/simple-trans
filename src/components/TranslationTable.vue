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
        <translation-cell :msg-id="msgid">
        </translation-cell>
      </td>
      <td v-for="(translation, language) in json.translations">
        <translation-cell :msg-id="msgid"
                          :language-id="language"
                          :translation-data="translation">
        </translation-cell>
      </td>
    </tr>
  </table>
</template>

<script>
  import TranslationCell from './TranslationCell.vue'
  export default {
    name: 'hello',
    data () {
      return {
        json: this.getJson(),
        unresolved: 0
      }
    },
    components: {
      'translation-cell': TranslationCell
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
  td > textarea {
    padding: 12px;
  }

  .msgid {
    color: black;
  }

</style>
