<template>
  <th>
    <input type="text"
           :placeholder="languageId || 'source'">
    <icon name="search"
          class="icon"></icon>
  </th>
</template>

<script>
  import Vue from 'vue'
  import 'vue-awesome/icons/search'
  import Icon from 'vue-awesome/components/Icon.vue'
  Vue.component('icon', Icon)
  export default {
    props: [
      'languageId'
    ]
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
    &::placeholder {
      font-weight: bold;
      transition: opacity $transition-time;
    }
    &:focus::placeholder {
      opacity: 0;
    }
    &:focus {
      outline: 1px solid rgba(110, 160, 240, .75);
      outline-offset: 1px;
    }
  }
  .icon {
    position: absolute;
    right: $grid-gutter;
    top: $grid-gutter*2;
    opacity: 0;
    transition: opacity $transition-time;
    pointer-events: none;
  }
  th:hover .icon {
    opacity: .3;
  }
  th input:focus + .icon {
    opacity: .6;
  }
</style>
