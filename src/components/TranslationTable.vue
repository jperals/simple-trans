<template>
  <table v-if="json">
    <thead>
      <tr>
        <th>
          source
        </th>
        <th v-for="(translation, languageId) in json.translations">
          {{ languageId }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(msgid, index) in json.msgids" v-bind:id="getRowId(index)">
        <translation-cell :msg-id="msgid">
        </translation-cell>
        <translation-cell v-for="(translation, languageId) in json.translations"
                          :key="languageId"
                          :msg-id="msgid"
                          :language-id="languageId"
                          :translation-data="translation">
        </translation-cell>
      </tr>
    </tbody>
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

  tbody tr:hover {
    background-color: rgb(250, 250, 250);
    border-color: #ddd;
  }

  tbody tr:hover td.non-editable {
    background-color: rgb(240, 250, 250);
    position: relative;
    border-left: 2px solid rgba(63, 207, 63, .75);
  }

  td {
    border: 1px solid #eee;
    vertical-align: top;
    min-width: 200px;
  }

  td.not-editable {
    color: #888;
  }

  th {
    padding: 12px;
  }

</style>
