<template>
  <div class="page">
    <m-header>
      <span slot="left"></span>
      <span slot="title">常见问题</span>
    </m-header>
    <div class="page-content">
      <form action="javascript:return true;" v-if="!inputShow" v-on:click="goto(0)">
        <input type="search" name="搜索" id="helpInputStyle" disabled="disabled" placeholder="请输入问题关键字">
      </form>
      <form action="javascript:return true;" v-else>
        <input type="search" name="搜索" id="helpInput" v-on:keyup.enter="search(helpText)" v-model="helpText" placeholder="请输入问题关键字">
        <span class="helpSearch" v-on:click="goto(1)">取消</span>
      </form>
      <ul class="helpList" v-if="!inputShow">
        <router-link :to="{path: '/helpCont/' + help.id + '/' + help.classifyName}" v-for="(help, index) in helpList" tag="li" :key="index" class="help_link">
          {{help.classifyName}}<i class="icon-arrow-right"></i>
        </router-link>
      </ul>
      <ul class="helpList" v-else>
        <router-link :to="{path:'/helpDetail/'+ helpcont.id + '/' + helpcont.helpName}" v-for="(helpcont, index) in helpContList" tag="div" :key="index" class="help_link">
          {{helpcont.helpName}} <i class="icon-arrow-right"></i>
        </router-link>
      </ul>
    </div>
  </div>
</template>
<script>
import store from '../../../store/index.js'
export default {
  data () {
    return {
      inputShow: false,
      helpText: '',
      helpList: [],
      helpContList: []
    }
  },
  activated () {
    setTimeout(() => { window.document.getElementById('inputStyle').focus() }, 800)
    this.getData()
  },
  computed: {
  },
  store,
  methods: {
    getData () {
      var that = this
      that.$axios.get('/app/system/helpcenter/get/helpcenterName').then((helpListRes) => {
        if (helpListRes) that.helpList = helpListRes
      })
    },
    search () {
      window.document.getElementById('helpInput').blur()
      if (!this.helpText) {
        this.$toast({message: '请输入搜索内容', duration: 800})
        return
      }
      var that = this
      that.$axios.get('/app/system/helpcenter/get/helpcenterdetail/app/key/' + that.helpText).then((helpContRes) => {
        if (helpContRes) that.helpContList = helpContRes
      })
    },
    goto (show) {
      if (show === 1) {
        this.helpText = ''
        this.helpContList = []
        this.inputShow = false
        window.document.getElementById('helpInput').blur()
      } else {
        this.inputShow = true
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "../../../../static/css/mine.less";
</style>