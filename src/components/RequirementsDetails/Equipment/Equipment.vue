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
          <el-breadcrumb-item>设备选择</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row class="nowpos">
        <p>当前项目:<span>{{ $route.params.projectid }}</span></p>
        <p>当前标准:<span>{{ $route.params.standardid }}</span></p>
        <P>当前参数:<span>{{ $route.params.subpid }}</span></P>
        <p>当前位置:<span>设备选择</span></p>
      </el-row>
      <el-row class="cont" type="flex" justify="center">
        <el-col class="transfer-container transfer-zoom">
          <el-transfer class="my-transfer"
        filterable
        :filter-method="filterMethod"
        filter-placeholder="搜素设备"
        :titles="['设备库','已选设备']"
        v-model="value"
        :buttonposition="right"
        :data="data">
        </el-transfer>

        </el-col>
        <!-- <el-button @click='debug()'>dedede</el-button> -->

      </el-row>
      <el-row>
        <el-button class="savebtn" @click="changeDevice()">保存设置</el-button>
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

.my-transfer {
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

.savebtn {
  margin: 50px;
}

.transfer-zoom {
  transform: scale(1.2); /* 调整放大倍数 */
}

</style>

<script>
import NavBar from '@/components/NavBar.vue';
export default {
  components: {
    NavBar
  },
  data() {
    const generateData = _ => {
      const data = [];
      const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];      //获取后端数据
      const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
      cities.forEach((city, index) => {
        data.push({
          label: city,
          key: index,
          pinyin: pinyin[index] + cities[index]
        });
      });
      return data;
    };
    return {
      data: generateData(),
      value: [],              //获取后端数据
      filterMethod(query, item) {
        return item.pinyin.indexOf(query) > -1;
      },
      projectid: this.$route.params.projectid,
      standardid: this.$route.params.standardid,
      subpid: this.$route.params.subpid
    };
  },
  methods: {
    // debug(){
    //   console.log("value=")
    //   console.log(this.value)
    // },
    changeDevice() {
      const h = this.$createElement;          //
      this.$message({
        message: h('p', null, [
          h('i', { style: 'color: rgb(90,156,248)' }, '保存成功')
        ]),
        type: 'success'
      });
    }
  }

}


</script>