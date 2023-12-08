<template>
	<el-container>
		<!-- <NavBar></NavBar> -->
		<!-- 做一个表示选中状态的BAR -->
		<el-header class="header">
      <el-row :gutter="15">
        <el-col :span="2">
            <img src="@/assets/logo.png" alt="Logo" class="logo" @click="gotoMain" >
        </el-col>
        <el-col :span="2" :offset="13">
          <el-button type="primary" size="small" @click="gotoEmp">人员信息</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="text" @click="gotoStandardlib">&nbsp;&nbsp;标准库</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="text" @click="gotoEquipmentlib">设备库</el-button>
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
		
		<!-- 表格主体 -->
		<el-main>
			<!-- 搜索栏等同款样式 -->
			<el-row :gutter="20" class="main-header" type="flex" align="middle">
        <el-col :span="4">
          <el-input placeholder="请输入搜索关键词" v-model="keyword" clearable prefix-icon="el-icon-search" @clear="onSearchClick"
                    @keyup.enter.native="onSearchClick" @input="onSearchClick">
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" size="small" @click="onSearchClick">搜索</el-button>
        </el-col>
        <!-- <el-col :span="7">
          <el-button type="primary" icon="el-icon-plus"  size="small" @click="showAddDialog" plain>添加</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" :disabled="deleteButton" @click="batchDelete" plain>删除</el-button>
        </el-col> -->
      </el-row>

			<!-- 创建表格 -->
			<!-- 不需要多选框的情况 -->
			<el-table stripe :data="employees">
				<!-- <el-table-column type="selection" width="55" /> -->
				<el-table-column prop="id" label="人员ID"></el-table-column>
				<el-table-column prop="realname" label="人员姓名"></el-table-column>
				<el-table-column label="人员权限">
					<template slot-scope="scope">
						<el-select v-model="scope.row.privilege" placeholder="请选择用户权限" @change="updatePrivilege(scope.row)" :disabled="hasprivilege(4)">
							<el-option label="超级管理员" value=4></el-option>
							<el-option label="管理员" value=3></el-option>
							<el-option label="技术员" value=2></el-option>
							<el-option label="浏览者" value=1></el-option>
							<el-option label="黑名单" value=0></el-option>
						</el-select>
					</template>
				</el-table-column>
				<!-- <el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-edit" @click="showModifyDialog(scope.row)">修改</el-button>
            <el-button type="text" icon="el-icon-delete" @click="deleteEmployee(scope.row.id)">删除</el-button>
					</template>
				</el-table-column> -->

			</el-table>

			<!-- 分页功能 -->
			<el-pagination class="bottom" 
											@current-change="handlePageChange" 
											@size-change="handleSizeChange"
                     	:current-page="currentPage" 
											:page-size="pageSize" 
											:page-sizes="[8, 15, 30]"
                     	layout="sizes, total,prev, pager, next" 
											:total="totalResults">
      </el-pagination>
		</el-main>
	</el-container>
</template>

<script>
import NavBar from './NavBar.vue'
export default {
	components:{
		NavBar
	},
	data(){
		return{
			username: localStorage.getItem('username'),
			userid: localStorage.getItem('userid'),
			keyword: '',
			employees: [],
			totalPages: 0,
			currentPage: 1,
			pageSize: 8,
			
		}
	},
	created(){
		this.getEmployees()
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
		// 获取人员信息，未修改
		async getEmployees(){
			try {
        const response = await this.$http.post('/v1/user/listSearchPage', {
          token: localStorage.getItem('token'),
					pagenumber: this.currentPage,
					pagesize: this.pageSize,
					search: this.keyword,
        });
        console.log('后端返回：' + response.data.data.current)
        this.employees = response.data.data.records;
		// 遍历员工数组，为每个员工转换权限值
		this.employees.forEach(employee => {
			employee.privilege = this.convertPrivilegeToText(employee.privilege);
		});

        this.currentPage = response.data.data.current;
        this.pageSize = response.data.data.size;
        this.totalResults = response.data.data.total;
        this.totalPages = response.data.data.pages;
      } catch (error) {
        console.error('请求错误:', error);
      }
		},

		//更新人员权限
		async updatePrivilege(row) {
			try{
				console.log("mark:"+row.privilege)
				const response = await this.$http.post('/v1/user/setPrivilege', {
					token: row.token,
					userid: row.id,
					privilege: row.privilege
				});
				if(response.data.code === 0){
					this.$message.success("修改成功")
				}
			} catch(error) {
				console.error('更新失败', error);
			}
		},
		convertPrivilegeToText(privilege) {
			const privilegeMap = {
				4: '超级管理员',
				3: '管理员',
				2: '技术员',
				1: '浏览者',
				0: '黑名单'
			};
			return privilegeMap[privilege] || '未知权限';
		},

		//搜索功能实现
		onSearchClick() {
			console.log(this.keyword)
			this.currentPage = 1
			this.getEmployees()
		},
		// //未完善，点击修改之后的行为
		// showModifyDialog(){
		// },
		// //未完善，点击删除之后的行为
		// deleteEmployee(){

		// },
		//当前页码改变后的回调函数
		handlePageChange(newPage){
			this.currentPage = newPage;
			this.getEmployees();
		},
		//当前每页显示数量改变时的回调函数
		handleSizeChange(newSize){
			this.pageSize = newSize;
			this.getEmployees();
		},
		hasprivilege(num)
		{
			this.getuserinfo()
			var privilege=localStorage.getItem('privilege')
			return !(privilege>=num)
		},
		async getuserinfo()
      {
        try {
          const response = await this.$http.post('/v1/user/getuserinfo', {
            token:localStorage.getItem('token')
          })
          if (response.data.code === 200) {
            
            localStorage.setItem('userid', response.data.data.id)
            localStorage.setItem('realname', response.data.data.realname)
            localStorage.setItem('privilege', response.data.data.privilege)
          } else {
            this.$message.error(response.data.msg)
            console.log(response.data.msg)
          }
        } catch (error) {
          this.$message.error('登录失败')
        }
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

</style>