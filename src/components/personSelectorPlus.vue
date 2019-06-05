<template>
  <div>
    <x-header>人员选择</x-header>
    <div>
      <search
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
      <!-- <div class="outerBox">
        <span @click="backLastLevel()" class="backClass">&lt;返回上一级</span>
      </div> -->
      <div class="outerBox pathBox">
        <span v-for="p in this.pathList" :key="p.id" @click="selectPath(p)"> <span class="pathClass">{{p.name}}</span> / </span>
      </div>
      <div class="itemBox">
        <!-- <div class="itemChildBox">
          <span @click="backLastLevel()" class="backClass">返回上一级</span>
        </div> -->
        <div v-for="i in tempList" :key="i.id" class="itemChildBox">
          <!-- <input type="checkbox" class="checkBoxClass" name="checkBoxInput" @click="checkBoxSelect(i)" :checked="personSelect.indexOf(i.id)>=0"><label class="labelClass" @click="chosie(i)">{{i.name}}</label> -->
          <input type="checkbox" class="checkBoxClass" name="checkBoxInput" @click="checkBoxSelect(i)" :checked="checked(i)"><label class="labelClass" @click="chosie(i)">{{i.name}}</label>
        </div>
      </div>
    </div>
    <div style="padding:10px 10px;">
    </div>
    <div class="bottomTab">
      <div class="bottomLeft">
        <span class="choiseName" v-for="p in this.selectDict" :key="p.id">{{p.name}}</span>
      </div>
      <div class="bottomRight">
        <x-button type="primary" mini @click.native="buttonClick">确定</x-button>
      </div>
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
  // props: {
  //   personList: Array
  // },
  data () {
    return {
      results: [],
      value: '',
      personSelect: [],
      personList: [],
      tempList: [],
      pathList: [],
      selectDict: {},
      searchSave: []
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
      if (this.searchSave.length > 0) {
        this.tempList = this.searchSave
      } else {
        this.searchSave = this.tempList
      }
      var tempsave = this.tempList
      if (val !== '') {
        var searchList = []
        var searchStack = []

        var templistLen = tempsave.length
        for (var i = 0; i < templistLen; i++) {
          searchStack.push(tempsave[i])
        }
        while (searchStack.length > 0) {
          var temp = searchStack.pop()
          if (typeof (temp['children']) !== 'undefined') {
            var childrenList = temp['children']
            var j
            for (j = 0; j < childrenList.length; j++) {
              var child = childrenList[j]
              searchStack.push(child)
            }
          } else {
            if (temp['name'].indexOf(val) >= 0) {
              searchList.push(temp)
            }
          }
        }
        this.tempList = searchList
      } else {
        if (this.searchSave.length > 0) {
          this.tempList = this.searchSave
        }
      }
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
      this.tempList = this.personList[0]['children']
      this.pathList = this.personList
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
    },
    getAllStaff () {
      // var url = 'https://it.zsnet.net.cn/bbbooker/backend/adminHandler/getAllStaff'
      var url = '/adminHandler/getAllStaff'
      this.$http({
        url: url,
        method: 'POST'
      }).then(response => {
        this.personList = [response.data.staffList]
        this.tempList = this.personList[0]['children']
        this.pathList = this.personList
      })
    }
  },
  computed: {
    checked () {
      return function (node) {
        if (typeof (node['children']) !== 'undefined') {
          var children = node['children']
          var i
          for (i = 0; i < children.length; i++) {
            var tempId = children[i]['id']
            if (this.personSelect.indexOf(tempId) < 0) {
              this.popFromPersonSelect(node)
              return false
            }
          }
          this.pushIntoPersonSelect(node)
          return true
        } else if (this.personSelect.indexOf(node['id']) < 0) {
          this.popFromPersonSelect(node)
          return false
        }
        return true
      }
    },
    tempListIds () {
      var list = []
      for (var i = 0; i < this.tempList.length; i++) {
        list.push(this.tempList[i]['id'])
      }
      return list
    }
  },
  mounted () {
    this.getAllStaff()
  }
}
</script>
<style>
.outerBox {
  padding: 8px 10px;
  overflow: hidden;
}
.backClass {
  margin-left: 30px;
}
.checkBoxClass {
  height: 18px;
  width: 18px;
}
.labelClass {
  font-size: 18px;
  line-height: 18px;
  height: 30px;
  position: relative;
  top: -3px;
  margin-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 300px;
}
.pathClass {
  /* text-decoration: underline; */
  font-size: 18px;
}
.bottomTab {
  position: fixed;
  bottom: 0px;
  height: 60px;
  width: 100%;
  overflow: hidden;
  border-top: 1px solid grey;
  z-index: 1000;
  background-color: antiquewhite;
}
.bottomLeft { 
  float: left;
  padding: 5px;
  overflow: hidden;
  width: 285px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.bottomRight {
  float: right;
  width: 80px;
  height: 60px;
  text-align: center;
  line-height: 60px;
}
.choiseName {
  padding: 5px;
}
.pathBox {
  border-bottom: 1px solid black;
}
.itemBox {
  padding: 10px 20px;
  overflow: hidden;
  margin-bottom: 60px;
}
.itemChildBox {
  padding: 5px;
  overflow: hidden;
  width: 420px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
