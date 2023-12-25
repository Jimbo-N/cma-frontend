<template>
  <div class="login-container">
    <el-card class="login-card">
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="Logo" class="logo">
      </div>
      <!-- <h1 class="login-title"></h1> -->
      <el-form ref="registerForm" @submit.native.prevent="handleRegister" class="login-form" :model="form" :rules="rules">        
        <el-form-item prop="password">
          <el-input type="password" v-model="form.password" prefix-icon="el-icon-lock" placeholder="原始密码"></el-input>
        </el-form-item>
        <el-form-item prop="newpassword">
          <el-input type="password" v-model="form.newpassword" prefix-icon="el-icon-lock" placeholder="新密码"></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input type="password" v-model="form.confirmPassword" prefix-icon="el-icon-lock" placeholder="确认密码"></el-input>
        </el-form-item>
        <el-form-item class="captcha-item" prop="captchaInput">
          <el-input v-model="form.captchaInput" placeholder="验证码"></el-input>

        </el-form-item>
        <div class="get-code" @click="refreshCode()">
            <SIdentify :identifyCode="identifyCode"></SIdentify>
        </div>
        <el-form-item>
          <el-button type="primary" block @click="handleRegister">修改密码</el-button>
        </el-form-item>
        
      </el-form>
    </el-card>
  </div>
</template>

<script>
import SIdentify from "@/components/auth/SIdentify.vue"


export default {
  components: {
    SIdentify
  },
  created () {     
    this.refreshCode()  
},
  data() {
    return {
      form: {
      password: '',
      newpassword: '',
      confirmPassword: '',
      captchaInput: ''
    },
    rules: {
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 8, max: 16, message: '密码长度必须在8-16个字符', trigger: 'blur' }
        ],
        newpassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 8, max: 16, message: '密码长度必须在8-16个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { min: 8, max: 16, message: '密码长度必须在8-16个字符', trigger: 'blur' }
        ],
        captchaInput: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      },
      identifyCode: "",
      identifyCodes: "0123456789abcdwerwshdjeJKDHRJHKOOPLMKQ",
    }
  },
  methods: {
    async handleRegister() {
      this.$refs.registerForm.validate(async (valid) => {
        if (!valid) {
          this.$message.error('注册表单不符合要求');
          return;
        }

        if (this.form.captchaInput.toLowerCase() !== this.identifyCode.toLowerCase()) {
          this.$message.error('验证码错误');
          return;
        }
        if (this.form.newpassword !== this.form.confirmPassword) {
          this.$message.error('两次输入的密码不同');
          return;
        }

        try {
          const response = await this.$http.post('/v1/user/edit', {
            token: localStorage.getItem('token'),
            password: this.form.password,//原始密码
            newpassword: this.form.newpassword
          });

          if (response.data.code === 200) {
            this.$message.success("注册成功");
            this.goToLogin();
          } else {
            this.$message.error(response.data.msg);
            console.log(response.data.msg)
          }
        } catch (error) {
          this.$message.error('注册失败');
        }
      });
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
  width: 100px;
  height: auto
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

