<template>
  <el-container>
    <NavBar></NavBar>
    <el-main>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'projects', params: this.params }">项目列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'standard', params: this.params }">标准列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'subprojects', params: this.params }">产品/项目/参数</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'requirements', params: this.params }">要求</el-breadcrumb-item>
        <el-breadcrumb-item>对比试验</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="search">
        <el-input placeholder="请输入搜索关键词" v-model="keyword" clearable prefix-icon="el-icon-search" @clear="onSearchClick"
            @keyup.enter.native="onSearchClick" @input="onSearchClick">
          </el-input>
      </div>
      <el-table stripe :data="bidui">
        <el-table-column prop="id" label="序号"></el-table-column>
        <el-table-column prop="requirement" label="选择">
          <template slot-scope="scope">
              <el-select v-model="scope.row.requirement" placeholder="请选择要求">
              <el-option label="无要求" value="no-requirement"></el-option>
              <el-option label="有要求" value="with-requirement"></el-option>
              </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
              <el-upload
              v-if="scope.row.requirement === 'with-requirement'"
              action="https://your-upload-endpoint.com"
              :on-success="onUploadSuccess(scope.row)"
              :before-upload="beforeUpload(scope.row)"
              :data="{ id: scope.row.id }">
              <el-button size="small" type="primary">上传文件</el-button>
              </el-upload>
          </template>
       </el-table-column> 

      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import { reactive, computed, toRefs } from 'vue';
import NavBar from '../NavBar.vue';

export default {
  components: {
    NavBar,
  },
  data() {
  return {
      bidui: [],
      keyword: '',
      onSearchClick,
      onUploadSuccess,
      beforeUpload,
      filteredData,
      // ...toRefs(state),
    };
  },
  created() {
    this.fetchbidui();
  },
  // setup() {
  //   const state = reactive({
  //     keyword: '',
  //     tableData: [
  //       { id: 1, name: '样品信息一览表', status: '完成' },
  //       { id: 2, name: '样品照片', status: '进行中' },
  //     ],
      
  //   });

  //   const filteredData = computed(() => {
  //     if (!state.keyword) {
  //       return state.tableData;
  //     }
  //     return state.tableData.filter((data) =>
  //       data.name.toLowerCase().includes(state.keyword.toLowerCase())
  //     );
  //   });
  // },
    methods: {
      async fetchbidui() {
      try {
        const response = await this.$http.post('/v1/parameter/updateParameter', {
          token: localStorage.getItem('token'),
        });
        
        console.log(response.data.data.bidui)
        this.bidui = response.data.data.records;
        this.status = response.data.data.status;
      } catch (error) {
        console.error('请求错误:', error);
      }
    },
    onSearchClick() {
      console.log(this.keyword)
      this.currentPage = 1
      this.fetchbidui()
    },
     onUploadSuccess(response, row) {
      console.log('上传成功', response, row);
      // 在这里更新数据模型，将上传的文件添加到当前行的文件列表中
      if (!row.files) {
        row.files = [];
      }
      row.files.push({ name: response.name, url: response.url });
    },

     beforeUpload(file, row) {
      console.log('上传文件', file);
      // 这里可以添加一些上传前的验证逻辑
      return true;
    },
 }
};
</script>


<style scoped>
  .search{
  margin: 20px 0;
  display: flex; /* 使用flex布局 */
  justify-content: flex-start; /* 让搜索框靠左对齐 */
  float: left;
  }

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
table, th, td {
  border: 1px solid #ddd;
}
th, td {
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
.logo {
height: 50px;
width: auto;
}
</style>