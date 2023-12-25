<template>
  <el-container>
    <el-main class="out">
      <div class="myrouter">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="myrouter">
          <el-breadcrumb-item :to="{ name: 'projects' }">{{ this.project.name }}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'standard' }">{{ this.standarditem.standard.name }}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'parameter' }">{{ this.parameter.name }}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'requirements' }">要求</el-breadcrumb-item>
          <el-breadcrumb-item>人员详细</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 面包屑 --------------------------------------------------------------------->

      <!-- <el-row style="width: 80%;height: 30px;">
        <el-col :span="6">当前项目:{{ this.project.name }}</el-col>
        <el-col :span="6">当前标准:{{ this.standarditem.standard.name }}</el-col>
        <el-col :span="6">当前参数:{{ this.parameter.name }}</el-col>
        <el-col :span="6">当前位置:人员详细</el-col>
      </el-row> -->


      <el-row :span="4"  class="modifybtn">
        <el-button type="primary" @click="showModify = true">编辑人员</el-button>
      </el-row>
      <!-- tool --------------------------------------------------------------------->


      <el-row class="cont" type="flex" justify="center" style="width: 100%;">
        <el-col :span="24">
          <el-table stripe :data="value2" :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ 'text-align': 'center' }">
            <el-table-column prop="name" label="姓名"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-main>


    <el-dialog title="编辑人员" :visible.sync="showModify" width="80%" :before-close="processModify">
      <el-container slot="footer" class="diagFoot">
        <table-transfer filterable :filter-method="filterMethod" filter-placeholder="搜索人员" row-key="id"
          :titles="['人员库', '已选设备']" v-model="value" :data="data">
          <template>

            <el-table-column label="姓名" prop="name"></el-table-column>

          </template>
        </table-transfer>
        <el-row>
          <el-button type="primary" class="savebtn" @click="savePerson()">保存设置</el-button>
        </el-row>
      </el-container>

    </el-dialog>
    <el-dialog title="是否保存修改？" :visible.sync="showConfirm" width="20%" center>
      <el-container slot="footer" class="confirmDiagFoot">
        <el-button @click="savePerson">确认</el-button>
        <el-button @click="closeMakesure">取消</el-button>
      </el-container>

    </el-dialog>

  </el-container>
</template>
  
  
<script>
import NavBar from '@/components/NavBar.vue'
import TableTransfer from '@/components/TableTransfer/index.vue'
import { ref } from 'vue';
export default {
  components: {
    NavBar,
    TableTransfer
  },
  data() {

    return {
      project:JSON.parse(localStorage.getItem("project")),
      standarditem:JSON.parse(localStorage.getItem("standarditem")),
      parameter:JSON.parse(localStorage.getItem("parameter")),
      showModify: false,
      modifySaved: true,
      showConfirm: false,
      data: [],
      value: [],              //获取后端数据
      value2: []



      , currentPage: 1
      , pageSize: 8
      , totalResults: 0
      , totalPages: 0
      , searchKeyword: ""
      , searchState: ""




    };
  },


  methods: {
    changeDevice() {
      this.$router.push({ name: 'equipment', params: this.params })
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
    , savePerson() {
      this.modifySaved = true;
      this.showConfirm = false;
      this.showModify = false;

      var sleep = (delaytime) => {
        return new Promise(resolve => setTimeout(resolve, delaytime))
      }
      this.updateparameterperson()
      sleep(100).then(() => {
        this.getparameterperson()
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
      this.getparameterperson()
    }
    , filterMethod(query, item) {

      return item.name.indexOf(query) > -1;
    }
    , async getPerson() {
      try {
        const resp = await this.$http.post('/v1/person/listAll', {
          token: localStorage.getItem('token'),
        });
        this.data = resp.data.data;


        // alert(resp);


      }
      catch (e) {
        // alert("fail to get device");
        alert(e);
      }
    },
    async getparameterperson() {
      try {
        const response = await this.$http.post('/v1/parameter/getById', {
          token: localStorage.getItem('token'),
          id: this.parameter.id
        });
        if (response.data.code === 200) {
          this.value2 = response.data.data.personList
          this.value = []
          this.value2.forEach((item, index) => {

            this.value.push(item.id)
          })
        }
        else {
          this.$message.error(response.data.message)
        }
      }
      catch (e) {
        alert(e);
      }
    },
    async updateparameterperson() {
      try {
        const response = await this.$http.post('/v1/parameter/updatePerson', {

          token: localStorage.getItem('token'),
          id: this.parameter.id,
          personidlist: this.value

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
  , watch: {
    value(newVal, oldVal) {
      this.modifySaved = false;
    }
  }
  , created() {

    this.getPerson();
    this.getparameterperson()
    //   alert(123);



  }
}


</script>
  
<style>
.out {

}

.sel {
  text-align: left;
}

.myrouter {
  width: 100%;
  display: flex;
  justify-content: left;
}

.nowpos {
  padding: 10px 0;
}

.nowpos p {
  padding: 5px 0;
}

.nowpos span {
  font-weight: 1000;
}

.modifybtn {
  width: 10%;
  padding-left: 10px;
}

.diagFoot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.confirmDiagFoot {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
