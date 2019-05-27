<template>
  <div>
    <x-header>人员选择</x-header>
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
      <div class="outerBox">
        <span @click="backLastLevel()" class="backClass">&lt;返回上一级</span>
      </div>
      <div class="outerBox">
        当前位置：<span v-for="p in this.pathList" :key="p.id" @click="selectPath(p)"> <span class="pathClass">{{p.name}}</span> / </span>
      </div>
      <div class="outerBox">
        <div v-for="i in tempList" :key="i.id" >
          <input type="checkbox" class="checkBoxClass" name="checkBoxInput" @click="checkBoxSelect(i)" :checked="personSelect.indexOf(i.id)>=0"><label class="labelClass" @click="chosie(i)">{{i.name}}</label>
        </div>
      </div>
    </div>
    <div style="padding:10px 10px;">
      <x-button type="primary" mini @click.native="buttonClick">确定</x-button>
    </div>
  </div>
</template>

<script>
import { XHeader, Search, Checker, CheckerItem, XButton } from 'vux'
export default {
  components: {
    XHeader,
    Search,
    Checker,
    CheckerItem,
    XButton
  },
  props: {
    personList: Array
  },
  data () {
    return {
      results: [],
      value: 'test',
      personSelect: [],
      // personList: [{
      //   id: 1,
      //   name: '中山电信',
      //   children: [{
      //     id: 10000,
      //     name: '市场线',
      //     children: [{
      //       id: 100001212,
      //       name: '业务支持中心',
      //       children: [{
      //         id: 200001212,
      //         name: '系统研发室',
      //         parent: 100001212,
      //         children: [{
      //           id: 71084750,
      //           name: '欧伟轩',
      //           parent: 200001212
      //         }]
      //       }, {
      //         id: 200001213,
      //         name: '大数据室',
      //         parent: 100001212
      //       }]
      //     }]
      //   }
      //   ]}
      // ],
      tempList: [],
      pathList: [],
      selectDict: {}
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
        var index = this.personSelect.indexOf(item.id)
        if (index >= 0) {
          this.popFromPersonSelect(item)
        } else {
          this.pushIntoPersonSelect(item)
        }
      }
    },
    checkBoxSelect (item) {
      var itemStack = []
      itemStack.push(item)

      // false->未选择
      var flag = false
      if (this.personSelect.indexOf(item['id']) >= 0) {
        flag = true
        this.popFromPersonSelect(item)
      } else {
        this.pushIntoPersonSelect(item)
      }

      while (itemStack.length > 0) {
        var temp = itemStack.pop()
        if (typeof (temp['children']) !== 'undefined') {
          var childrenList = temp['children']
          var i
          for (i = 0; i < childrenList.length; i++) {
            var child = childrenList[i]
            itemStack.push(child)
            if (flag) {
              this.popFromPersonSelect(child)
            } else {
              this.pushIntoPersonSelect(child)
            }
          }
        }
      }
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
        this.pathList.push(temp)
        this.tempList = temp['children']
      }
    },
    pushIntoPersonSelect (item) {
      var id = item['id']
      if (this.personSelect.indexOf(id) < 0) {
        this.personSelect.push(id)
        if (typeof (item['children']) === 'undefined') {
          this.selectDict[id] = item
        }
      }
    },
    popFromPersonSelect (item) {
      var id = item['id']
      var index = this.personSelect.indexOf(id)
      if (index >= 0) {
        this.personSelect.splice(index, 1)
        if (typeof (item['children']) === 'undefined') {
          delete this.selectDict[id]
        }
      }
    },
    buttonClick () {
      this.$emit('selectedPerson', this.selectDict)
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
.outerBox {
  padding: 8px 10px;
  overflow: hidden;
}
.backClass {
  color: #A4E36A;
}
.checkBoxClass {
  height: 18px;
  width: 18px;
}
.labelClass {
  font-size: 18px;
  line-height: 18px;
  height: 20px;
  position: relative;
  top: -3px;
  margin-left: 10px;
}
.pathClass {
  text-decoration: underline;
  color: #A4E36A;
}
</style>
