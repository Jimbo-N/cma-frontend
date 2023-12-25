<template>
  <el-container>
    <el-main>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'projects' }">{{ this.project.name }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'standard' }">{{ this.standarditem.standard.name }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'parameter' }">{{ this.parameter.name }}</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'requirements' }">要求</el-breadcrumb-item>
        <el-breadcrumb-item>模拟试验</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- <el-row style="width: 80%;height: 30px;">
        <el-col :span="6">当前项目:{{ this.project.name }}</el-col>
        <el-col :span="6">当前标准:{{ this.standarditem.standard.name }}</el-col>
        <el-col :span="6">当前参数:{{ this.parameter.name }}</el-col>
        <el-col :span="6">当前位置:模拟实验详细</el-col>
      </el-row> -->
      <el-row style="margin-bottom: 20px;">
        <el-col :span="10">
          <label >模拟实验报告：</label>
          <el-link>{{ this.parameter.moni }}</el-link>
        </el-col>
        <el-col :span="5">
          <el-input v-model="moni" placeholder="请输入链接"></el-input>
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
      project:JSON.parse(localStorage.getItem("project")),
      standarditem:JSON.parse(localStorage.getItem("standarditem")),
      parameter:JSON.parse(localStorage.getItem("parameter")),
      moni: ''
    };
  },
  created() {
    this.fetchParameter();
  },
  methods: {
    async fetchParameter() {
      try {
        const response = await this.$http.post('/v1/parameter/getById', {
          token: localStorage.getItem('token'),
          id: JSON.parse(localStorage.getItem('parameter')).id
        });
        if (response.data.code == 200) {
          this.parameter = response.data.data
        }
      } catch (error) {
        console.error('请求错误:', error);
      }
    },
    async uploadLink() {
      try {
        const response = await this.$http.post('/v1/parameter/updateParameter', {
          token: localStorage.getItem('token'),
          id: JSON.parse(localStorage.getItem('parameter')).id,
          status: this.parameter.status,
          name: this.parameter.name,
          sop: this.parameter.sop,
          facility: this.parameter.facility,
          bidui: this.parameter.bidui,
          moni: this.moni,
          sampleinfo: this.parameter.sampleinfo,
          samplepic: this.parameter.samplepic,
          
        })
        if(response.data.code==200)
        {
          this.$message.success("上传成功")
        }

      } catch (error) {
        console.error('请求错误:', error);
      }
    },
    copyText(text) {
      navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
        if (result.state === 'granted') {

          var blob = new Blob([text], { type: 'text/plain' });
          var item = new ClipboardItem({ 'text/plain': blob });
          navigator.clipboard.write([item]).then(function () {

          }, function (error) {

          });
        } else {

        }
      });
    }
  }
};
</script>


<style scoped>
.el-row {
  font-family: 'Segoe UI', Arial, sans-serif;
  /* 设置字体 */
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