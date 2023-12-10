<template>
    <el-header class="header">
      <el-row :gutter="15">
        <el-col :span="2">
            <img src="@/assets/logo.png" alt="Logo" class="logo" @click="gotoMain" >
        </el-col>
        <el-col :span="3" :offset="12">
          <el-button :type="$route.path === '/employee' ? 'primary' : 'text'" @click="gotoEmp">人员信息</el-button>
        </el-col>
        <el-col :span="2">
          <el-button :type="$route.path === '/standardlib' ? 'primary' : 'text'" @click="gotoStandardlib">标准库</el-button>
        </el-col>
        <el-col :span="2">
          <el-button :type="$route.path === '/equipmentlib' ? 'primary' : 'text'" @click="gotoEquipmentlib">设备库</el-button>
        </el-col>
        <el-col :span="3" class="user-display"  >
            <el-avatar icon="el-icon-user-solid" @click.native="dialogVisible = true;"></el-avatar>
            <div class="user-info">
              <p class="user-id">{{ userid }}</p>
              <p class="user-name">{{ realname }}</p>
            </div>
        </el-col>
      </el-row>
      <el-dialog title="个人信息" :visible.sync="dialogVisible" :modal-append-to-body="false" >
        <div class="user-info">
              <p class="user-id">工号：{{ userid }}</p>
              <p class="user-name">姓名：{{ realname }}</p>
         </div>
         <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="gotoEdit(); dialogVisible = false">修改密码</el-button>
              <el-button @click="dialogVisible = false">确定</el-button>
            </span>
        </el-dialog>
    </el-header>
    
  </template>
  
  <script>
  export default {
    data() {
      return {
        realname: localStorage.getItem('realname'),
        userid: localStorage.getItem('userid'),
        dialogVisible: false
      };
    },
    methods: {
      gotoMain() {
        if (this.$route.path !== "/projects") {
          this.$router.push("/projects");
          
        }
      },
      gotoEmp() {
        this.$router.push("/employee");
      },
      gotoStandardlib() {
        this.$router.push("/standardlib");
      },
      gotoEquipmentlib() {
        this.$router.push("/equipmentlib");
      },
      gotoEdit(){
        this.$router.push("/edit");
      }
    },

  };
  </script>
  
  <style>
    .header {
    position: fixed;
    top: 0;
    left: 120px;
    right: 120px;
    /* left: 0;
    right: 0; */
    z-index: 1000; 
    background-color: #FFFFFF; 
    border-bottom: solid;
    border-color: #66666672;
   /* box-shadow: 0 2px 4px rgba(0,0,0,.1);  */
    }
    .header img{
      cursor: pointer;
    }
    .el-avatar{
      cursor: pointer;
    }
    .header .el-button{
      /* color:#333; */
      font-weight: 500;
      font-size: 17px;
      font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
    }
    .header .el-col{
      margin-top:5px;
    }

  </style>
  