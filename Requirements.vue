<template>
    <el-container>
        <NavBar></NavBar>
        <el-main>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ name: 'projects' ,params:this.params}">项目列表</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ name: 'standard' ,params:this.params}">标准列表</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ name: 'subprojects', params:this.params} ">子项列表</el-breadcrumb-item>
                <el-breadcrumb-item>要求</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button class="right0" @click="gotoDetails(scope.row.id)">管理要求</el-button>
            <el-input class="right" placeholder="请输入搜索关键词" v-model="keyword" clearable prefix-icon="el-icon-search" @clear="onSearchClick"
            @keyup.enter.native="onSearchClick" @input="onSearchClick">
          </el-input>
            <el-table stripe :data="projects">
        <el-table-column prop="name" label="要求" width="1000px"></el-table-column>
        <el-table-column prop="状态" label="完成状态" width="300px"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button @click="gotoDetails(scope.row.id)">查看</el-button>
            <el-button type="danger" @click="deleteproject(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
        </el-main>
        
    </el-container>
   


</template>
<script>
import NavBar from './NavBar.vue';
export default{
    components:{
        NavBar
    },
    data(){
        return{
            username: localStorage.getItem('realname'),
            userid: localStorage.getItem('userid'),
            projects: [],
            totalPages: 0,
            currentPage: 1,
            pageSize: 8,
            totalResults: 0,
            keyword: '',
            open: false,
            title: "创建新项目",
            form: {
                name: '',
                reason: ''
            },


            params:{
                projectid:this.$route.params.projectid,
                standardid:this.$route.params.standardid,
                subpid:this.$route.params.subpid
        }
        }
    },
    methods:{
        onSearchClick() {
      console.log(this.keyword)
      this.currentPage = 1
      this.fetchProjects()
    },

    },
    async fetchProjects() {
      try {
        const response = await this.$http.post('/v1/project/listsearchPage', {

          token: localStorage.getItem('token'),
          pagenumber: this.currentPage,
          pagesize: this.pageSize,
          search: this.keyword

        });
        console.log('后端返回：' + response.data.data.current)
        console.log(response.data.data.projects)
        this.projects = response.data.data.records;

        this.currentPage = response.data.data.current;
        this.pageSize = response.data.data.size;
        this.totalResults = response.data.data.total;
        this.totalPages = response.data.data.pages;
      } catch (error) {
        console.error('请求错误:', error);
      }
    }
}
</script>
<style>
.right {
    float: left;
    width: 300px;
    padding: 10px;
}
.right0{
    float: left;
    width: 70px;
    padding: 10px;
    padding: 10px 0;
    margin: 12px;
}
</style>