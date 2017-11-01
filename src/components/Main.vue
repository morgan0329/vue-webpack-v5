<template>
<div class="mainH">
    <header class="headerBar">
      <h1>注册有礼</h1>
    </header>

  <div class="mainBody">
    <div>
      <img :src="mainTopImageURL"/>
    </div>
    <div class="register_body">
      <div class="register-btn">
        <img @click="popupRegister" src="https://qfdfs.hdfax.com/group1/M00/00/DE/rBA5FllfYW2AYLVIAAAZo8vhgIw919.png"/>
        <p class="register-tip-text">
          <span>已有帐号？</span>
          <a href="https://mobile.hdfax.com/common/login?returnURL=https://mobile.hdfax.com/assets/html/product/list.html">
            立即登录
          </a>
        </p>
      </div>
    </div>
    <div class="register_footer">
      <div class="loadBtn">
        <img id="downloadAPP" src="https://qfdfs.hdfax.com/group1/M00/00/E1/rBA5FVlfYXKAfoA_AAALc28JHVw350.png">
      </div>
      <img src="https://qfdfs.hdfax.com/group1/M00/00/E1/rBA5FVlfYWiATXLYAAElOjESgNQ607.png">
    </div>
  </div>


  <div class="logonShade shut" style="display:none"></div>
  <div class="logonShadeImgBox  conceal" style="display:none">
    <div class="logonShadeInput">
      <p class="inputBox">
        <input type="tel" id="number" name="phoneNumber" maxlength="11" placeholder="请输入手机号" value=""/>
      </p>
      <p @click="verifyPhoneNumber" class="VerificationTel ">验证手机号</p>
    </div>
  </div>

  <div class="registerForm" style="display:none">
    <form style="margin-top:20px" autocomplete="off" id="form" method="post" action="#">
      <div class="phone">验证码已发送至<span id="textPhoneNumber"></span></div>
      <div id="codeMessage" style="display:none"></div>

      <div class="inputBox">
        <input type="hidden" id="captchaToken" value="">
        <input style="float:left" type="text" id="captchaCode" maxlength="4" placeholder="请填写图片验证码"/>
        <img @click="updateCaptcha" id="captcha" src=""/>
      </div>

      <div class="inputBox">
        <input style="float:left" type="tel" id="smsCode" name="smsCode" maxlength="6" placeholder="请填写验证码"/>
        <a @click="sendSMSCode" id="countDown" class="countDown">获取短信验证码</a>
      </div>
      <div class="inputBox">
        <input type="password" maxlength="20" id="password" placeholder="请设置6-20位字母数字组合"/>
        <i id="showPassWord">
          <img id="showImg" src="img/show.png" style="display:none"/>
          <img id="hideImg" src="img/hide.png"/>
        </i>
      </div>
      <p @click="submitRegistration" class="registerBtn">立即注册</p>
      <input type="hidden" name="byTpk" value="" id="registerByTpk"/>
      <input type="hidden" name="byKek" value="" id="registerByKek"/>
      <input type="hidden" name="phoneNumber" value="" id="phoneNumber"/>
    </form>
    <div class="agreement">
      点击注册，表示您已同意
      <a href="userServiceProtocol" id="protocolLink">《恒大金服用户服务协议》</a>
    </div>
  </div>

  <div id="toast" style="display:none">
  <div class="toastMask"></div>
  <div class="toastMain">
    <p id="toastText"></p>
  </div>
</div>
</div>
</template>

<script>
import $ from 'jquery'
import VueRouter from '@/router'
import Encryptor from '../encryption/encryptor'

import '../css/index.css'

const baseUrl = (process.env && process.env.SERVICE_URL) || '/'

export default {
  name: 'MainH',
  data () {
    return {
      countdown: 60,
      timer: null,

      mainTopImageURL: '#',
      downloadBtn: ''
    }
  },
  created () {
    this.mainTopImageURL = window.initData.image.mainTopImageURL
    this.downloadBtn = window.initData.image.downloadBtn
  },
  methods: {
    startCount: function () {
      var vueObj = this

      ;(function setTime (val) {
        vueObj.timer = setTimeout(function () {
          setTime(val)
        }, 1000)
        if (vueObj.countdown === 0) {
          vueObj.countdown = 60
          val.html('点击获取短信').css('color', '#333333').removeAttr('disabled')
          clearTimeout(vueObj.timer)
        } else {
          val.html(vueObj.countdown + '秒后可重试').css('color', '#aaaaaa').attr('disabled', true)
          vueObj.countdown--
        }
      })($('#countDown'))
    },

    goSuccess: function () {
      VueRouter.push('/success')
    },
    goHasRegistered: function () {
      VueRouter.push('/hasRegistered')
    },
    popupRegister: function () {
      $('.shut').show()
      $('.conceal').show()
    },
    verifyPhoneNumber: function () {
      var mobileReg = /^1\d{10}$/
      var phoneNumber = $('#number').val()
      if (mobileReg.test(phoneNumber)) {
        this.checkRegistered(phoneNumber)
      } else {
        this.showToast('手机格式应为11位手机号')
      }
    },
    checkRegistered: function (phoneNumber) {
      var vueObj = this

      $.ajax({
        url: baseUrl + 'mtp/h5/v1/login/op_verify_login_mobile',
        type: 'post',
        dataType: 'json',
        cache: false,
        xhrFields: {
          withCredentials: true
        },
        data: {
          'phoneNumber': phoneNumber
        },
        success: function (res) {
          if (res.resultCode === '1000') {
            if (res.isRegistered) {   // 已注册
              VueRouter.push('/hasRegistered')
            } else {                // 未注册
              vueObj.updateCaptcha()
              $('.conceal').hide()
              $('.registerForm').show()
              $('#phoneNumber').val(phoneNumber)
              $('#textPhoneNumber').html(phoneNumber)
            }
          } else {
            vueObj.showToast('系统异常')
          }
        },
        error: function () {
          vueObj.showToast('后台调用出错了')
        }
      })
    },

    sendSMSCode: function () {
      var vueObj = this

      var phoneNumber = $('#number').val()
      var captchaCodeVal = $('#captchaCode').val()
      var captchaTokenVal = $('#captchaToken').val()

      if (captchaCodeVal === '' || captchaTokenVal === '') {
        vueObj.showToast('请填写图片验证码')
        return
      }
      $.ajax({
        url: baseUrl + 'mtp/h5/v2/register/op_register_apply_sms_code',
        type: 'post',
        dataType: 'json',
        cache: false,
        xhrFields: {
          withCredentials: true
        },
        data: {
          'phoneNumber': phoneNumber,
          'captchaCode': captchaCodeVal,
          'captchaToken': captchaTokenVal
        },
        success: function (res) {
          if (res.resultCode === '1000') {
            vueObj.startCount()
            $('#phoneNumber').val(phoneNumber)
            $('#textPhoneNumber').html(phoneNumber)
          } else {
            vueObj.showToast(res.resultMsg)

            if (res.code === '369997') {
              vueObj.updateCaptcha()
            }
          }
        },
        error: function () {
          vueObj.showToast('调用后台系统出错')
        }
      })
    },

    updateCaptcha: function () {
      var vueObj = this

      $.ajax({
        url: baseUrl + 'mtp/h5/v1/util/op_challenge_captcha',
        type: 'post',
        dataType: 'json',
        success: function (res) {
          if (res.resultCode === '1000') {
            $('#captcha').attr('src', 'data:image/jpg;base64,' + res.captcha)
            $('#captchaToken').val(res.captchaToken)
            $('#captcha').show()
            $('#captchaCode').html('')
            $('#verificationCode').show()
          } else {
            vueObj.showToast(res.msg)
          }
        },
        error: function (res) {
          vueObj.showToast('发送手机验证码失败')
        }
      })
    },

    showToast: function (content) {
      if (content !== null && content !== '') {
        $('#toastText').html(content)
        $('#toast').fadeIn(100)
        setTimeout(function () {
          $('#toast').fadeOut(100)
        }, 1500)
      }
    },

    submitRegistration: function () {
      var vueObj = this
      Encryptor.doAsyncEncryptByMd5(baseUrl + 'mtp/h5/v1/tpsecurity/op_password_apply_tpsecurity',
                   $('#password').val(),
                   vueObj.doRegistration,
                   function (res) {
                     vueObj.showToast(res.resultMsg)
                   })
    },
    doRegistration: function (byKek, byTpk) {
      var vueObj = this

      $('#registerByKek').val(byKek)
      $('#registerByTpk').val(byTpk)

      $.ajax({
        url: baseUrl + 'mtp/h5/v1/register/op_register_mobile_user',
        type: 'post',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        },
        data: {
          'byTpk': $('#registerByTpk').val(),
          'byKek': $('#registerByKek').val(),
          'phoneNumber': $('#phoneNumber').val(),
          'smsCode': $('#smsCode').val(),
          'inviteCode': '',
          'marketChannel': 'default'
        },
        success: function (res) {
          if (res.resultCode === '1000') {
            vueObj.showToast('成功')

            VueRouter.push('/success')
          } else {
            vueObj.showToast(res.resultMsg)
          }
        },
        error: function (res) {
          vueObj.showToast('失败')
        }
      })
    }
  }
}
</script>

<style scoped>
.headerBar h1 {
  color: #ffffff;
  font-size: 1rem;
}

.phone, .countDown, .agreement {
  font-size:18px;
}

  .mainBody {
    width: 100%;
  }

  .mainBody div img {
    width: 100%;
    height: auto;
  }

  img {
    border: 0;
    display: block;
  }

  .register_body {
    position: relative;
  }

  .register_body .register-btn {
    position: absolute;
    width: 80%;
    left: 50%;
    margin-left: -40%;
    z-index: 1;
    top: -4.5rem;
  }

  .register-tip-text {
    text-align: center;
    margin-top: 0.5rem;
    font-size: 0.7rem;
    color: #fff;
    font-family: Helvetica;
  }

  .register-tip-text a {
    color: #016BD4;
    font-family: Helvetica;
    text-decoration: none;
  }

  .register_footer {
    position: relative;
    width: 100%;
  }

  .register_footer .loadBtn {
    position: absolute;
    z-index: 1;
    width: 20%;
    bottom: 0.5rem;
    right: 3%;
  }


  .logonShade {
    background: #000;
    z-index: 20;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.7;
    position: fixed;
    top: 0;
    left: 0;
  }

  .logonShadeImgBox {
    position: fixed;
    top: 50%;
    left: 0;
    right: 0;
    margin: 0 auto;
    transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    width: 17rem;
    height: 19rem;
    background: url("https://qfdfs.hdfax.com/group1/M00/00/DE/rBA5FllfYbmAc15TAAAwltjrFgY633.png");
    background-size: cover;
    box-sizing: border-box;
    padding-top: 5.504rem;
    z-index: 21;
  }

  .logonShadeImgBox .logonShadeInput {
    background: none;
    width: 14rem;
    height: auto;
    position: relative;
    top: 1rem;
    padding-top: 8.5px;
    overflow: hidden;
    border-radius: 0 0 10px 10px;
    margin: 0 auto;
    text-align: center;
  }

  .logonShadeImgBox .logonShadeInput .inputBox {
    height: 1.5rem;
    line-height: 1.5rem;
    border: 2px solid #bfbfbf;
    padding-left: 10px;
    border-radius: 0;
    width: 76%;
    position: relative;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .logonShadeInput p input {
    font-size: 0.6rem;
    background: none;
    border-radius: 2px;
    outline: none;
    display: block;
    border: none;
  }

  .logonShadeInput .VerificationTel {
    width: 76%;
    height: 1.7rem;
    margin: 1rem auto 30px;
    border-radius: 1.322rem;
    background: #f22547;
    line-height: 1.7rem;
    text-align: center;
    font-size: 0.8rem;
    color: #fff;
  }

  .registerForm {
    width: 17rem;
    height: 22rem;
    background: url("https://qfdfs.hdfax.com/group1/M00/00/E1/rBA5FVlfYb2ASDKiAAB8IHuac64082.png");
    background-size: cover;
    position: fixed;
    top: 25%;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 21;
    box-sizing: border-box;
    padding-top: 5.504rem;
  }

  .registerBtn {
    width: 76%;
    height: 1.7rem;
    line-height: 1.7rem;
    border-radius: 1.322rem;
    background: #FD5A49;
    text-align: center;
    font-size: 0.8rem;
    color: #FFFFFD;
    margin: 0.5rem auto;
  }

  .inputBox input {
    height: 25px;
  }

</style>