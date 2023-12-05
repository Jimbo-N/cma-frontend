<template>
  <el-container>
    <NavBar></NavBar>
    <el-main>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'projects', params: this.params }">项目列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'standard', params: this.params }">标准列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'subprojects', params: this.params }">产品/项目/参数</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'requirements', params: this.params }">要求</el-breadcrumb-item>
        <el-breadcrumb-item>模拟实验</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="search">
      <el-input
        placeholder="请输入搜索关键词"
        v-model="keyword"
        clearable
        prefix-icon="el-icon-search"
        @clear="onSearchClick"
        @keyup.enter.native="onSearchClick"
      ></el-input>
      </div>
      <el-table stripe :data="filteredData">
        <el-table-column prop="id" label="序号"></el-table-column>
        <el-table-column prop="name" label="要求名称"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-upload
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
  setup() {
    const state = reactive({
      keyword: '',
      tableData: [
        { id: 1, name: '模拟实验报告', status: '完成' },
        { id: 2, name: '原始记录', status: '进行中' },
      ],
      
    });

    const filteredData = computed(() => {
      if (!state.keyword) {
        return state.tableData;
      }
      return state.tableData.filter((data) =>
        data.name.toLowerCase().includes(state.keyword.toLowerCase())
      );
    });

    function onSearchClick() {
      // 搜索逻辑可以在这里实现，目前通过computed属性自动处理过滤
    }

    function onUploadSuccess(response, file, fileList) {
      console.log('上传成功', response, file, fileList);
    }

    function beforeUpload(file) {
      console.log('上传文件', file);
      // 这里可以添加一些上传前的验证逻辑
      return true;
    }

    return {
      ...toRefs(state),
      onSearchClick,
      onUploadSuccess,
      beforeUpload,
      filteredData,
    };

  },
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