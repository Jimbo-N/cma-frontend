<template>
    <el-container>
        <NavBar></NavBar>
        <el-main>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ name: 'projects'}">{{ this.project.name }}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ name: 'standard' }">{{ this.standarditem.standard.name }}</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ name: 'parameter' }">{{ this.parameter.name }}</el-breadcrumb-item>
                <el-breadcrumb-item>要求</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- <el-row style="width: 80%;height: 30px;">
        <el-col :span="6">当前项目:{{ this.project.name }}</el-col>
        <el-col :span="6">当前标准:{{ this.standarditem.standard.name }}</el-col>
        <el-col :span="6">当前参数:{{ this.parameter.name }}</el-col>
      </el-row> -->

            <el-row :gutter="20" class="main-header">
                <el-col :span="2">
                    <el-button type="primary" @click="manage">管理要求</el-button>
                </el-col>
                <!-- <el-col :span="4" :offset="1">
                <el-input placeholder="请输入搜索关键词" v-model="keyword" clearable prefix-icon="el-icon-search" @clear="onSearchClick"
                    @keyup.enter.native="onSearchClick" @input="onSearchClick">
                </el-input>
                </el-col> -->
                <el-col :span="4">
                <el-switch 
                    v-model="status"
                    @change="handleStatusChange"
                    active-text="已完成"
                    inactive-text="未完成">
                </el-switch>
                </el-col>
                
            </el-row>            

            <el-table :data="filteredTableData" stripe  style="width: 500px;margin:auto" >
                <el-table-column prop="req" label="要求" width="auto">
                    <template slot-scope="scope">
                        {{ scope.row.req }}
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button @click="gotosub(scope.row.req)" type="primary" size="small">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </el-main>
        <el-dialog title="管理要求" :visible.sync="dialogVisible" >
            <el-checkbox-group v-model="selectedRequirements">
                <el-checkbox label="人员">人员</el-checkbox>
                <el-checkbox label="设备">设备</el-checkbox>
                <el-checkbox label="样品">样品</el-checkbox>
                <el-checkbox label="方法(SOP)">方法(SOP)</el-checkbox>
                <el-checkbox label="设施">设施</el-checkbox>
                <el-checkbox label="比对验证">比对验证</el-checkbox>
                <el-checkbox label="模拟试验">模拟试验</el-checkbox>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="updateShowRequirements(); dialogVisible = false">确定</el-button>
            </span>
        </el-dialog>

    </el-container>
</template>
<script>
import NavBar from './NavBar.vue';
export default {
    components: {
        NavBar
    },
    computed: {
        filteredTableData() {
            return this.tableData.filter(item => this.showRequirements[item.req]);
        }
    },
    data() {
        return {
            username: localStorage.getItem('realname'),
            userid: localStorage.getItem('userid'),
            projects: [],
            status:false,
            open: false,
            title: "创建新项目",
            form: {
                name: '',
                reason: ''
            },
            project:JSON.parse(localStorage.getItem("project")),
            standarditem:JSON.parse(localStorage.getItem("standarditem")),

            parameter:JSON.parse(localStorage.getItem('parameter')),
            tableData: [{
                req: '人员',    //Members
            }, {
                req: '设备',    //Equipment
            }, {
                req: '样品',    //Sample
            }, {
                req: '方法(SOP)',    //SOP
            }, {
                req: '设施',    //Facility
            }, {
                req: '比对验证',    //ComVeri
            }, {
                req: '模拟试验',    //SimExp
            },],
            dialogVisible: false, 
            showRequirements: {
                '人员': true,
                '设备': true,
                '样品': true,
                '方法(SOP)': true,
                '设施': true,
                '比对验证': true,
                '模拟试验': true,
            },
            selectedRequirements: ['人员', '设备', '样品', '方法(SOP)', '设施', '比对验证', '模拟试验'],
            
        }
    },
    created(){
        this.fetchStatus()
    },
    methods: {
        onSearchClick() {
            console.log(this.keyword)
            this.currentPage = 1
            this.fetchProjects()
        },
        gotosub(row) {
            if(row == '人员'){
            this.$router.push({ name: 'members' })
            
            }
            if(row == '设备'){
            this.$router.push({ name: 'equipment' })
            
            }
            if(row == '样品'){
            this.$router.push({ name: 'sampledetails'})
            
            }
            if(row == '方法(SOP)'){
            this.$router.push({ name: 'sopdetails'})
            
            }
            if(row == '设施'){
            this.$router.push({ name: 'facilitydetails'})
           
            }
            if(row == '比对验证'){
            this.$router.push({ name: 'comveridetails' })
            
            }
            if(row == '模拟试验'){
            this.$router.push({ name: 'simexpdetails' })
            
            }
        },
        manage() {
            this.dialogVisible = true;
        },
        updateShowRequirements() {
            Object.keys(this.showRequirements).forEach(key => {
                this.showRequirements[key] = false;
            });
            this.selectedRequirements.forEach(req => {
                this.showRequirements[req] = true;
            });
        },
        async fetchStatus(){
            try {
                const response = await this.$http.post('/v1/parameter/getById', {
                    token: localStorage.getItem('token'),
                    id: this.parameter.id
                });
                if(response.data.code===200)
                {
                if(response.data.data.status == '已完成'){
                    this.status = true
                }else{
                    this.status = false
                }
                this.parameter=response.data.data
                }
            } catch (error) {
                console.error('请求错误:', error);
            }
        },
        async handleStatusChange(){
            var status_text = this.status ? "已完成" : "未完成"
            try {
                const response = await this.$http.post('/v1/parameter/updateParameter', {
                    token: localStorage.getItem('token'),
                    id:this.parameter.id,
                    status: status_text,
                    name: this.parameter.name,
                    sop: this.parameter.sop,
                    facility: this.parameter.facility,
                    bidui: this.parameter.bidui,
                    moni: this.parameter.moni,
                    sampleinfo: this.parameter.sampleinfo,
                    samplepic: this.parameter.samplepic,
                });
                
            } catch (error) {
                console.error('请求错误:', error);
            }           
        }

    }
}
</script>
<style>
.right {
    float: left;
    width: 300px;
    padding: 10px;
}

.right0 {
    float: left;
    width: 70px;
    padding: 10px;
    padding: 10px 0;
    margin: 12px;
}
.el-switch{
  margin-top:10px;
}
</style>