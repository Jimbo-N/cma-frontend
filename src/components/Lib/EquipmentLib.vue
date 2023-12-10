<template>
  <el-container>
    <NavBar></NavBar>
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

      <el-table stripe :data="equipments" @selection-change="getChosenRows">
        <el-table-column type="selection" width="55" />

        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="有效截止日期" >
                <span>{{ props.row.effective_date }}</span>
              </el-form-item>
              <el-form-item label="设备来源">
                <span>{{ props.row.source }}</span>
              </el-form-item>
              <el-form-item label="设备计量证书">
                <el-button type="text" v-if="props.row.certificate" @click="download(props.row.certificate.id)">{{ props.row.certificate.fileName }}</el-button>
              </el-form-item>
              <el-form-item label="仪器操作规程">
                <el-button type="text" v-if="props.row.rules"  @click="download(props.row.rules.id)">{{ props.row.rules.fileName }}</el-button>
              </el-form-item>
              <el-form-item label="仪器授权使用人员">
                <el-button type="text" v-if="props.row.people"  @click="download(props.row.people.id)">{{ props.row.people.fileName }}</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>


        <el-table-column prop="number" label="*仪器设备编号" align="center"></el-table-column>
        <el-table-column prop="name" label="*名称" align="center"></el-table-column>
        <el-table-column prop="type" label="*型号/规格/等级" align="center"></el-table-column>
        <el-table-column prop="measuring_range" label="*测量范围" align="center"></el-table-column>
        <el-table-column prop="buydate" label="*设备购买年份" align="center"></el-table-column>
        <el-table-column prop="trace_method" label="*溯源方式" align="center"></el-table-column>
        <el-table-column label="操作" align="center" >
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" @click="showModifyDialog(scope.row)">修改</el-button>
            <el-button type="text" icon="el-icon-delete" @click="deleteEquipment(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <el-pagination class="bottom" @current-change="handlePageChange" @size-change="handleSizeChange"
                     :current-page="currentPage" :page-size="pageSize" :page-sizes="[8, 15, 30]"
                     layout="sizes, total,prev, pager, next" :total="totalResults">
      </el-pagination>


      <!--      添加设备对话框-->
      <el-dialog :title="tittle" :rules="rules" :visible.sync="open" width="700px" append-to-body>
        <el-form ref="addForm" :model="form" :rules="rules" label-width="180px">
          <el-form-item label="仪器设备编号" prop="number">
            <el-input v-model="form.number" placeholder="请输入仪器设备编号" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入仪器设备名称"></el-input>
          </el-form-item>
          <el-form-item label="型号/规格/等级" prop="type">
            <el-input v-model="form.type" placeholder="请输入型号/规格/等级"></el-input>
          </el-form-item>
          <el-form-item label="测量范围" prop="measuring_range">
            <el-input v-model="form.measuring_range" placeholder="请输入测量范围"></el-input>
          </el-form-item>
          <el-form-item label="设备购买年份" prop="buydate">
            <el-input v-model="form.buydate" placeholder="请输入设备购买年份"></el-input>
          </el-form-item>
          <el-form-item label="溯源方式" prop="trace_method">
            <el-select v-model="form.trace_method" placeholder="请选择溯源方式">
              <el-option value="检定"/>
              <el-option value="校准"/>
              <el-option value="内部校准"/>
              <el-option value="其他方式"/>
            </el-select>
          </el-form-item>
          <el-form-item label="有效截止日期"  prop="effective_date">
            <el-input v-model="form.effective_date" placeholder="请输入有效截止日期"></el-input>
          </el-form-item>
          <el-form-item label="设备来源" prop="source">
            <el-input v-model="form.source" placeholder="请输入设备来源"></el-input>
          </el-form-item>
          <el-form-item label="设备计量证书" prop="certificate">
            <!--            <el-input v-model="form.certificate" placeholder="请填写设备计量证书链接"></el-input>-->
            <el-upload
                class="upload-demo"
                :auto-upload="false"
                action="http"
                :on-remove="handleRemoveCertificate"
                :before-remove="beforeRemove"
                :on-change="handleCertificate"
                multiple
                :on-exceed="handleExceed"
                :limit="1"
                :file-list="cerList"
                >
              <el-button size="small" type="primary">点击上传</el-button>
              <!--              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
          </el-form-item>
          <el-form-item label="仪器操作规范">
            <el-upload
                class="upload-demo"
                :auto-upload="false"
                action="http"
                :on-remove="handleRemoveRules"
                :before-remove="beforeRemove"
                :on-change="handleRules"
                multiple
                :on-exceed="handleExceed"
                :limit="1"
                :file-list="rulesList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <!--              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
          </el-form-item>
          <el-form-item label="仪器授权使用人员一览表">
            <el-upload
                class="upload-demo"
                :auto-upload="false"
                action="http"
                :on-remove="handleRemovePeople"
                :before-remove="beforeRemove"
                :on-change="handlePeople"
                multiple
                :on-exceed="handleExceed"
                :limit="1"
                :file-list="peoList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <!--              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitAddForm">确定</el-button>
          <el-button @click="cancel">取消</el-button>
        </div>
      </el-dialog>

      <!--      修改设备对话框-->
      <el-dialog :title="tittle2" :rules="rules" :visible.sync="openOfModify" width="700px" append-to-body>
        <el-form ref="modifyForm" :model="chosenEquipment" :rules="rules" label-width="180px">
          <el-form-item label="仪器设备编号" prop="number">
            <el-input v-model="chosenEquipment.number" placeholder="请输入仪器设备编号" />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="chosenEquipment.name" placeholder="请输入仪器设备名称"></el-input>
          </el-form-item>
          <el-form-item label="型号/规格/等级" prop="type">
            <el-input v-model="chosenEquipment.type" placeholder="请输入型号/规格/等级"></el-input>
          </el-form-item>
          <el-form-item label="测量范围" prop="measuring_range">
            <el-input v-model="chosenEquipment.measuring_range" placeholder="请输入测量范围"></el-input>
          </el-form-item>
          <el-form-item label="设备购买年份" prop="buydate">
            <el-input v-model="chosenEquipment.buydate" placeholder="请输入设备购买年份"></el-input>
          </el-form-item>
          <el-form-item label="溯源方式" prop="trace_method">
            <el-select v-model="chosenEquipment.trace_method" placeholder="请选择溯源方式">
              <el-option value="检定"/>
              <el-option value="校准"/>
              <el-option value="内部校准"/>
              <el-option value="其他方式"/>
            </el-select>
          </el-form-item>
          <el-form-item label="有效截止日期"  prop="effective_date">
            <el-input v-model="chosenEquipment.effective_date" placeholder="请输入有效截止日期"></el-input>
          </el-form-item>
          <el-form-item label="设备来源" prop="source">
            <el-input v-model="chosenEquipment.source" placeholder="请输入设备来源"></el-input>
          </el-form-item>
          <el-form-item label="设备计量证书" prop="certificate">
            <!--            <el-input v-model="form.certificate" placeholder="请填写设备计量证书链接"></el-input>-->
            <el-upload
                class="upload-demo"
                :auto-upload="false"
                action="http"
                :on-remove="handleRemoveCertificate"
                :before-remove="beforeRemove"
                :on-change="handleCertificate"
                multiple
                :on-exceed="handleExceed"
                :limit="1"
                :file-list="cerList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <!--              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
          </el-form-item>
          <el-form-item label="仪器操作规范">
            <el-upload
                class="upload-demo"
                :auto-upload="false"
                action="http"
                :on-remove="handleRemoveRules"
                :before-remove="beforeRemove"
                :on-change="handleRules"
                multiple
                :on-exceed="handleExceed"
                :limit="1"
                :file-list="rulesList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <!--              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
          </el-form-item>
          <el-form-item label="仪器授权使用人员一览表">
            <el-upload
                class="upload-demo"
                :auto-upload="false"
                action="http"
                :on-remove="handleRemovePeople"
                :before-remove="beforeRemove"
                :on-change="handlePeople"
                multiple
                :on-exceed="handleExceed"
                :limit="1"
                :file-list="peoList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <!--              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
            </el-upload>
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
import axios from "axios";

export default {
  components:{
    NavBar
  },
  data(){
    let validateBuyDate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('购买年份不能为空'));
      } else {
        let regex  = /^(19|20)\d\d([-./](0[1-9]|1[012])([-./](0[1-9]|[12][0-9]|3[01]))?)?$/;
        if (!regex.test(value)) {
          callback(new Error("购买年份不合法"));
        }else{
          callback();
        }
      }
    };
    let validEffectiveDate = (rule, value, callback)=>{
      let regex = /^(19|20)\d\d[-./](0[1-9]|1[012])[-./](0[1-9]|[12][0-9]|3[01])$/;
      if(value==''){
        callback()
      }else if(!regex.test(value)){
        callback(new Error("输入日期不合法"));
      }else{
        callback()
      }
    };
    return{
      cerLen:0,
      rulesLen:0,
      peopleLen:0,
      cerList:[],
      rulesList:[],
      peoList:[],
      username: localStorage.getItem('username'),
      userid: localStorage.getItem('userid'),
      keyword:'',
      equipments:[],
      chosenEquipment: { },
      totalPages: 0,
      currentPage: 1,
      pageSize: 8,
      totalResults: 0,
      open: false,
      openOfModify:false,
      deleteButton:true,
      chosenIds:[],
      tittle:"添加设备",
      tittle2:"修改设备",
      form:{
        number:'',
        name:'',
        type:'',
        measuring_range: '',
        buydate:'',
        trace_method: '',
        effective_date:'',
        source:'',
        certificate: {},
        rules: {},
        people:{},
      },
      rules: {
        number:[
          {required:true, message:"仪器设备编号不能为空", trigger:"blur"}
        ],
        name: [
          { required: true, message: "仪器设备名称不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "型号/规格/等级 不能为空", trigger: "blur" },
        ],
        measuring_range: [
          { required: true, message: "测量范围不能为空", trigger: "blur" },
        ],
        buydate: [
          { required: true, message: "购买年份不能为空", trigger: "blur" },
          { validator: validateBuyDate, trigger: "blur" },
        ],
        trace_method: [
          { required: true, message: "溯源方式不能为空", trigger: "blur" },
        ],
        effective_date: [
          { validator: validEffectiveDate, trigger: "blur" },
        ]
      },
    };
  },
  created() {
    this.getEquipments()
  },
  methods:{
    handleRemoveCertificate(file, fileList) {
      console.log(file, fileList);
      this.form.certificate={}
    },
    handleRemoveRules(file, fileList) {
      console.log(file, fileList);
      this.form.rules={}
    },
    handleRemovePeople(file, fileList) {
      console.log(file, fileList);
      this.form.people={}
    },
    handleExceed(files, fileList) {
      // this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      fileList[0].name = files[0].name;
      // fileList=[files[-1]]
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    handleCertificate(file,fileList){
      this.form.certificate=file
     this.cerLen=fileList.length
      console.log("cerlen=",this.cerLen)
    },
    handleRules(file,fileList){
      this.form.rules=file
      this.rulesLen=fileList.length
      console.log("rulesfile=",this.rulesLen)
    },
    handlePeople(file,fileList){
      this.form.people=file
      this.peopleLen=fileList.length
      console.log("peopleLen=",this.peopleLen)
    },
    async getEquipments(){
      console.log("get!!!")
      try {
        const response = await this.$http.post('/v1/device/listSearchPage', {

          token:localStorage.getItem('token'),
          pagenumber: this.currentPage,
          pagesize: this.pageSize,
          search: this.keyword

        });
        console.log('后端返回：' + response.data.data.current)
        console.log("device",response.data.data.records)
        this.equipments = response.data.data.records;

        this.currentPage = response.data.data.current;
        this.pageSize = response.data.data.size;
        this.totalResults = response.data.data.total;
        this.totalPages = response.data.data.pages;
      } catch (error) {
        console.error('请求错误:', error);
      }
    },
    onSearchClick() {
      console.log(this.keyword)
      this.currentPage = 1
      this.getEquipments()

    },
    handlePageChange(newPage) {
      this.currentPage = newPage;
      this.getEquipments();
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize
      this.getEquipments();
    },
    showAddDialog(){
      this.open=true
    },
    showModifyDialog(chosenEquipment){
      this.openOfModify=true
      this.chosenEquipment=chosenEquipment
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
    async modifyEquipment(){
      let formData = new FormData();
      //文件
      if(this.cerLen!==0){
        formData.append("certificate", this.form.certificate.raw, this.form.certificate.name);
      }
      if(this.rulesLen!==0){
        formData.append("rules", this.form.rules.raw, this.form.rules.name);
      }
      if(this.peopleLen!==0){
        console.log("people存在")
        formData.append("people", this.form.people.raw, this.form.people.name);
      }
      //字段
      formData.append('id', this.chosenEquipment.id);
      formData.append('token',localStorage.getItem('token'))
      formData.append('number', this.chosenEquipment.number);
      formData.append('name', this.chosenEquipment.name);
      formData.append('type',this.chosenEquipment.type);
      formData.append('measuring_range',this.chosenEquipment.measuring_range)
      formData.append('buydate',this.chosenEquipment.buydate)
      formData.append('trace_method', this.chosenEquipment.trace_method)
      formData.append('effective_date',this.chosenEquipment.effective_date)
      formData.append('source',this.chosenEquipment.source)
      const http1 = axios.create({
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      http1({
        url: '/v1/device/updateDevice',
        method: 'post',
        data: formData
      })
          .then((res) => {
            console.log(res.data);
            if (res.data.code === 200) {
              this.$message.success("修改成功")
            }
          })
          .catch((err) => {
            console.log(err);
          });

      await this.waitforme(100);
      this.getEquipments()
      this.cancel()
    },
    async deleteEquipment(id){
      console.log('删除')
      try {
        const response =await this.$http.post('/v1/device/deleteDevice', {

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
      this.getEquipments();
    },
    async batchDelete(){
      try {
        const response =await  this.$http.post('/v1/device/deletebatchDevice', {

          token: localStorage.getItem('token'),
          deviceidlist:this.chosenIds
        })
        if (response.data.code === 200) {
          this.$message.success("删除成功")
        }
      } catch (error) {
        console.error('请求错误:', error);
      }
      await this.waitforme(100);
      this.getEquipments();
      this.chosenIds=[]
    },
    async addEquipment(){
        let formData = new FormData();
        console.log("cerFileList.length=",this.cerLen)
      console.log("rulesFileList.length=",this.rulesLen)
      console.log("peopleFileList.length=",this.peopleLen)
        //文件
      if(this.cerLen!==0){
        formData.append("certificate", this.form.certificate.raw, this.form.certificate.name);
      }
      // else{
      //   formData.append("certificate", null);
      // }
      if(this.rulesLen!==0){
        formData.append("rules", this.form.rules.raw, this.form.rules.name);
      }

      if(this.peopleLen!==0){
        formData.append("people", this.form.people.raw, this.form.people.name);
      }

        //字段localStorage.getItem('token')
        formData.append('token',localStorage.getItem('token'))
        formData.append('number', this.form.number);
        formData.append('name', this.form.name);
        formData.append('type',this.form.type);
        formData.append('measuring_range',this.form.measuring_range)
        formData.append('buydate',this.form.buydate)
        formData.append('trace_method', this.form.trace_method)
        formData.append('effective_date',this.form.effective_date)
        formData.append('source',this.form.source)
        const http1 = axios.create({
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        http1({
          url: '/v1/device/addDevice',
          method: 'post',
          data: formData
        })
            .then((res) => {
              console.log(res.data);
              if (res.data.code === 200) {
                this.$message.success("添加成功")
              }
            })
            .catch((err) => {
              console.log(err);
            });

      await this.waitforme(100);
      this.getEquipments()
      this.cancel()
    },
    async download(id){
      console.log("要下载",id)
      window.open(axios.defaults.baseURL+'/v1/file/download/'+id)

    },
    cancel() {
      this.open = false;
      this.cerLen=0
      this.rulesLen=0
      this.peopleLen=0
      this.cerList=[]
      this.rulesList=[]
      this.peoList=[]
      this.form={
        number:'',
        name:'',
        type:'',
        measuring_range: '',
        buydate:'',
        trace_method: '',
        effective_date:'',
        source:'',
        certificate: null,
        rules: null,
        people:null,
      }
    },
    cancelModify(){
      this.openOfModify=false;
      this.chosenEquipment={}
    },
    async submitAddForm() {
      this.$refs['addForm'].validate( async(valid) => {  //开启校验
        if (valid) {   // 如果校验通过，请求接口，允许提交表单
          // 验证通过，可以提交表单到后端
          this.addEquipment()
          await this.waitforme(100);
          this.getEquipments();
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
          this.modifyEquipment()
          await this.waitforme(100);
          this.getEquipments();
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

.demo-table-expand {
  font-size: 0;
  margin-left: 120px;
  /*margin-left: 20px;*/
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