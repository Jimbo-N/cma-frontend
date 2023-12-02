<template>
    <div>
        项目id：{{ projectid }}
    </div>
</template>
<script>
export default{
    data:{
        projectid:null,
    },
    created(){
        this.projectid = this.$route.params.projectid

    }
}
</script>