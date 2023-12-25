<template>
  <el-container>
      <el-main>
        <el-row :gutter="20" class="main-header">
          <el-col :span="4">
            <el-input placeholder="请输入搜索关键词" v-model="keyword" clearable prefix-icon="el-icon-search"
              @clear="onSearchClick" @keyup.enter.native="onSearchClick" @input="onSearchClick">
            </el-input>
          </el-col>
          <!-- <el-col :span="2">
            <el-button type="text" icon="el-icon-search" @click="onSearchClick"></el-button>
          </el-col> -->
          <el-col :span="2">
            <el-button type="primary" @click="handleAdd">创建项目</el-button>
          </el-col>
        </el-row>


        <el-table stripe :data="projects">
          <el-table-column prop="name" label="项目名称" align="center"></el-table-column>
          <el-table-column prop="status" label="完成状态" align="center">
            <template scope="scope">
              <div v-if="scope.row.status === '已完成'" style="color:green;">{{ scope.row.status }}</div>
              <div v-if="scope.row.status === '未完成'" style="color:red;">{{ scope.row.status }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="createUser.realname" label="创建人" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建日期" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-view" @click="gotoDetails(scope.row)">查看</el-button>
              <el-button type="text" icon="el-icon-delete" @click="deleteproject(scope.row.id)">删除</el-button>
              <el-button type="text" icon="el-icon-download" @click="generateTables(scope.row.id)">生成表格</el-button>
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
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入项目名称" />
          </el-form-item>

          <el-form-item label="立项依据" prop="reason">
            <el-input v-model="form.reason" type="textarea" placeholder="请输入立项依据"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm('form')">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>
      <!--    生成表格对话框-->
      <el-dialog :title="title2" :visible.sync="open2" width="600px" append-to-body>
        <el-row type="flex" align="middle" style="width: 100%">
          <el-col :span="6" style="font-size: 15px;">仪器设备信息表：</el-col>
          <el-col :span="5"><el-button style="font-size: 15px;" type="text" v-if="table3" @click="download(table3.id)">{{
            table3.filename }}</el-button></el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="7" style="font-size: 15px;">检验检测能力申请表:</el-col>
          <el-col :span="5"><el-button style="font-size: 15px;" type="text" v-if="table4" @click="download(table4.id)">{{
            table4.filename }}</el-button></el-col>
        </el-row>
        <el-row type="flex" align="middle">
          <el-col :span="9" style="font-size: 15px;">仪器设备(标准物质)配置表：</el-col>
          <el-col :span="5"><el-button style="font-size: 15px;" type="text" v-if="table5" @click="download(table5.id)">{{
            table5.filename }}</el-button></el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeGenerate" type="primary">关闭</el-button>
        </div>
      </el-dialog>
  </el-container>
</template>
  
<script>

import axios from "axios";
export default {
  components: {
  },
  data() {
    return {
      realname: localStorage.getItem('realname'),
      userid: localStorage.getItem('userid'),
      projects: [],
      totalPages: 0,
      currentPage: 1,
      pageSize: 8,
      totalResults: 0,
      keyword: '',
      open: false,
      title: "创建新项目",
      title2: "生成表格",
      open2: false,
      form: {
        name: '',
        reason: ''
      },
      rules: {
        name: [
          { required: true, message: "项目名称不能为空", trigger: "blur" }
        ],
        reason: [
          { required: true, message: "立项依据不能为空", trigger: "blur" },
          { min: 3, max: 1000, message: '长度在 3 到 1000 个字符', trigger: 'blur' }
        ],
      },
      table3: {},
      table4: {},
      table5: {}
    };
  },
  created() {
    this.fetchProjects();
  },
  methods: {
    cancel() {
      this.open = false;
      this.reset();
    },
    closeGenerate() {
      this.open2 = false
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
        }
        else {
          this.$message.error(response.data.message)
        }
      } catch (error) {
        console.error('请求错误:', error);
      }
      await this.waitforme(100);
      this.fetchProjects()
    },

    waitforme(millisec) {
      return new Promise(resolve => {
        setTimeout(() => { resolve('') }, millisec);
      })
    },

    async deleteproject(id) {
      try {
        const response = await this.$http.post('/v1/project/deleteproject', {

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
      this.fetchProjects();
    },
    async fetchProjects() {
      try {
        const response = await this.$http.post('/v1/project/listSearchPage', {

          token: localStorage.getItem('token'),
          pagenumber: this.currentPage,
          pagesize: this.pageSize,
          search: this.keyword

        });

        this.projects = response.data.data.records;

        this.currentPage = response.data.data.current;
        this.pageSize = response.data.data.size;
        this.totalResults = response.data.data.total;
        this.totalPages = response.data.data.pages;
      } catch (error) {
        console.error('请求错误:', error);
      }
    },
    async generateTables(id) {
      this.table3 = {}
      this.table4 = {}
      this.table5 = {}
      try {
        const response = await this.$http.post('/v1/project/generateexcel', {

          token: localStorage.getItem('token'),
          id: id
        })
        if (response.data.code === 200) {
          const fileList = response.data.data.fileList
          this.table3 = fileList[0]
          this.table4 = fileList[1]
          this.table5 = fileList[2]
          this.title2 = "生成成功"
          this.open2 = true
        } else {
          this.title2 = "生成失败"
          this.open2 = true
        }

      } catch (error) {
        console.error('请求错误:', error);
      }
    },
    async download(id) {
      window.open(axios.defaults.baseURL + '/v1/file/download/' + id)

    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
      this.fetchProjects();
    },
    gotoDetails(item) {
      localStorage.setItem("project",JSON.stringify(item))
      this.$router.push({ name: 'standard' });
    },
    onSearchClick() {

      this.currentPage = 1
      this.fetchProjects()
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.fetchProjects()
    },

  }
};
</script>

<style>
.el-container {
  padding: 0px 10px;
}



.el-main {
  padding-top: 20px;
  /* 根据你的header高度来调整 */
}

.main-header {
  margin-bottom: 20px;
}

.logo {
  height: 50px;
  width: auto;
}

.user-display {
  display: flex;
  /* 使用 Flex 布局 */
  align-items: center;
  /* 垂直居中对齐子元素 */
}

.user-info {
  padding-left: 10px;
  margin-top: 5px;
  font-weight: bold;
  /* 用户信息加粗 */
}

.user-name,
.user-id {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.user-name {

  margin-bottom: 5px;
  /* 用户名和用户 ID 之间的间距 */
}

.bottom {
  margin-top: 10px;
}
</style>
  
  