<template>
  <th>
    <input type="text"
           @keyup="change($event)"
           @paste="change($event)"
           @delete="change($event)"
           >
    <icon name="search"
          class="icon"></icon>
  </th>
</template>

<script>
  import Vue from 'vue'
  import 'vue-awesome/icons/search'
  import Icon from 'vue-awesome/components/Icon.vue'
  import store from './store'
  Vue.component('icon', Icon)
  export default {
    props: [
      'languageId'
    ],
    methods: {
      change (event) {
        store.dispatch('setFilter', {
          languageId: this.languageId,
          expression: event.target.value
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'variables';
  $transition-time: .3s;
  th {
    position: relative;
  }
  input {
    border: 0 none;
    box-sizing: border-box;
    padding: $grid-gutter*2 $grid-gutter;
    width: 100%;
    font-size: 14px;
    &:focus {
      outline: 1px solid rgba(110, 160, 240, .75);
      outline-offset: 1px;
    }
  }
  .icon {
    position: absolute;
    right: $grid-gutter;
    top: $grid-gutter*2;
    opacity: .3;
    transition: opacity $transition-time;
    pointer-events: none;
  }
  th:hover .icon {
    opacity: .6;
  }
  th input:focus + .icon {
    opacity: .8;
  }
</style>
