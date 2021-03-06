<template>
  <div class="translation-table" v-if="json">
    <table class="header-table">
      <thead>
      <tr>
        <th class="breadcrumbs"
            :colspan="Object.keys(json.translations).length + 1">
          <router-link class="back-button" to="/">My Projects</router-link>
          /
          <span class="current">
          {{ $route.params.project }}
        </span>
        </th>
      </tr>
      <tr class="languages">
        <th>source</th>
        <th class="language-id"
            v-for="(translation, languageId) in json.translations"
            :key="languageId"
        >{{ languageId }}

        </th>
      </tr>
      <tr>
        <search-cell language-id="src"></search-cell>
        <search-cell
          v-for="(translation, languageId) in json.translations"
          :language-id="languageId"
          :key="languageId"
        ></search-cell>
      </tr>
      </thead>
    </table>
    <table class="content-table">
      <tbody :class="{ loading: loading }">
      <translation-row
        v-for="(msgid, index) in json.msgids"
        v-if="index >= firstRow && index <= firstRow + nRows"
        :key="msgid"
        :msg-id="msgid"
        :row-index="index"
        :translations="json.translations">
      </translation-row>
      </tbody>
    </table>
  </div>
</template>

<script>
  import SearchCell from './SearchCell.vue'
  import TranslationRow from './TranslationRow.vue'
  import store from './store'
  export default {
    name: 'hello',
    data () {
      return {
        firstRow: 0,
        nRows: 50
      }
    },
    created: function () {
      store.commit('setProject', this.$route.params.project)
      store.dispatch('getTranslations')
    },
    components: {
      'search-cell': SearchCell,
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
    computed: {
      json () {
        return {
          msgids: store.state.msgids,
          translations: store.state.translations
        }
      },
      loading () {
        return store.state.loading
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  @import './variables';

  .header-table {
    background-color: white;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    border-bottom: 2px solid #DDD;
  }
  .content-table {
    // Hard-coded height of the .header-table + 1px ...
    margin-top: 164px;
  }

  table {
    border-collapse: collapse;
    min-width: 100%;
  }

  thead {
    position: sticky;
    top: 0;
    background: white;
    z-index: 10;
    text-align: left;
    .breadcrumbs {
      padding: $grid-gutter*2 $grid-gutter;
    }
    .languages th {
      font-weight: normal;
      padding: $grid-gutter;
    }
    .breadcrumbs .current,
    tr.languages th.language-id {
      font-weight: bold;
    }
    .breadcrumbs a {
      text-decoration: none;
    }
  }

  td {
    padding: $grid-gutter;
  }

  tbody {
    background-color: #F5F5F5;
    &.loading {
      opacity: .5;
    }
    tr:hover {
      background-color: $bg-highlight-subtle;
      border-color: #ddd;
    }
    tr:hover td.msgid {
      background-color: $bg-highlight;
      position: relative;
    }
    td:hover {
      background-color: white;
    }
  }

  th,
  td {
    border: $border-light;
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
