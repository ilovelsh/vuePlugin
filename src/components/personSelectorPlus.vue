<template>
  <div>
    <x-header>This is the page title.</x-header>
    <div>
      <search
        @result-click="resultClick"
        @on-change="getResult"
        :results="results"
        v-model="value"
        position="absolute"
        auto-scroll-to-top
        top="46px"
        @on-focus="onFocus"
        @on-cancel="onCancel"
        @on-submit="onSubmit"
        ref="search"></search>
    </div>
    <div>
      <div>
        <checker v-model="personSelect" type="checkbox" default-item-class="p_item" selected-item-class="p_selected">
          <checker-item v-for="i in 5" :value="i" :key="i">&nbsp;&nbsp;&nbsp;{{i}}</checker-item>
        </checker>
      </div>
    </div>
  </div>
</template>

<script>
import { XHeader, Search, Checker, CheckerItem } from 'vux'
export default {
  components: {
    XHeader,
    Search,
    Checker,
    CheckerItem
  },
  data () {
    return {
      results: [],
      value: 'test',
      personSelect: ''
    }
  },
  methods: {
    setFocus () {
      this.$refs.search.setFocus()
    },
    resultClick (item) {
      window.alert('you click the result item: ' + JSON.stringify(item))
    },
    getResult (val) {
      console.log('on-change', val)
      this.results = val ? getResult(this.value) : []
    },
    onSubmit () {
      this.$refs.search.setBlur()
      this.$vux.toast.show({
        type: 'text',
        position: 'top',
        text: 'on submit'
      })
    },
    onFocus () {
      console.log('on focus')
    },
    onCancel () {
      console.log('on cancel')
    }
  }
}
function getResult (val) {
  let rs = []
  for (let i = 0; i < 20; i++) {
    rs.push({
      title: `${val} result: ${i + 1} `,
      other: i
    })
  }
  return rs
}
</script>
<style scoped>
.p_item {
  display: block;
  border: 1px solid #ececec;
  padding: 5px 15px;
}
.p_selected {
  /* border: 1px solid green; */
  background: #ffffff url(../assets/checked.png) no-repeat left;
  border-color: #f4ea2a; 
}
</style>
