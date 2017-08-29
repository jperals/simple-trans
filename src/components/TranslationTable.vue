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
      <tr v-for="(msgid, index) in json.msgids" v-if="index >= firstRow && index <= firstRow + nRows" v-bind:id="getRowId(index)">
        <td class="msgid">
          <textarea disabled
                    class="non-editable">{{ msgid }}</textarea>
        </td>
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
        languages: [],
        json: this.getJson(),
        firstRow: 0,
        nRows: 50
      }
    },
    components: {
      'translation-cell': TranslationCell
    },
    mounted: function () {
      this.ticking = false
      this.scrollTolerance = 500 // How close to the end of the content must we be to load a new batch
      this.batch = 100 // How many rows do we want to load per batch
      window.addEventListener('scroll', function (e) {
        if (!this.ticking) {
          window.requestAnimationFrame(function () {
            if (this.$el && this.$el.clientHeight) {
              if (window.scrollY > this.$el.clientHeight - window.innerWidth - this.scrollTolerance) {
                this.nRows += this.batch
              }
            }
            this.ticking = false
          }.bind(this))
        }
        this.ticking = true
      }.bind(this))
    },
    methods: {
      getJson () {
        const opts = {
          headers: new Headers(),
          method: 'GET'
        }
        opts.headers.append('Content-Type', 'application/json')
        fetch('http://localhost:3000/languages', opts)
          .then(function (response) {
            return response.json()
          })
          .then(function (languages) {
            const promises = []
            languages.forEach(function (id) {
              promises.push(new Promise(function (resolve, reject) {
                fetch('static/l10n/' + id + '.json', {
                  headers: new Headers(),
                  method: 'GET'
                })
                  .then(function (response) {
                    resolve(response.json())
                  })
              }))
            })
            Promise.all(promises)
              .then(function (results) {
                const translations = {}
                const msgids = Object.keys(results[0])
                languages.forEach(function (languageId, i) {
                  translations[languageId] = results[i]
                })
                this.json = {
                  'msgids': msgids,
                  'translations': translations
                }
              }.bind(this))
          }.bind(this))
          .catch(function (err) {
            console.error(err)
          })
      },
      getRowId (index) {
        return 'msgid-' + index
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  table {
    border-collapse: collapse;
  }

  thead {
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
  }

  th,
  td {
    padding: 12px;
  }

  th {
    text-align: left;
  }

  tbody tr:hover {
    background-color: rgb(250, 250, 250);
    border-color: #ddd;
  }

  tbody tr:hover td.msgid {
    background-color: rgb(240, 250, 250);
    position: relative;
    border-left: 2px solid rgba(63, 207, 63, .75);
  }

  th, td {
    border: 1px solid #eee;
    vertical-align: top;
  }

  .msgid {
    color: #888;
  }

  td {
    position: relative;
    padding: 0;
  }

  textarea {
    border: 0 none;
    background: transparent;
    resize: none;
    width: calc(100% - 2 * 12px);
    display: block;
    outline: none;
    padding: 12px 12px 20px;
  }

</style>
