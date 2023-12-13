<template>
    <el-header class="header">
      <el-row :gutter="15">
        <el-col :span="2">
            <img src="@/assets/logo.png" alt="Logo" class="logo" @click="gotoMain" >
        </el-col>
        <el-col :span="3" :offset="8">
          <el-button :type="$route.path === '/projects' ? 'primary' : 'text'" @click="gotoMain">项目列表</el-button>
        </el-col>
        <el-col :span="2">
          <el-button :type="$route.path === '/employee' ? 'primary' : 'text'" @click="gotoEmp" :hidden="!hasprivilege(4)">用户管理</el-button>
        </el-col>
        <el-col :span="2">
          <el-button :type="$route.path === '/personlib' ? 'primary' : 'text'" @click="gotoPersonlib">人员库</el-button>
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
        <div class="user-inf">
          <div class="user-row">
            <p class="id">工号：{{ userid }}</p>
          </div>
          <div class="user-row">
            <p class="name">姓名：{{ realname }}</p>
          </div>
          <div class="user-row">
            <p class="privilege">权限：{{ convertPrivilegeToText(privilege) }}</p>
          </div>
        </div>
         <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="gotoLogin(); dialogVisible = false">退出登录</el-button>
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
        privilege: localStorage.getItem('privilege'),
        dialogVisible: false
      };
    },
    methods: {
      convertPrivilegeToText(privilege) {
			const privilegeMap = {
				4: '超级管理员',
				3: '管理员',
				2: '技术员',
				1: '浏览者',
				0: '黑名单'
			};
			return privilegeMap[privilege] || '未知权限';
		},
      gotoMain() {
        if (this.$route.path !== "/projects") {
          this.$router.push("/projects");
          
        }
      },
      gotoLogin(){
        this.$router.push("/login");
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
      gotoPersonlib()
      {
        this.$router.push("/personlib");
      },
      gotoEdit(){
        this.$router.push("/edit");
      },
      hasprivilege(num)
		{
			this.getuserinfo()
			var privilege=localStorage.getItem('privilege')
			return privilege>=num
		},
		async getuserinfo()
      {
        try {
          const response = await this.$http.post('/v1/user/getuserinfo', {
            token:localStorage.getItem('token')
          })
          if (response.data.code === 200) {
            
            localStorage.setItem('userid', response.data.data.id)
            localStorage.setItem('realname', response.data.data.realname)
            localStorage.setItem('privilege', response.data.data.privilege)
          } else {
            this.$message.error(response.data.msg)
            console.log(response.data.msg)
			this.$route.push("/login")
          }
        } catch (error) {
          this.$message.error('登录失败')
        }
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

    .user-inf {
  padding: 10px;
  border-radius: 5px;
  font-size: 18px;
  font-weight: bold;
  align-items: center;

  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
}

 .user-row {
  margin-bottom: 10px;
  margin-left: 40%;
  text-align: left;
}

.user-row:last-child {
  margin-bottom: 0;
}



  </style>
  