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
        ref="search"
      ></search>
    </div>
    <div>
      <div>
        <span @click="backLastLevel()">返回</span>
      </div>
      <div>
        <span v-for="p in this.pathList" :key="p.id" @click="selectPath(p)">{{p.name}}/</span>
      </div>
      <div v-for="i in tempList" :key="i.id">
        <input type="checkbox" name="checkBoxInput" @click="checkBoxSelect(i)" :checked="personSelect.indexOf(i.id)>=0"><label @click="chosie(i)">{{i.name}}</label>
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
      personSelect: [],
      personList: [{
        id: 1,
        name: '中国电信',
        children: [{
          id: 10000,
          name: '市场线',
          children: [{
            id: 100001212,
            name: '业务支持中心',
            children: [{
              id: 200001212,
              name: '系统研发室',
              parent: 100001212,
              children: [{
                id: 71084750,
                name: '欧伟轩',
                parent: 200001212
              }]
            }, {
              id: 200001213,
              name: '大数据室',
              parent: 100001212
            }]
          }]
        }
        ]}
      ],
      tempList: [],
      pathList: []
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
    },
    chosie (item) {
      if (typeof (item['children']) !== 'undefined') {
        this.tempList = item['children']
        this.pathList.push(item)
      } else {
        this.personSelect.push(item.id)
      }
    },
    checkBoxSelect (item) {
      console.log(item)
    },
    selectPath (item) {
      if (item.id !== this.tempList[0]['parent']) {
        this.tempList = item['children']
        var flag = false
        while (!flag) {
          var temp = this.pathList.pop()
          if (temp.id === item.id) {
            this.pathList.push(temp)
            flag = true
          }
        }
      }
    },
    backLastLevel () {
      if (this.pathList.length > 1) {
        var temp = this.pathList.pop()
        temp = this.pathList.pop()
        // console.log(temp)
        this.pathList.push(temp)
        this.tempList = temp['children']
      }
    }
  },
  mounted () {
    this.tempList = this.personList[0]['children']
    this.pathList = this.personList
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
