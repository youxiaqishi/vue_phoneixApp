<template>
  <div class="page has-navbar" v-nav="{title: '积分规则', showBackButton: true}">
    <div class="page-content">
      <div class="ctIntegralGZ">
          <h3>会员制度</h3>
          <h4>1.会员等级</h4>
          <h4>1.1会员等级介绍</h4>
          <p>
          凤凰优选的用户分为业主和非业主两种身份。业主用户是经过凤凰优选系统认证后的用户身份，未经过认证的用户统称为非业主。<br>
      业主和非业主身份的会员级别共分为4个等级，分别为：普通会员、黄金会员、白金会员、黑金会员。会员级别由积分决定，积分越高会员等级越高，享受到的会员权益越大。会员级别的升降均由系统自动处理，无需申请。
          </p>
          <h4>1.2会员等级所对应的积分</h4>
          <p> 每个等级对应的积分值要求如下：<br>
              普通会员：0~999<br>
              黄金会员：1000~4999<br>
              白金会员：5000~14999<br>
              黑金会员：15000以上
          </p>
          <h4>2.会员权益</h4>
          <table>
              <thead>
                  <tr>
                      <th>会员权益</th>
                      <th>普通会员</th>
                      <th>黄金会员</th>
                      <th>白金会员</th>
                      <th>黑金会员</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>免配送费</td>
                      <td>购买满128元<br>免配送费</td>
                      <td>购买满128元<br>免配送费</td>
                      <td>购买满128元<br>免配送费</td>
                      <td>购买满128元<br>免配送费</td>
                  </tr>
                  <tr>
                      <td>价格权益</td>
                      <td>身份价格</td>
                      <td>身份价格基础上<br>99折</td>
                      <td>身份价格基础上<br>97折</td>
                      <td>身份价格基础上<br>95折</td>
                  </tr>
                  <tr>
                      <td>升级礼包</td>
                      <td>——</td>
                      <td>享有升级礼包</td>
                      <td>享有升级礼包</td>
                      <td>享有升级礼包</td>
                  </tr>
                  <tr>
                      <td>生日礼包</td>
                      <td>——</td>
                      <td>享有生日礼包</td>
                      <td>享有生日礼包</td>
                      <td>享有生日礼包</td>
                  </tr>
              </tbody>
          </table>
          <p>备注 1：身份价格具体指：业主享受业主价；非业主享受优选价。</p>
          <p>备注 2：升级礼包不叠加，如果会员一笔消费后连升两级，则获得最高级别所对应的礼包。</p>
          <h4>3.会员积分</h4>
          <p>
              用户每消费1元可积1分，确认收货时积分到账。每笔成交订单所获得积分有效期为一年，发生订单退货时扣除相应积分。<br>
              举例：会员a于2017年7月11日消费100元，确定收货后获得100积分。而这100积分的有效期为1年，即到2018年7月10日过期失效。

          </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      data: {}
    }
  },
  created () {
    var that = this
    that.$axios.get('/mine/vip').then((res) => {
      if (res) {
        that.data = res
      }
    }).catch(function (eMsg) {
    })
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
.page-content{
  background: #FAFAF9;
    padding: 0px;
    margin: 0px auto;
    font-size: 0.26rem;
    .ctIntegralGZ {
      font-size: 0.28rem;
      color: #626666;
      line-height: 2;
      padding: 0.3rem 0.25rem;
      h3 {
        text-align: center;
        padding: 0px;
      margin: 0px;
      display: block;
        font-size: 1.17em;
        -webkit-margin-before: 1em;
        -webkit-margin-after: 1em;
        -webkit-margin-start: 0px;
        -webkit-margin-end: 0px;
        font-weight: bold;

    }
    h4 {
      padding: 0px;
        margin: 0px;
      display: block;
      font-size: .28rem;
        -webkit-margin-before: 1.33em;
        -webkit-margin-after: 1.33em;
        -webkit-margin-start: 0px;
        -webkit-margin-end: 0px;
        font-weight: bold;
    }
    p {
        display: block;
        -webkit-margin-before: 1em;
        -webkit-margin-after: 1em;
        -webkit-margin-start: 0px;
        -webkit-margin-end: 0px;
    }
    table {
        border: 1px solid #000000;
        border-collapse: collapse;
        font-size: 12px;
        thead {
          display: table-header-group;
          vertical-align: middle;
          border-color: inherit;
          tr {
            display: table-row;
            vertical-align: inherit;
            border-color: inherit;
        }
        th {
            width: 20%;
            text-align: center;
            border: 1px solid #000000;
        }
      }
      tbody {
          display: table-row-group;
          vertical-align: middle;
          border-color: inherit;
          tr {
            display: table-row;
            vertical-align: inherit;
            border-color: inherit;
            td {
              text-align: center;
              border: 1px solid #000000;
          }
        }
      }
    }
  }
    p{
    padding: 0px;
    margin: 0px;
  }
  h3{
    color: inherit;
      font-weight: 400;
  }
  div{
    margin: 0;
      padding: 0;
      border: 0;
      vertical-align: baseline;
      line-height: inherit;
      color: inherit;
      font-weight: 400;
  }
}
</style>


