
<template>
    <el-container>
        <Navmenu></Navmenu>
        <el-container>
            <NavBar></NavBar>
            
                <router-view></router-view>
            
        </el-container>
    </el-container>
</template>
<script>
import NavBar from '@/components/NavBar.vue';
import Navmenu from '@/components/Navmenu.vue';
export default {
    components: {
        NavBar,
        Navmenu
    }
}

</script>
<style>

</style>