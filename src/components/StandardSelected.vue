<template>
    <el-container>
        <NavBar></NavBar>
        <el-main>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/projects' }">项目列表</el-breadcrumb-item>
                <el-breadcrumb-item >标准列表</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- 下面两行和后端打通后注释掉 -->
        <el-row>项目id:{{ params.projectid }}</el-row>
        <el-button @click="gotosub(5)">去子项列表的按钮</el-button>


        <el-row :gutter="20" class="main-header">
        <el-col :span="4">
          <el-input placeholder="请输入搜索关键词" v-model="keyword" clearable prefix-icon="el-icon-search" @clear="onSearchClick"
            @keyup.enter.native="onSearchClick" @input="onSearchClick">
          </el-input>
        </el-col>
      </el-row>
      <!-- 标准里有哪些属性，参考接口文档-->
      <el-table stripe :data="standarditem">
        <el-table-column prop="name" label="大类名称"></el-table-column>
        <el-table-column prop="number" label="类别序号"></el-table-column>
        <el-table-column prop="standard" label="依据的标准方法">
            <el-table-column prop="sname" label="名称"></el-table-column>
            <el-table-column prop="snumber" label="编号"></el-table-column>
        </el-table-column>

        <el-table-column>
            <template slot-scope="scope">
            <el-button @click="gotosub(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>

      </el-table>


      <el-pagination class="bottom" @current-change="handlePageChange" @size-change="handleSizeChange"
        :current-page="currentPage" :page-size="pageSize" :page-sizes="[8, 15, 30]"
        layout="sizes, total,prev, pager, next" :total="totalResults">
      </el-pagination>

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
            params:{
                projectid:this.$route.params.projectid,
                standardid:null,
                subid:null
            },
        standarditem:[],
        totalPages: 0,
        currentPage: 1,
        pageSize: 8,
        totalResults: 0,  
        }
    },
    created() {
      
    this.fetchStandard();
    },
    methods:{
        gotosub(id){
            this.params.standardid = id
            this.$router.push({ name: 'subprojects', params: this.params })    
            console.log("params:"+JSON.stringify(this.params))
        },
        async fetchStandard() {
            try {
                const response = await this.$http.post('/v1/standardItem/listSearchPage', {//url没改

                    token: localStorage.getItem('token'),
                    pagenumber: this.currentPage,
                    projectid: this.params.projectid,//传入的参数缺了
                    pagesize: this.pageSize,
                    search: this.keyword

                });
                console.log('后端返回：' + response.data.data.current)
                console.log(response.data.data.projects)
                this.standarditem = response.data.data.records;//最好叫standitem，和后端保持一致，standard是标准库页面用到的名称
                this.currentPage = response.data.data.current;
                this.pageSize = response.data.data.size;
                this.totalResults = response.data.data.total;
                this.totalPages = response.data.data.pages;
            } catch (error) {
                console.error('请求错误:', error);
            }
    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
      this.fetchStandard();
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.fetchStandard()
    },
    }
}
</script>


