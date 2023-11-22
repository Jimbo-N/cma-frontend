<template>
    <el-container>
      <el-header class="header">
        <el-row :gutter="15">
          <el-col :span="2">
              <img src="@/assets/logo.png" alt="Logo" class="logo" @click="gotoMain" >
          </el-col>
          <el-col :span="2" :offset="13">
            <el-button type="text" @click="gotoEmp">人员信息</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="text" @click="gotoStandardlib">&nbsp;&nbsp;标准库</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="text" @click="gotoEquipmentlib">设备库</el-button>
          </el-col>
          <el-col :span="3" class="user-display">
            <el-avatar icon="el-icon-user-solid"></el-avatar>
              <div class="user-info">
                <p class="user-id">{{ userid }}</p>
                <p class="user-name">{{ username }}</p>
              </div>
          </el-col>
        </el-row>

      </el-header>
      <el-main>
        <el-row :gutter="20"  class="main-header">
          <el-col :span="4">
            <el-input
              placeholder="请输入搜索关键词"
              v-model="keyword"
              clearable
              prefix-icon="el-icon-search"
              @clear="onSearchClick"
              @keyup.enter.native="onSearchClick">
            </el-input>
          </el-col>
          <!-- <el-col :span="2">
            <el-button type="text" icon="el-icon-search" @click="onSearchClick"></el-button>
          </el-col> -->
          <el-col :span="2">
            <el-button type="primary" >创建项目</el-button>
          </el-col>
        </el-row>

        <el-table  stripe :data="projects"   >
          <el-table-column prop="name" label="项目名称"></el-table-column>
          <el-table-column prop="status" label="状态"></el-table-column>
          <el-table-column prop="person" label="负责人"></el-table-column>
          <el-table-column prop="datetime" label="日期"></el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button @click="gotoDetails(scope.row.id)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination class="bottom"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          layout="sizes, total,prev, pager, next"
          :total="totalResults">
        </el-pagination>
      </el-main>
    </el-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username:localStorage.getItem('username'),
        userid: localStorage.getItem('userid'),
        projects: [],
        totalPages: 0,
        currentPage: 1,
        pageSize: 5,
        totalResults: 0,
        keyword: null
        
      };
    },
    created() {
      //应该是在登陆成功后放的，先放在这了
      localStorage.setItem('username','张三')
      localStorage.setItem('userid','010')
      this.fetchProjects();
    },
    methods: {
      async fetchProjects() {
        try {
          const response = await this.$http.post('/v1/project/listAllPage', {
            params: {
              pagenumber: this.currentPage,
              pagesize: this.pageSize,
              search:this.keyword
            }
          });
          console.log('后端返回：'+response.data.data.current)
          console.log(response.data.data.projects)
          this.projects = response.data.data.projects;

          this.currentPage = response.data.data.current;
          this.pageSize = response.data.data.size;
          this.totalResults = response.data.data.total;
          this.totalPages = Math.ceil(this.totalResults/this.pageSize);
        } catch (error) {
          console.error('请求错误:', error);
        }
      },
      handlePageChange(newPage) {
        this.currentPage = newPage;
        this.fetchProjects();
      },
      gotoDetails(name){
        console.log(name)
      },
      onSearchClick(){
        console.log(this.keyword)
        this.currentPage = 1
      },
      handleSizeChange(newSize){
        this.pageSize = newSize
        this.fetchProjects()
      },
      gotoMain(){
        if (this.$route.path !== "/projects") {
          this.$router.push("/projects");
        }
      },
      gotoEmp(){
        if (this.$route.path !== "/employee") {
          this.$router.push("/employee");
        }
      },
      gotoStandardlib(){
        if (this.$route.path !== "/standardlib") {
          this.$router.push("/standardlib");
        }
      },
      gotoEquipmentlib(){
        if (this.$route.path !== "/equipmentlib") {
          this.$router.push("/equipmentlib");
        }
      }
    }
  };
  </script>

  <style>
  .el-container{
    padding: 0 100px;
  }
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
    .header .el-button{
      /* color:#333; */
      font-weight: 500;
      font-size: 17px;
      font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
    }
    .header .el-col{
      margin-top:5px;
    }

  .el-main {
    padding-top: 20px; /* 根据你的header高度来调整 */
  }
  .main-header{
    margin-bottom: 20px;
  }
  .logo{
    height: 50px;
    width: auto;
  }
  .user-display {
    display: flex; /* 使用 Flex 布局 */
    align-items: center; /* 垂直居中对齐子元素 */
  }

  .user-info {
    padding-left: 10px;
    font-weight: bold; /* 用户信息加粗 */
  }

  .user-name, .user-id {
    margin: 0; 
    color: #666; 
    font-size: 14px; 
  }

  .user-name {
    
    margin-bottom: 5px; /* 用户名和用户 ID 之间的间距 */
  }
  .bottom{
    margin-top: 10px;
  }
</style>
  
  