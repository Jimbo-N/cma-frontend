<template>
    <div class="login-container">
      <el-card class="login-card">
        <div class="logo-container">
          <img src="@/assets/logo.png" alt="Logo" class="logo">
        </div>
        <h1 class="login-title">欢迎登录</h1>
        <el-form @submit.native.prevent="handleSubmit" @keyup.enter="handleSubmit" class="login-form">
          <el-form-item>
            <el-input v-model="userid" prefix-icon="el-icon-user" placeholder="工号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="password" v-model="userpassword" prefix-icon="el-icon-lock" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" block @click="handleSubmit">登录</el-button>
          </el-form-item>
          <el-form-item class="register-item">
            <el-button type="text" block @click="goToRegister">没有账号？立即注册</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script>

  export default {
    data() {
      return {
        userid: '',
        userpassword: '',
      }
    },
    methods: {
      async handleSubmit() {
        try {
          const response = await this.$http.post('/auth/login', {
            userid: this.userid,
            userpassword: this.userpassword
          })
          if (response.data.code === 200) {
            this.$message.success(response.data.msg)
            localStorage.setItem('token', response.data.jwt)
            this.$router.push('/*');
          } else {
            this.$message.error(response.data.msg)
            console.log(response.data.msg)
          }
        } catch (error) {
          this.$message.error('登录失败')
        }
      },
      goToRegister() { 
        this.$router.push('/register'); 
      },

    },

        
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