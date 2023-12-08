<template>
  <el-container>
    <el-main class="out">
      <div>
        <NavBar></NavBar>
      </div>
      <div class="myrouter">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="myrouter">
          <el-breadcrumb-item :to="{ name: 'projects', params: this.params }">项目列表</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'standard', params: this.params }">标准列表</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'subprojects', params: this.params }">产品/项目/参数</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'requirements', params: this.params }">要求</el-breadcrumb-item>
          <el-breadcrumb-item>设备详细</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row class="nowpos">
        <p>当前项目:<span>{{ this.projectid }}</span></p>
        <p>当前标准:<span>{{ this.standardid }}</span></p>
        <P>当前参数:<span>{{ this.subpid }}</span></P>
        <p>当前位置:<span>设备详细</span></p>
      </el-row>
      <el-row class="modifybtn">
        <el-button type="warning" @click="showModify = true">编辑设备</el-button>
      </el-row>
      <el-row class="cont" type="flex" justify="center" style="width: 100%;">
        <el-col :span="20">
          <el-table stripe :data="devices">
            
            <el-table-column prop="serialNumber" label="序号"></el-table-column>
            <el-table-column prop="number" label="设备编号"></el-table-column>
            <el-table-column prop="name" label="设备名称"></el-table-column>
            <el-table-column prop="status" label="状态"></el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button @click="">查看</el-button>
              </template>
            </el-table-column>

          </el-table>
        </el-col>
      </el-row>
      <el-pagination class="bottom" @current-change="handlePageChange" @size-change="handleSizeChange"
        :current-page="currentPage" :page-size="pageSize" :page-sizes="[10, 15, 30]"
        layout="sizes, total,prev, pager, next" :total="totalResults">
      </el-pagination>

    </el-main>


    <el-dialog title="编辑设备" :visible.sync="showModify" width="60%" :before-close="processModify">
      <el-container slot="footer" class="diagFoot">
        <el-transfer class="my-transfer" filterable :filter-method="filterMethod" filter-placeholder="搜素设备"
          :titles="['设备库', '已选设备']" v-model="value" :buttonposition="right" :data="data">

        </el-transfer>
        <el-row>
          <el-button class="savebtn" @click="saveDevice()">保存设置</el-button>
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
import NavBar from '@/components/NavBar.vue';
export default {
  components: {
    NavBar
  },
  data() {



    return {
      projectid: this.$route.params.projectid,
      standardid: this.$route.params.standardid,
      subpid: this.$route.params.subpid,
      showModify: false,
      modifySaved: true,
      showConfirm: false,
      devices: [],
      data: [],
      value: [],              //获取后端数据
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      }

      ,currentPage:1
      ,pageSize:10
      ,totalResults:2




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
      const h = this.$createElement;
      this.$message({
        message: h('p', null, [
          h('i', { style: 'color: rgb(90,156,248)' }, '保存成功')
        ]),
        type: 'success'
      });
    }
    , saveDevice() {
      this.modifySaved = true;
      this.showConfirm = false;
      this.showModify = false;
      this.showSuccess();
    }
    , closeMakesure() {
      this.modifySaved = true;
      this.showConfirm = false;
      this.showModify = false;
    }

    ,async getDevice(){
      try{
        const resp = await this.$http.post('/v1/equipment/getDevice',{
          token: localStorage.getItem('token'),
          pageNumber: this.currentPage,
          pageSize: this.pageSize
        });

        this.pageNumber = resp.data.data.pageNumber;
        this.pageSize = resp.data.data.pageSize;
        this.devices = resp.data.data.devices;
        this.totalResults = resp.data.data.totalResults;
        // alert(resp);
        console.log(resp);

      }
      catch(e){
        alert("fail to get device");
      }
    }
    ,handlePageChange(page){
      this.currentPage = page;
      this.getDevice();
    }
    ,handleSizeChange(size){
      this.pageSize = size;
      this.getDevice();
    }
    ,generateData(){
      const data = [];
      this.devices.forEach((number, index) => {
        data.push({
          label: number,
          key: index,
          pinyin: number
        });
      });
      this.data = data
    }


  }
  , watch: {
    value(newVal, oldVal) {
      this.modifySaved = false;
    }
  }
  , created() {
    this.getDevice();
    this.generateData();
    //   alert(123);
    if (this.projectid != null) {
      localStorage.setItem('projectid', JSON.stringify(this.projectid));
    }
    if (this.standardid != null) {
      localStorage.setItem('standardid', JSON.stringify(this.standardid));
    }
    if (this.subpid != null) {
      localStorage.setItem('subpid', JSON.stringify(this.subpid));
    }

    const savedprojectid = localStorage.getItem('projectid');
    const savedstandardid = localStorage.getItem('standardid');
    const savedsubpid = localStorage.getItem('subpid');
    if (savedprojectid) {
      this.projectid = JSON.parse(savedprojectid);
    }
    if (savedstandardid) {
      this.standardid = JSON.parse(savedstandardid);
    }
    if (savedsubpid) {
      this.subpid = JSON.parse(savedsubpid);
    }
  }
}


</script>

<style>
.out {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  width: 100%;
  display: flex;
  justify-content: left;
  padding-left: 100px;
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
