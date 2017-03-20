<template>
  <table>
    <tr>
      <th>
        id
      </th>
      <th v-for="(translation, languageId) in json.translations">
        {{ languageId }}
      </th>
    </tr>
    <tr v-for="key in json.msgids">
      <td class="not-editable">
        {{ key }}
      </td>
      <td v-for="translation in json.translations" contenteditable="true">
        {{ translation[key] }}
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
            console.log(results)
            var translations = {}
            var msgids = Object.keys(results[0])
            languages.forEach(function (languageId, i) {
              translations[languageId] = results[i]
            })
            this.json = {
              'msgids': msgids,
              'translations': translations
            }
            console.log(this.json)
          }.bind(this))
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
    padding: 6px;
  }
  td.not-editable {
    color: #888;
  }
</style>
