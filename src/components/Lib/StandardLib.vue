<template>
  <el-container>
    <el-header class="header">
      <el-row :gutter="15">
        <el-col :span="2">
          <img src="@/assets/logo.png" alt="Logo" class="logo" @click="gotoMain" >
        </el-col>
        <el-col :span="2" :offset="13">
          <el-button type="text" @click="gotoEmp">人员信息</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" size="small" @click="gotoStandardlib">标准库</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="text" size="small" @click="gotoEquipmentlib">设备库</el-button>
        </el-col>
        <el-col :span="3" class="user-display">
          <el-avatar icon="el-icon-user-solid"></el-avatar>
          <div class="user-info">
            <p class="user-id">{{ userid }}</p>
            <p class="user-name">{{ username }}</p>
          </div>
        </el-col>
      </el-row>
    </el-header>
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
          <el-button type="primary" icon="el-icon-plus"  size="small" @click="showAddDialog" plain>添加</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" :disabled="deleteButton" @click="batchDelete" plain>删除</el-button>
        </el-col>
      </el-row>

      <el-table stripe :data="standards" @selection-change="getChosenRows">
        <el-table-column type="selection" width="55" />

        <el-table-column prop="bigCategory" label="大类"></el-table-column>
        <el-table-column prop="category" label="类别"></el-table-column>
        <el-table-column prop="name" label="标准名称"></el-table-column>
        <el-table-column prop="number" label="标准编号"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="showModifyDialog(scope.row)">修改</el-button>
            <el-button type="text" icon="el-icon-delete" @click="deleteStandard(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-pagination class="bottom" @current-change="handlePageChange" @size-change="handleSizeChange"
                     :current-page="currentPage" :page-size="pageSize" :page-sizes="[8, 15, 30]"
                     layout="sizes, total,prev, pager, next" :total="totalResults">
      </el-pagination>


      <!--      添加设备对话框-->
      <el-dialog :title="tittle" :rules="rules" :visible.sync="open" width="700px" append-to-body>
        <el-form :model="form" :rules="rules" ref="addForm" label-width="180px">
          <el-form-item label="大类" prop="bigCategory">
            <el-input v-model="form.bigCategory" placeholder="请输入大类" />
          </el-form-item>
          <el-form-item label="类别" prop="category">
            <el-input v-model="form.category" placeholder="请输入类别"></el-input>
          </el-form-item>
          <el-form-item label="标准名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入标准名称"></el-input>
          </el-form-item>
          <el-form-item label="标准编号" prop="number">
            <el-input v-model="form.number" placeholder="请输入标准编号"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitAddForm">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>

      <!--      修改设备对话框-->
      <el-dialog :title="tittle2" :rules="rules" :visible.sync="openOfModify" width="700px" append-to-body>
        <el-form ref="modifyForm" :model="chosenStandard" :rules="rules" label-width="180px">
          <el-form-item label="大类" prop="bigCategory">
            <el-input v-model="chosenStandard.bigCategory" placeholder="请输入大类" />
          </el-form-item>
          <el-form-item label="类别" prop="category">
            <el-input v-model="chosenStandard.category" placeholder="请输入类别"></el-input>
          </el-form-item>
          <el-form-item label="标准名称" prop="name">
            <el-input v-model="chosenStandard.name" placeholder="请输入标准名称"></el-input>
          </el-form-item>
          <el-form-item label="标准编号" prop="number">
            <el-input v-model="chosenStandard.number" placeholder="请输入标准编号"></el-input>
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
import NavBar from '../NavBar.vue';
import equipmentLib from "@/components/Lib/EquipmentLib.vue";

export default {
  components:{
    NavBar
  },
  data(){
    return{
      username: localStorage.getItem('username'),
      userid: localStorage.getItem('userid'),
      keyword:'',
      standards:[],
      chosenStandard: { },
      totalPages: 0,
      currentPage: 1,
      pageSize: 8,
      totalResults: 0,
      open: false,
      openOfModify:false,
      deleteButton:true,
      chosenIds:[],
      tittle:"添加标准",
      tittle2:"修改标准",
      form:{
        bigCategory:'',
        category:'',
        name:'',
        number: '',
      },
      rules: {
        bigCategory:[
          {required:true, message:"大类不能为空", trigger:"blur"}
        ],
        category: [
          { required: true, message: "类别不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "标准名称不能为空", trigger: "blur" },
        ],
        number: [
          { required: true, message: "标准编号不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getStandards()
  },
  methods:{
    gotoMain() {
      this.$router.push("/projects");
    },
    gotoEmp() {
      this.$router.push("/employee");
    },
    gotoStandardlib() {
      this.$router.push("/standardlib");
    },
    gotoEquipmentlib() {
      this.$router.push("/equipmentlib");
    },
    onSearchClick() {
      console.log(this.keyword)
      this.currentPage = 1
      this.getStandards()
    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
      this.getStandards();
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getStandards();
    },
    showAddDialog(){
      this.open=true
    },
    showModifyDialog(chosenStandard){
      this.openOfModify=true
      this.chosenStandard=chosenStandard
    },
    waitforme(millisec) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('')
        }, millisec);
      })
    },
    getChosenRows(selection){
      if(selection.length){
        this.deleteButton=false
        this.chosenIds = selection.map(row => row.id);
        console.log(this.chosenIds)
      }

    },
    async getStandards(){
      try {
        const response = await this.$http.post('/v1/standard/listSearchPage', {

          token: localStorage.getItem('token'),
          pagenumber: this.currentPage,
          pagesize: this.pageSize,
          search: this.keyword

        });

        this.standards = response.data.data.records;
        console.log('后端返回：' +  this.standards )
        this.currentPage = response.data.data.current;
        this.pageSize = response.data.data.size;
        this.totalResults = response.data.data.total;
        this.totalPages = response.data.data.pages;
      } catch (error) {
        console.error('请求错误:', error);
      }
    },
    async modifyStandard(){
      console.log("this.chosenStandard.bigCategory=",this.chosenStandard.bigCategory)
      try {
        const response =await  this.$http.post('/v1/standard/updateStandard', {

          token: localStorage.getItem('token'),
          id: this.chosenStandard.id,
          number:this.chosenStandard.number,
          name:this.chosenStandard.name,
          bigCategory:this.chosenStandard.bigCategory,
          category:this.chosenStandard.category,
        })
        console.log("response.data",response.data)
        if (response.data.code === 200) {
          this.$message.success("修改成功")
        }
      } catch (error) {
        console.error('请求错误:', error);
      }
      await this.waitforme(100);
      this.getStandards();
    },
    async deleteStandard(id){
      try {
        const response =await  this.$http.post('/v1/standard/deleteStandard', {

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
      this.getStandards();
    },
    async batchDelete(){
      try {
        const response =await  this.$http.post('/v1/standard/deletebatchStandard', {

          token: localStorage.getItem('token'),
          standardidlist:this.chosenIds
        })
        if (response.data.code === 200) {
          this.$message.success("删除成功")
        }
      } catch (error) {
        console.error('请求错误:', error);
      }
      await this.waitforme(100);
      this.getStandards();
      this.chosenIds=[]
    },
    async addStandard(){
      console.log("addStandard")
      try {
        const response = await this.$http.post('/v1/standard/addStandard', {

          token: localStorage.getItem('token'),
          number:this.form.number,
          name:this.form.name,
          bigCategory:this.form.bigCategory,
          category:this.form.category,
        });
        console.log('addStandard：' + response.data)
        if (response.data.code === 200) {
          this.$message.success("添加成功")
        }
      } catch (error) {
        console.error('请求错误:', error);
      }
      await this.waitforme(100);
      this.getStandards();
    },
    cancel() {
      this.open = false;
      this.form={
        number:'',
        name:'',
        bigCategory:'',
        Category:'',
      }
    },
    cancelModify(){
      this.openOfModify=false;
      this.chosenStandard={}
    },
    async submitAddForm() {
      this.$refs['addForm'].validate( async(valid) => {  //开启校验
        if (valid) {   // 如果校验通过，请求接口，允许提交表单
          // 验证通过，可以提交表单到后端
          this.addStandard()
          await this.waitforme(100);
          this.getStandards();
          this.cancel()
        } else {   //校验不通过
          return false;
        }
      });

    },
    async submitModifyForm(){
      this.$refs['modifyForm'].validate( async(valid) => {  //开启校验
        if (valid) {   // 如果校验通过，请求接口，允许提交表单
          // 验证通过，可以提交表单到后端
          this.modifyStandard()
          await this.waitforme(100);
          this.getStandards();
          this.cancelModify()
        } else {   //校验不通过
          return false;
        }
      });
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
.header img{
  cursor: pointer;
}
.header .el-button{
  /* color:#333; */
  font-weight: 500;
  font-size: 17px;
  font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
}
.header .el-col{
  margin-top:5px;
}

.demo-table-expand label {
  width: 130px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>