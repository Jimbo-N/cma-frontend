<template>
  <el-container>
    <NavBar></NavBar>
    <el-main>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'projects', params: this.params }">项目列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'standard', params: this.params }">标准列表</el-breadcrumb-item>
        <el-breadcrumb-item>子项列表</el-breadcrumb-item>
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

      <el-table stripe :data="parameter">
        <el-table-column prop="name" label="子项目名称（产品/项目/参数）"></el-table-column>
        <el-table-column prop="status" label="完成状态"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" @click="gotorequirements(scope.row.id)">查看</el-button>
            <el-button type="text" icon="el-icon-delete" @click="deleteproject(scope.row.id)">删除</el-button>
            <el-button type="text" icon="el-icon-edit" @click="showModifyDialog(scope.row)">修改</el-button>
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
export default {
  components: {
    NavBar
  },
  data() {
    return {
      params: {
        projectid: null,
        standarditemid: null,
        parameterid: null,
      },
      username: localStorage.getItem('realname'),
      userid: localStorage.getItem('userid'),
      parameter: [],
      chosenParameter: {},
      openOfModify: false,
      totalPages: 0,
      currentPage: 1,
      pageSize: 8,
      totalResults: 0,
      keyword: '',
      open: false,
      title: "创建新项目",
      form: {
        name: '',
      },
      rules: {
        name: [
          { required: true, message: "子项目名称不能为空", trigger: "blur" }
        ]
      }
    }
  },
  created() {
    this.params.projectid = localStorage.getItem("projectid")
    this.params.standarditemid = localStorage.getItem("standarditemid")
    this.fetchParameter();
  },
  methods: {
    gotorequirements(id) {
      this.params.parameterid = id
      localStorage.setItem("parameterid",id)
      this.$router.push({ name: 'requirements'})
    },
    async fetchParameter() {
      try {
        const response = await this.$http.post('/v1/parameter/listSearchPage', {

          token: localStorage.getItem('token'),
          pagenumber: this.currentPage,
          pagesize: this.pageSize,
          search: this.keyword,
          standarditemid: this.params.standarditemid


        });

        this.parameter = response.data.data.records;
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
      this.fetchParameter();
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.fetchParameter()
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
          this.addParameter()
          this.cancel()

        }
      });

    },


    async addParameter() {
      try {
        const response = await this.$http.post('/v1/parameter/addParameter', {

          token: localStorage.getItem('token'),
          name: this.form.name,
          standarditemid: this.params.standarditemid,
          sop: '',
          facility: '',
          bidui: '',
          moni: '',
          samplepic:'',
          sampleinfo:'',
        })
        if (response.data.code === 200) {
          this.$message.success("添加成功")
        };
      } catch (error) {
        console.error('请求错误:', error);
      }
      await this.waitforme(100);
      this.fetchParameter()
    },

    waitforme(millisec) {
      return new Promise(resolve => {
        setTimeout(() => { resolve('') }, millisec);
      })
    },

    async deleteParameter(id) {
      try {
        const response = await this.$http.post('/v1/parameter/deleteParameter', {

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
      this.fetchParameter();
    },
    showModifyDialog(chosenParameter) {
      this.openOfModify = true
      this.chosenParameter = chosenParameter
    },
    async modifyParameter() {
      try {
        const response = await this.$http.post('/v1/parameter/updateParameter', {

          token: localStorage.getItem('token'),
          id: this.chosenParameter.id,
          name: this.chosenParameter.name,
        })
        if (response.data.code === 200) {
          this.$message.success("修改成功")
        }
      } catch (error) {
        console.error('请求错误:', error);
      }
    },
    onSearchClick() {

      this.currentPage = 1
      this.fetchParameter()
    }
  }

}
</script>