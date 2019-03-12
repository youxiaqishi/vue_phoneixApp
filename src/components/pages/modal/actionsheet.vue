<template>
  <div class="content" @click="clickbgound">
    <ul class="buttonsUl">
      <li @click="delecomment">删除评价</li>
      <li @click="cancelclick" class="last">取消</li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    clickbgound () {
      this.$emit('bgclick')
    },
    delecomment () {
      // 删除评价
      this.$emit('delecomment')
    },
    cancelclick () {
      // 取消按钮
      this.$emit('cancelclick')
    }
  }

}
</script>

<style lang="less" scoped>
.content{
  position: fixed;
  z-index: 20;
  background: rgba(0,0,0,0.3);
  height: 100%;
  width: 100%;
  .buttonsUl{
    position: absolute;
    bottom: 0;
    width: 100%;
    li{
      display: block;
      height: 1rem;
      background: #fff;
      text-align: center;
      line-height: 1rem;
      font-size: .3rem;
      border-radius: 5px;
      width: 96%;
      margin-left: 2%;
      &.last{
        margin: .2rem 2%;
      }
    }
  }
}  
</style>