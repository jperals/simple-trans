<template>
  <table>
    <tr>
      <th>
        Id
      </th>
      <th>
        en
      </th>
    </tr>
    <tr v-for="(translated, original) in json">
      <td>
        {{ original }}
      </td>
      <td contenteditable="true">
        {{ translated }}
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
        var opts = {
          headers: new Headers(),
          method: 'GET'
        }
        fetch('static/l10n/en.json', opts)
          .then(function (response) {
            return response.text()
          })
          .then(function (data) {
            this.json = JSON.parse(data)
          }.bind(this))
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }
</style>
