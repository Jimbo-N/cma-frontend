<template>
  <el-container>
    <NavBar></NavBar>
    <el-main>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'projects' }">项目列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'standard' }">标准列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'parameter' }">产品/项目/参数</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'requirements' }">要求</el-breadcrumb-item>
        <el-breadcrumb-item>SOP</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row :gutter="20">
        <el-col :span="10">
          <label>SOP检验细则：</label>
          <el-link>{{ this.parameter.sop }}</el-link>
        </el-col>
        <el-col :span="5">
          <el-input v-model="sop" placeholder="请输入链接"></el-input>
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
    parameter:null,
      sop: ''
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
          id: localStorage.getItem('parameterid')
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
          id: localStorage.getItem('parameterid'),
          status: this.parameter.status,
          name: this.parameter.name,
          sop: this.sop,
          facility: this.parameter.facility,
          bidui: this.parameter.bidui,
          moni: this.parameter.moni,
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
            
          var blob = new Blob([text], {type: 'text/plain'}); 
            var item = new ClipboardItem({'text/plain': blob}); 
            navigator.clipboard.write([item]).then(function() { 
              
            }, function(error) { 

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