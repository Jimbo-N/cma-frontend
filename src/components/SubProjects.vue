<template>
    <el-container>
        <NavBar></NavBar>
        <el-main>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ name: 'projects' ,params:this.params}">项目列表</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ name: 'standard' ,params:this.params}">标准列表</el-breadcrumb-item>
                <el-breadcrumb-item >子项列表</el-breadcrumb-item>
            </el-breadcrumb>
    



    <el-row :gutter="20" class="main-header">
    <el-col :span="4">
      <el-input placeholder="请输入搜索关键词" v-model="keyword" clearable prefix-icon="el-icon-search" @clear="onSearchClick"
        @keyup.enter.native="onSearchClick" @input="onSearchClick">
      </el-input>
    </el-col>
    <el-col :span="2">
      <el-button type="primary" @click="handleAdd">创建子项目</el-button>
    </el-col>
  </el-row>

  <el-table stripe :data="subprojects">
    <el-table-column prop="number" label="条款号"></el-table-column>
    <!-- <el-table-column prop="name" label="子项目名称"></el-table-column> -->
    <el-table-column label="子项目名称（产品/项目/参数）">
      <template slot-scope="scope">
        <el-button @click="gotorequirements(scope.row.id)">{{scope.row.name}}</el-button>
      </template>
    </el-table-column>
    <el-table-column prop="status" label="完成状态"></el-table-column>
    <el-table-column>
      <template slot-scope="scope">
        <el-button type="danger" @click="deleteproject(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>


  <el-pagination class="bottom" @current-change="handlePageChange" @size-change="handleSizeChange"
    :current-page="currentPage" :page-size="pageSize" :page-sizes="[8, 15, 30]"
    layout="sizes, total,prev, pager, next" :total="totalResults">
  </el-pagination>
        </el-main>

        <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
  <el-form ref="form" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="子项目名称" prop="name">
      <el-input v-model="form.name" placeholder="请输入子项目名称" />
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" @click="submitForm('form')">确定</el-button>
    <el-button @click="cancel">取消</el-button>
  </div>
</el-dialog>


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
            standardid:this.$route.params.standardid,
            subpid:null,
    },
    username: localStorage.getItem('realname'),
    userid: localStorage.getItem('userid'),
    subprojects: [],
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
    rules: {
        name: [
        { required: true, message: "子项目名称不能为空", trigger: "blur" }
        ]
    }
    }
},
created() {
this.fetchSubProjects();
},
methods:{
    gotorequirements(id){
        this.params.subpid = id
        this.$router.push({ name: 'requirements', params: this.params })
    },
    async fetchSubProjects() {
  try {
    const response = await this.$http.post('/v1/project/listsearchPage', {

      token: localStorage.getItem('token'),
      pagenumber: this.currentPage,
      pagesize: this.pageSize,
      search: this.keyword

    });
    console.log('后端返回：' + response.data.data.current)
    console.log(response.data.data.projects)
    this.subprojects = response.data.data.records;
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
  this.fetchSubProjects();
},
handleSizeChange(newSize) {
  this.pageSize = newSize
  this.fetchSubProjects()
},
cancel() {
  this.open = false;
  this.reset();
},
reset() {
  this.form = {
    name: '',
    reason: ''
  }

},
handleAdd() {
  this.reset();
  this.open = true;

},
submitForm(formName) {
  this.$refs[formName].validate(valid => {
    if (valid) {
      this.addProject()
      this.cancel()

    }
  });

},


async addProject() {
  try {
    const response = await this.$http.post('/v1/project/addproject', {

      token: localStorage.getItem('token'),
      name: this.form.name,
      reason: this.form.reason

    })
    if (response.data.code === 200) {
      this.$message.success("添加成功")
    };
  } catch (error) {
    console.error('请求错误:', error);
  }
  await this.waitforme(100);
  this.fetchSubProjects()
},

waitforme(millisec) {
  return new Promise(resolve => {
    setTimeout(() => { resolve('') }, millisec);
  })
},

async deleteproject(id) {
  try {
    const response =await  this.$http.post('/v1/project/deleteproject', {

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
  this.fetchSubProjects();
},
}

}
</script>