<template>
<div class="container">
  <header class="headerBar">
    <p>注册有礼</p>
  </header>

  <div class="mainBody">
    <div class="mainImageDiv">
      <img :src="successBackground1">
      <img class="margin-top-1" :src="successBackground2">
      <img class="margin-top-1" :src="successBackground3">
    </div>
    <div class="textDiv">
      <div>恭喜注册成功</div>
      <div>1000元现金已发到您的账户</div>
    </div>
    <div class="downloadDiv">
      <img id="downloadAPP" class="downloadImg" :src="downloadBtn">
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'SuccessH',
  data () {
    return {
      downloadBtn: '',
      successBackground1: '',
      successBackground2: '',
      successBackground3: ''
    }
  },
  created () {
    this.successBackground1 = window.indexData.image.successBackground1
    this.successBackground2 = window.indexData.image.successBackground2
    this.successBackground3 = window.indexData.image.successBackground3
  },
  methods: {
  }
}
</script>