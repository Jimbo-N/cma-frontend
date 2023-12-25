<template>
  <el-container>
    <el-main>
      <el-row :gutter="20" class="main-header" type="flex" align="middle">
        <el-col :span="4">
          <el-input placeholder="请输入搜索关键词" v-model="keyword" clearable prefix-icon="el-icon-search" @clear="onSearchClick"
            @keyup.enter.native="onSearchClick" @input="onSearchClick">
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" size="small" @click="onSearchClick">搜索</el-button>
        </el-col>


        <el-col :span="7">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="showAddDialog" plain>添加</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" :disabled="deleteButton" @click="batchDelete"
            plain>删除</el-button>
        </el-col>
      </el-row>

      <el-table stripe :data="persons" @selection-change="getChosenRows">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" @click="gotopersoninfo(scope.row)">查看</el-button>
            <el-button type="text" icon="el-icon-edit" @click="showModifyDialog(scope.row)">修改</el-button>
            <el-button type="text" icon="el-icon-delete" @click="deletePerson(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-pagination class="bottom" @current-change="handlePageChange" @size-change="handleSizeChange"
        :current-page="currentPage" :page-size="pageSize" :page-sizes="[8, 15, 30]"
        layout="sizes, total,prev, pager, next" :total="totalResults">
      </el-pagination>


      <!--      添加设备对话框-->
      <el-dialog :title="tittle" :rules="rules" :visible.sync="open" width="700px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="180px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitAddForm">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>

      <!--      修改设备对话框-->
      <el-dialog :title="tittle2" :rules="rules" :visible.sync="openOfModify" width="700px" append-to-body>
        <el-form ref="form" :model="chosenPerson" :rules="rules" label-width="180px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="chosenPerson.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitModifyForm">确定</el-button>
          <el-button @click="cancelModify">取消</el-button>
        </div>
      </el-dialog>
    </el-main>
  </el-container>
</template>


<script>


export default {
  components: {
  },
  data() {
    return {
      realname: localStorage.getItem('realname'),
      userid: localStorage.getItem('userid'),
      keyword: '',
      persons: [],
      chosenPerson: {},
      totalPages: 0,
      currentPage: 1,
      pageSize: 8,
      totalResults: 0,
      open: false,
      openOfModify: false,
      deleteButton: true,
      chosenIds: [],
      tittle: "添加人员",
      tittle2: "修改人员",
      form: {
        name: '',
      },
      rules: {
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
      },
    };
  },
  created() {
    this.getPersons()
  },
  methods: {
    gotopersoninfo(item) {
      localStorage.setItem("person", JSON.stringify(item))
      this.$router.push({ name: 'personinfo' });
    },
    onSearchClick() {

      this.currentPage = 1
      this.getPersons()
    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
      this.getPersons();
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getPersons();
    },
    showAddDialog() {
      this.open = true
    },
    showModifyDialog(chosenPerson) {
      this.openOfModify = true
      this.chosenPerson = chosenPerson
    },
    waitforme(millisec) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('')
        }, millisec);
      })
    },
    getChosenRows(selection) {
      if (selection.length) {
        this.deleteButton = false
        this.chosenIds = selection.map(row => row.id);
      }

    },
    async getPersons() {
      try {
        const response = await this.$http.post('/v1/person/listSearchPage', {

          token: localStorage.getItem('token'),
          pagenumber: this.currentPage,
          pagesize: this.pageSize,
          search: this.keyword

        });

        this.persons = response.data.data.records;

        this.currentPage = response.data.data.current;
        this.pageSize = response.data.data.size;
        this.totalResults = response.data.data.total;
        this.totalPages = response.data.data.pages;
      } catch (error) {
        console.error('请求错误:', error);
      }
    },
    async modifyPerson() {
      try {
        const response = await this.$http.post('/v1/person/updatePerson', {

          token: localStorage.getItem('token'),
          id: this.chosenPerson.id,
          name: this.chosenPerson.name,
        })

        if (response.data.code === 200) {
          this.$message.success("修改成功")
        }
      } catch (error) {
        console.error('请求错误:', error);
      }
      await this.waitforme(100);
      this.getPersons();
    },
    async deletePerson(id) {
      try {
        const response = await this.$http.post('/v1/person/deletePerson', {

          token: localStorage.getItem('token'),
          id: id
        })
        if (response.data.code === 200) {
          this.$message.success("删除成功")
        }
      } catch (error) {
        console.error('请求错误:', error);
      }
      await this.waitforme(100);
      this.getPersons();
    },
    async batchDelete() {
      try {
        const response = await this.$http.post('/v1/person/deletebatchPerson', {

          token: localStorage.getItem('token'),
          personidlist: this.chosenIds
        })
        if (response.data.code === 200) {
          this.$message.success("删除成功")
        }
      } catch (error) {
        console.error('请求错误:', error);
      }
      await this.waitforme(100);
      this.getPersons();
      this.chosenIds = []
    },
    async addPerson() {

      try {
        const response = await this.$http.post('/v1/person/addPerson', {

          token: localStorage.getItem('token'),
          name: this.form.name,
        });

        if (response.data.code === 200) {
          this.$message.success("添加成功")
        }
      } catch (error) {
        console.error('请求错误:', error);
      }
      await this.waitforme(100);
      this.getPersons();
    },
    cancel() {
      this.open = false;
      this.form = {
        name: '',
      }
    },
    cancelModify() {
      this.openOfModify = false;
      this.chosenPerson = {}
    },
    async submitAddForm() {
      this.addPerson()
      await this.waitforme(100);
      this.getPersons();
      this.cancel()
    },
    async submitModifyForm() {
      this.modifyPerson()
      await this.waitforme(100);
      this.getPersons();
      this.cancelModify()
    }
  }
}
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

.header img {
  cursor: pointer;
}

.header .el-button {
  /* color:#333; */
  font-weight: 500;
  font-size: 17px;
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
}

.header .el-col {
  margin-top: 5px;
}

.demo-table-expand label {
  width: 130px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}</style>