<template>
  <div class="index">
    <div class="main">
      <h2>My Projects</h2>
      <ul>
        <li v-for="project in projects">
          <router-link :to="project">{{ project }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
  @import './variables';

  .index {
    .main {
      h2,
      li a {
        padding-left: $grid-gutter;
        padding-right: $grid-gutter;
      }
      ul {
        list-style: none;
        padding: 0;
        li {
          border: $border-light;
          & + li {
            border-top: 0 none;
          }
          a {
            display: block;
            padding: $grid-gutter $grid-gutter;
            text-decoration: none;
            transition: background-color .3s;
            &:hover {
              background-color: $bg-highlight-subtle;
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
</style>

<script>
  import store from './store'
  export default {
    created: function () {
      store.dispatch('getProjects')
    },
    computed: {
      projects () {
        return store.state.projects
      }
    }
  }
</script>
