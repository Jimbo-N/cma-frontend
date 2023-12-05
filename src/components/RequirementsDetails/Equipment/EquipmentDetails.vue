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
                <el-button type="warning" @click="changeDevice()">编辑设备</el-button>
            </el-row>
            <el-row class="cont" type="flex" justify="center" style="width: 100%;">
                <el-col :span="20">
                    <el-table stripe :data="devices">
                        <el-table-column prop="did" label="设备编号"></el-table-column>
                        <el-table-column prop="dname" label="设备名称"></el-table-column>
                        <el-table-column prop="dstate" label="状态"></el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <el-button @click="">查看</el-button>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-col>
            </el-row>

        </el-main>
    </el-container>
</template>
  
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
.modifybtn{
    width: 100%;
    display: flex;
    justify-content: left;
    padding-left: 100px;
}

</style>
  
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
            devices: [
                {
                    did: 1,
                    dname: '机器1',
                    dstate: '已完成'
                },
                {
                    did: 2,
                    dname: '机器2',
                    dstate: '未完成'
                },
                {
                    did: 3,
                    dname: '机器3',
                    dstate: '已完成'
                }
            ]
        };
    },
    methods: {
        changeDevice(){
            this.$router.push({ name: 'equipment', params: this.params }) 
        }

    },

    created() {
        //   alert(123);
        if(this.projectid!=null){
            localStorage.setItem('projectid', JSON.stringify(this.projectid));
        }
        if(this.standardid!=null){
            localStorage.setItem('standardid', JSON.stringify(this.standardid));
        }
        if(this.subpid!=null){
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