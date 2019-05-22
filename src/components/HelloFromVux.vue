<template>
  <div>
    <div class="vux-demo">
      <img class="logo" src="../assets/vux_logo.png">
      <h1> </h1>
    </div>
    <group title="cell demo">
      <cell title="VUX" value="???" is-link></cell>
      <cell title="人员选择页" is-link link="psPlus"></cell>
    </group>
    <div>
      <button @click="personSelectorShow = !personSelectorShow">打开人员选择框</button>
      <personSelector v-show="personSelectorShow"></personSelector>
    </div>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'

import personSelector from './personSelector.vue'

export default {
  components: {
    Group,
    Cell,
    personSelector
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello World!',
      personSelectorShow: false
    }
  }
}
</script>

<style>
.vux-demo {
  text-align: center;
}
.logo {
  width: 100px;
  height: 100px
}
</style>
