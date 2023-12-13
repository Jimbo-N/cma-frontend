<template>
  <el-container>
    <NavBar></NavBar>
    <el-main>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'projects', params: this.params }">项目列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'standard', params: this.params }">标准列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'parameter', params: this.params }">产品/项目/参数</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'requirements', params: this.params }">要求</el-breadcrumb-item>
        <el-breadcrumb-item>模拟试验</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row :gutter="20">
        <el-col :span="10">
          <label for="pdfResult">模拟实验报告：</label>
          <span id="pdfResult">{{ this.moni }}</span>
        </el-col>
        <el-col :span="5">
          <el-input v-model="linkToUpload" placeholder="请输入链接"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="uploadLink">上传链接</el-button>
        </el-col>
        <el-col :span="2">
          <el-button icon="el-icon-document" @click="copyText">复制链接</el-button>
        </el-col>
      </el-row>

    </el-main>
  </el-container>
</template>

<script>
import NavBar from '../NavBar.vue';

export default {
  components: {
    NavBar,
  },
  data() {
  return {
    params: {
                projectid: this.$route.params.projectid,
                standardid: this.$route.params.standardid,
                subpid: this.$route.params.subpid
            },
      linkToUpload: '',
      moni: ''
    };
  },
  created() {
    this.fetchmoni();
  },
    methods: {
      async fetchmoni() {
      try {
        const response = await this.$http.post('/v1/parameter/getById', {
          token: localStorage.getItem('token'),
          id:this.params.subpid
        });
        
        console.log(response.data.data.moni)
        this.moni = response.data.data.moni;
        this.status = response.data.data.status;
      } catch (error) {
        console.error('请求错误:', error);
      }
    },
    async copyText() {
      try {
        await navigator.clipboard.writeText(this.moni);
      } catch (err) {
        console.error('复制文本时发生错误:', err);
      }
    }
  }
};
</script>


<style scoped>
.el-row {
  font-family: 'Segoe UI', Arial, sans-serif; /* 设置字体 */
}

.el-col {
  font-size: 16px; 
  color: #333;
  line-height: 1.6; 
}

.el-button {
  font-weight: bold; 
}

label {
  font-weight: bold; 
  font-style: italic; 
  color: #555;
}

</style>