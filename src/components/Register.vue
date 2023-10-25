<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="Logo" class="logo">
      </div>
      <h1 class="login-title">欢迎注册</h1>
      <el-form @submit.native.prevent="handleRegister" class="login-form">
        <el-form-item>
          <el-input v-model="userid" prefix-icon="el-icon-user" placeholder="工号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" v-model="password" prefix-icon="el-icon-lock" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input type="password" v-model="confirmPassword" prefix-icon="el-icon-lock" placeholder="确认密码"></el-input>
        </el-form-item>
        <el-form-item class="captcha-item">
          <el-input v-model="captchaInput" placeholder="验证码"></el-input>
          <div class="get-code" @click="refreshCode()">
            <SIdentify :identifyCode="identifyCode"></SIdentify>
        </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" block @click="handleRegister">注册</el-button>
        </el-form-item>
        
      </el-form>
    </el-card>
  </div>
</template>

<script>
import SIdentify from "@/components/SIdentify.vue"


export default {
  components: {
    SIdentify
  },
  created () {     
    this.refreshCode()  
},
  data() {
    return {
      userid: '',
      password: '',
      confirmPassword: '',
      identifyCode: "",
      phone:'',
      identifyCodes: "0123456789abcdwerwshdjeJKDHRJHKOOPLMKQ",
      captchaInput: ''
    }
  },
  methods: {
    async handleRegister() {
      if ( this.captchaInput.toLowerCase()!==this.identifyCode.toLowerCase()) {
           this.$message.error('验证码错误');
           return;
            }

      try {
        const response = await this.$http.post('/auth/register', {
          userid: this.userid,
          userpassword: this.password,
        });

        if (response.data.code === 200) {
          this.$message.success(response.data.msg);
          this.goToLogin();
        } else {
          this.$message.error(response.data.msg);
          console.log(response.data.msg)
        }
      } catch (error) {
        this.$message.error('注册失败');
      }
    },
    goToLogin() {
      this.$router.push('/login');
    },
    refreshCode() {
        console.log("mark1")
            this.identifyCode = "";
            this.makeCode(this.identifyCodes,4);
    },
    randomNum (min, max) {
      max = max + 1
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 随机生成验证码字符串
    makeCode (data, len) {
          for (let i = 0; i < len; i++) {
          this.identifyCode += data[this.randomNum(0, data.length - 1)]
        }
  }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #83a4d4, #b6fbff);
  margin-top: -60px;

}

.login-card {
  width: 400px;
  padding: 30px 40px;
  border-radius: 15px;
  box-shadow: 0px 10px 30px -5px rgba(0, 0, 0, 0.3);
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.logo {
  width: 70px;
  height: 70px;
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 26px;
  color: #303133;
  font-weight: bold;
}

.login-form {
  margin-top: 10px;
}

.captcha-item {
   
   align-items: left;
   justify-content: space-between; 
}

.captcha-item > el-input {
   /* flex: 1; */
   margin-right: 10px;
   
}

.get-code {

}

.vue-captcha {
  display: inline-block;  /* 确保验证码图片是行内块元素 */
}

.register-item {
  margin-top: 20px;
}

el-button {
  transition: all 0.3s ease;
}

el-button:hover {
  transform: translateY(-2px);
}
</style>

