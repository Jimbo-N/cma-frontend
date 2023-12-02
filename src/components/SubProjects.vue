<template>
        <el-container>
            <NavBar></NavBar>
            <el-main>
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item :to="{ name: 'projects' ,params:this.params}">项目列表</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ name: 'standard' ,params:this.params}">标准列表</el-breadcrumb-item>
                    <el-breadcrumb-item >子项列表</el-breadcrumb-item>
                </el-breadcrumb>
        <div>
            子项id:{{ params.standardid }}
        </div>
        <el-button @click="gotorequirements(3)">
            去要求页面
        </el-button>
            </el-main>
    </el-container>
</template>
<script>
import NavBar from './NavBar.vue';
export default{
    components:{
        NavBar
    },
    data(){
        return{
            params:{
                projectid:this.$route.params.projectid,
                standardid:this.$route.params.standardid,
                subpid:null,
        }
        }
    },
    methods:{
        gotorequirements(id){
            this.params.subpid = id
            this.$router.push({ name: 'requirements', params: this.params })
        }
    }

}
</script>