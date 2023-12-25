<template>
  <el-container>
    <NavBar></NavBar>
    <el-main>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'projects' }">项目列表</el-breadcrumb-item>
        <el-breadcrumb-item>标准列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- <el-row>项目id:{{ params.projectid }}</el-row>
        <el-button @click="gotosub(5)">去子项列表的按钮</el-button> -->

        <el-row style="width: 80%;height: 30px;">
        <el-col :span="6">当前项目:{{ this.project.name }}</el-col>
      </el-row>

      <el-row :gutter="20" class="main-header">
        <el-col :span="4">
          <el-input placeholder="请输入搜索关键词" v-model="keyword" clearable prefix-icon="el-icon-search" @clear="onSearchClick"
            @keyup.enter.native="onSearchClick" @input="onSearchClick">
          </el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="showModify = true">新增标准</el-button>
        </el-col>
      </el-row>

      <el-table stripe :data="standard">
        <el-table-column prop="standard.bigCategory" label="大类"></el-table-column>
        <el-table-column prop="standard.category" label="类别"></el-table-column>
        <el-table-column label="依据的标准方法">
          <el-table-column prop="standard.name" label="标准名称"></el-table-column>
          <el-table-column prop="standard.number" label="标准编号"></el-table-column>
        </el-table-column>
        <el-table-column prop="status" label="完成状态">
          <template scope="scope">
          <div v-if="scope.row.status === '已完成'" style="color:green;">{{scope.row.status}}</div>
          <div v-if="scope.row.status === '未完成'" style="color:red;">{{scope.row.status}}</div>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" @click="gotoparameter(scope.row)">查看</el-button>
            <el-button type="text" icon="el-icon-delete" @click="deletestandardItem(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>


      <el-pagination class="bottom" @current-change="handlePageChange" @size-change="handleSizeChange"
        :current-page="currentPage" :page-size="pageSize" :page-sizes="[8, 15, 30]"
        layout="sizes, total,prev, pager, next" :total="totalResults">
      </el-pagination>

    </el-main>
    <el-dialog title="编辑标准" :visible.sync="showModify" width="80%" :before-close="processModify">
    <el-container slot="footer" class="diagFoot">
      <table-transfer filterable :filter-method="filterMethod" filter-placeholder="搜索标准" row-key="id"
        :titles="['标准库', '已选标准']" v-model="value" :data="data">
        <template>

          <el-table-column label="大类" prop="bigCategory"></el-table-column>
          <el-table-column label="类别" prop="category"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="编号" prop="number"></el-table-column>
        </template>
      </table-transfer>
      <el-row>
        <el-button type="primary" class="savebtn" @click="saveDevice()">保存设置</el-button>
      </el-row>
    </el-container>

  </el-dialog>
  <el-dialog title="是否保存修改？" :visible.sync="showConfirm" width="20%" center>
    <el-container slot="footer" class="confirmDiagFoot">
      <el-button @click="saveDevice">确认</el-button>
      <el-button @click="closeMakesure">取消</el-button>
    </el-container>

  </el-dialog>
  </el-container>
  
</template>

<script>
import NavBar from './NavBar.vue'
import TableTransfer from '@/components/TableTransfer/index.vue'
export default {
  components: {
    NavBar,
    TableTransfer
  },
  data() {
    return {
      project:JSON.parse(localStorage.getItem("project")),

      standard: [],
      totalPages: 0,
      currentPage: 1,
      pageSize: 8,
      totalResults: 0,
      keyword: '',
      showModify: false,
      modifySaved: true,
      showConfirm: false,
      data: [],
      value: [],              //获取后端数据
      value2: []
    }
  },
  created() {
    this.fetchStandard()
    this.getallstandard()
    this.getproject()
  },
  methods: {
    gotoparameter(item) {
      localStorage.setItem("standarditem", JSON.stringify(item))
      this.$router.push({ name: 'parameter' })

    },
    async fetchStandard() {
      try {
        const response = await this.$http.post('/v1/standardItem/listSearchPage', {

          token: localStorage.getItem('token'),
          pagenumber: this.currentPage,
          pagesize: this.pageSize,
          search: this.keyword,
          projectid: this.project.id

        });
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
        const response = await this.$http.post('/v1/standardItem/deleteStandardItem', {

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
    },

    sendModify() {
      this.modifySaved = true;

    }
    , processModify(done) {

      if (this.modifySaved == true) {
        done();
      }
      else {
        this.showConfirm = true;
        return false;
      }
    }
    , showSuccess() {

      this.$message({
        message: "保存成功",
        type: 'success'
      }
      )
    }
    , saveDevice() {
      this.modifySaved = true;
      this.showConfirm = false;
      this.showModify = false;

      var sleep = (delaytime) => {
        return new Promise(resolve => setTimeout(resolve, delaytime))
      }
      this.updatestandarditem()
      sleep(100).then(() => {
        this.getproject()
        this.fetchStandard()
      })
    },
    waitforme(millisec) {
      return new Promise(resolve => {
        setTimeout(() => { resolve('') }, millisec);
      })
    }
    , closeMakesure() {
      this.modifySaved = true;
      this.showConfirm = false;
      this.showModify = false;
      this.getproject()
    }
    , filterMethod(query, item) {

      return item.name.indexOf(query) > -1;
    }
    , async getallstandard() {
      try {
        const resp = await this.$http.post('/v1/standard/listAll', {
          token: localStorage.getItem('token'),
        });
        this.data = resp.data.data;

      }
      catch (e) {
        // alert("fail to get device");
        
      }
    },
    async getproject() {
      try {
        const response = await this.$http.post('/v1/project/getbyid', {
          token: localStorage.getItem('token'),
          id: this.project.id
        });
        if (response.data.code === 200) {
          var temp1 = response.data.data.standardItemList
          temp1.forEach(element => {
            this.value.push(element.standard.id)
            this.value2.push(element.standard)
          });
        }
        else {
          this.$message.error(response.data.message)
        }
      }
      catch (e) {
        
      }
    },
    async updatestandarditem() {
      try {
        const response = await this.$http.post('/v1/project/updateStandarditem', {

          token: localStorage.getItem('token'),
          id: this.project.id,
          standardidlist: this.value

        })
        if (response.data.code === 200) {
          this.$message.success("更新成功")
        }
        else {
          this.$message.error(response.data.message)
        }
      } catch (error) {
        console.error('请求错误:', error);
      }
    }

  }


}
</script>


