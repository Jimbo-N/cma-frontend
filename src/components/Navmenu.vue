<template>
    <el-aside width="150px" style="height: 600px;">
        <el-menu router :default-active="activeMenu">
            <el-menu-item index="/main/projects">
                <i class="el-icon-menu"></i>
                <span>项目列表</span>
            </el-menu-item>
            <el-menu-item index="/main/employee">
                <i class="el-icon-user"></i>
                <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="/main/personlib">
                <i class="el-icon-user-solid"></i>
                <span>人员库</span>
            </el-menu-item>
            <el-menu-item index="/main/standardlib">
                <i class="el-icon-s-order"></i>
                <span>标准库</span>
            </el-menu-item>
            <el-menu-item index="/main/equipmentlib">
                <i class="el-icon-s-platform"></i>
                <span>设备库</span>
            </el-menu-item>
        </el-menu>
    </el-aside>
</template>
<script>
export default {
    computed: {
        activeMenu() {
            const route = this.$route;
            const { meta, path } = route;
            if (meta.activeMenu) {
                return meta.activeMenu;
            }
            return path;
        }
    }
}
</script>