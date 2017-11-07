<template>
<div class="container">
  <header class="headerBar">
    <p>注册有礼</p>
  </header>

  <div class="mainBody">
    <div class="mainImageDiv">
      <img :src="hasRegisteredBackground1">
      <img class="margin-top-1" :src="hasRegisteredBackground2">
      <img class="margin-top-1" :src="hasRegisteredBackground3">
    </div>
    <div class="textDiv">
        <div>您已是恒大金服用户</div>
        <div>无需重复注册</div>
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
      hasRegisteredBackground1: '',
      hasRegisteredBackground2: '',
      hasRegisteredBackground3: ''
    }
  },
  created () {
    this.downloadBtn = window.initData.image.downloadBtn
    this.hasRegisteredBackground1 = window.initData.image.hasRegisteredBackground1
    this.hasRegisteredBackground2 = window.initData.image.hasRegisteredBackground2
    this.hasRegisteredBackground3 = window.initData.image.hasRegisteredBackground3
  }
}
</script>