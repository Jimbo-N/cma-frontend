<template>
    <el-container>
        <NavBar></NavBar>
        <el-main>
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/projects' }">项目列表</el-breadcrumb-item>
                <el-breadcrumb-item >标准列表</el-breadcrumb-item>
            </el-breadcrumb>
        <el-row>项目id:{{ params.projectid }}</el-row>
        <el-button @click="gotosub(5)">去子项列表的按钮</el-button>
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
                standardid:null,
                subid:null
            }
            
        }
    },
    methods:{
        gotosub(id){
            this.params.standardid = id
            this.$router.push({ name: 'subprojects', params: this.params })    
            console.log("params:"+JSON.stringify(this.params))
        }
    },
    created(){
        
    }
}
</script>