<template>
  <el-container>
    <el-main class="out">
      <div>
        <NavBar></NavBar>
      </div>
      <div class="myrouter">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="myrouter">
          <el-breadcrumb-item :to="{ name: 'projects' }">项目列表</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'standard' }">标准列表</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'parameter' }">参数</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'requirements' }">要求</el-breadcrumb-item>
          <el-breadcrumb-item>设备详细</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 面包屑 --------------------------------------------------------------------->

      <el-row style="width: 80%;height: 60px;padding-top: 20px;">
        <el-col :span="6">当前项目:{{ this.projectid }}</el-col>
        <el-col :span="6">当前标准:{{ this.standarditemid }}</el-col>
        <el-col :span="6">当前参数:{{ this.parameterid }}</el-col>
        <el-col :span="6">当前位置:设备详细</el-col>
      </el-row>


      <el-row class="modifybtn">
        <el-button type="warning" @click="showModify = true">编辑设备</el-button>
        <el-col :span="5">
          <el-select v-model="searchState" placeholder="所有状态">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="请输入搜索关键词" v-model="searchKeyword" clearable prefix-icon="el-icon-search"
            @clear="getDevice" @keyup.enter.native="getDevice">
          </el-input>
        </el-col>
        <el-col>
          <el-button @click="getDevice">搜索</el-button>
        </el-col>

      </el-row>
      <!-- tool --------------------------------------------------------------------->


      <el-row class="cont" type="flex" justify="center" style="width: 100%;">
        <el-col :span="20">
          <el-table stripe :data="records" :cell-style="{ 'text-align': 'center' }"
            :header-cell-style="{ 'text-align': 'center' }">
            <el-table-column prop="number" label="设备编号"></el-table-column>
            <el-table-column prop="name" label="设备名称"></el-table-column>
            <el-table-column prop="type" label="型号/规格/等级"></el-table-column>
            <el-table-column prop="measuring_range" label="测量范围"></el-table-column>
            <el-table-column prop="stateCon stateNum" label="状态">
              <template slot-scope="scope">
                <div :style="{ color: scope.row.stateNum ? 'black' : 'red' }">
                  {{ scope.row.stateCon }}
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
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
      <el-button @click="debug">debug</el-button>

    </el-main>


    <el-dialog title="编辑设备" :visible.sync="showModify" width="60%" :before-close="processModify">
      <el-container slot="footer" class="diagFoot">
        <table-transfer filterable :filter-method="filterMethod" filter-placeholder="搜素设备" row-key="id"
          :titles="['设备库', '已选设备']" v-model="value" :data="data">
          <template>

            <el-table-column label="编号" prop="number"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="型号" prop="type"></el-table-column>
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
import NavBar from '@/components/NavBar.vue'
import TableTransfer from '@/components/TableTransfer/index.vue'
export default {
  components: {
    NavBar,
    TableTransfer
  },
  data() {

    return {
      projectid: null,
      standarditemid: null,
      parameterid: null,
      showModify: false,
      modifySaved: true,
      showConfirm: false,
      records: [],
      data: [],
      value: [],              //获取后端数据


      options: [{
        value: '0',
        label: '所有状态'
      }, {
        value: '1',
        label: '未完成'
      }, {
        value: '2',
        label: '已完成'
      }]

      , currentPage: 1
      , pageSize: 10
      , totalResults: 2
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
    , filterMethod(query, item) {
      if (query != this.searchKeyword) {
        this.searchKeyword = query;
        this.getDevice();
      }
      console.log(item)
      if(item==null)
      item=[]
      return item;
    }
    , async getDevice() {
      try {
        const resp = await this.$http.post('/v1/device/listSearchPage', {
          token: localStorage.getItem('token'),
          search: this.searchKeyword,
          pagenumber: this.currentPage,
          pagesize: this.pageSize
        });
        this.data = resp.data.data.records;
        this.totalResults = resp.data.data.total;
        this.currentPage = resp.data.data.current;
        this.pageSize = resp.data.data.size;
        this.totalPages = resp.data.data.pages;


        // alert(resp);
        

      }
      catch (e) {
        // alert("fail to get device");
        alert(e);
      }
    }
    , handlePageChange(page) {
      this.currentPage = page;
      this.getDevice();
    }
    , handleSizeChange(size) {
      this.pageSize = size;
      this.getDevice();
    }
    , debug() {
      alert(this.searchState);
    }



  }
  , watch: {
    value(newVal, oldVal) {
      this.modifySaved = false;
    }
  }
  , created() {
    this.projectid = localStorage.getItem('projectid');
    this.standarditemid = localStorage.getItem('standarditemid');
    this.parameterid = localStorage.getItem('parameterid');
    this.getDevice();

    //   alert(123);



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
