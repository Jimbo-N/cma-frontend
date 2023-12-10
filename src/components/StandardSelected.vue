<template>
    <el-container>
        <NavBar></NavBar>
        <el-main>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/projects' }">项目列表</el-breadcrumb-item>
                <el-breadcrumb-item >标准列表</el-breadcrumb-item>
            </el-breadcrumb>
        <!-- <el-row>项目id:{{ params.projectid }}</el-row>
        <el-button @click="gotosub(5)">去子项列表的按钮</el-button> -->


        <el-row :gutter="20" class="main-header">
        <el-col :span="4">
          <el-input placeholder="请输入搜索关键词" v-model="keyword" clearable prefix-icon="el-icon-search" @clear="onSearchClick"
            @keyup.enter.native="onSearchClick" @input="onSearchClick">
          </el-input>
        </el-col>
      </el-row>

      <el-table stripe :data="standard">
        <el-table-column prop="standard.bigCategory" label="大类"></el-table-column>
        <el-table-column prop="standard.category" label="类别"></el-table-column>
        <el-table-column label="依据的标准方法">
            <el-table-column prop="standard.name" label="标准名称"></el-table-column>
            <el-table-column prop="standard.number" label="标准编号"></el-table-column>
        </el-table-column>
        <el-table-column prop="status" label="完成状态"></el-table-column>
        <el-table-column>
            <template slot-scope="scope">
            <el-button @click="gotoparameter(scope.row.id)">查看</el-button>
            <el-button type="danger" @click="deletestandardItem(scope.row.id)">删除</el-button>
            
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
                projectid:null,
                standarditemid:null,
                parameterid:null
                
            },
        standard:[],
        totalPages: 0,
        currentPage: 1,
        pageSize: 8,
        totalResults: 0, 
        keyword:'',

        }
    },
    created() {
     this.params.projectid=localStorage.getItem("projectid")
    this.fetchStandard()
    },
    methods:{
        gotoparameter(id){
          localStorage.setItem("standarditemid",id)
            this.$router.push({ name: 'parameter' })    
            
        },
        async fetchStandard() {
            try {
                const response = await this.$http.post('/v1/standardItem/listSearchPage', {

                    token: localStorage.getItem('token'),
                    pagenumber: this.currentPage,
                    pagesize: this.pageSize,
                    search: this.keyword,
                    projectid: this.params.projectid

                });
                console.log('后端返回：' + response.data.data.current)
                console.log(response.data.data.projects)
                this.standard = response.data.data.records;
                this.currentPage = response.data.data.current;
                this.pageSize = response.data.data.size;
                this.totalResults = response.data.data.total;
                this.totalPages = response.data.data.pages;
            } catch (error) {
                console.error('请求错误:', error);
            }
    },
    waitforme(millisec) {
      return new Promise(resolve => {
        setTimeout(() => { resolve('') }, millisec);
      })
    },

    async deletestandardItem(id) {
      try {
        const response =await  this.$http.post('/v1/standardItem/deleteStandardItem', {

          token: localStorage.getItem('token'),
          id: id
        })
        if (response.data.code === 200) {
          this.$message.success("删除成功")
        };
        
      } catch (error) {
        console.error('请求错误:', error);
      }
      await this.waitforme(100);
      this.fetchStandard();
    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
      this.fetchStandard();
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.fetchStandard()
    }
    ,
    onSearchClick() {
      console.log(this.keyword)
      this.currentPage = 1
      this.fetchStandard()
    }
    }
}
</script>


