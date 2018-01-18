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
      <translation-row
        v-for="(msgid, index) in json.msgids"
        v-if="index >= firstRow && index <= firstRow + nRows"
        :key="index"
        :msg-id="msgid"
        :row-index="index"
        :translations="json.translations">
      </translation-row>
    </tbody>
  </table>
</template>

<script>
  import TranslationRow from './TranslationRow.vue'
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
      'translation-row': TranslationRow
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
        fetch(process.env.BACKEND_URL + '/languages', opts)
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
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  @import './variables';

  table {
    border-collapse: collapse;
    min-width: 100%;
  }

  thead {
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
  }

  td {
    padding: $grid-gutter;
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
    min-width: 150px;
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
