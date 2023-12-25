<template>
    <el-container>
        <el-main>
            <el-row :gutter="20" class="main-header" type="flex" align="middle">
                <el-col :span="4">
                    <el-input placeholder="请输入搜索关键词" v-model="keyword" clearable prefix-icon="el-icon-search"
                        @clear="onSearchClick" @keyup.enter.native="onSearchClick" @input="onSearchClick">
                    </el-input>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary" icon="el-icon-search" size="small" @click="onSearchClick">搜索</el-button>
                </el-col>


                <el-col :span="7">
                    <el-button type="primary" icon="el-icon-plus" size="small" @click="showAddDialog" plain>添加</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="small" :disabled="deleteButton"
                        @click="batchDelete" plain>删除</el-button>
                </el-col>
            </el-row>
            <el-row style="width: 80%;height: 30px;">
                <el-col :span="6">当前人员:{{ this.person.name }}</el-col>
                <el-col :span="6">当前位置:人员资料</el-col>
            </el-row>

            <el-table stripe :data="persons" @selection-change="getChosenRows">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="url" label="链接"></el-table-column>
                <el-table-column prop="date" label="日期"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="showModifyDialog(scope.row)">修改</el-button>
                        <el-button type="text" icon="el-icon-delete" @click="deletePerson(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>

            <el-pagination class="bottom" @current-change="handlePageChange" @size-change="handleSizeChange"
                :current-page="currentPage" :page-size="pageSize" :page-sizes="[8, 15, 30]"
                layout="sizes, total,prev, pager, next" :total="totalResults">
            </el-pagination>


            <!--      添加设备对话框-->
            <el-dialog :title="tittle" :rules="rules" :visible.sync="open" width="700px" append-to-body>
                <el-form ref="form" :model="form" :rules="rules" label-width="180px">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="form.name" placeholder="请输入名称" />
                    </el-form-item>
                    <el-form-item label="链接" prop="url">
                        <el-input v-model="form.url" placeholder="请输入链接" />
                    </el-form-item>
                    <el-form-item label="日期" prop="date">
                        <el-input v-model="form.date" placeholder="请输入日期" />
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitAddForm">确定</el-button>
                    <el-button @click="cancel">取消</el-button>
                </div>
            </el-dialog>

            <!--      修改设备对话框-->
            <el-dialog :title="tittle2" :rules="rules" :visible.sync="openOfModify" width="700px" append-to-body>
                <el-form ref="form" :model="chosenPerson" :rules="rules" label-width="180px">
                    <el-form-item label="名称" prop="name">
                        <el-input v-model="chosenPerson.name" placeholder="请输入名称" />
                    </el-form-item>
                    <el-form-item label="链接" prop="url">
                        <el-input v-model="chosenPerson.url" placeholder="请输入链接" />
                    </el-form-item>
                    <el-form-item label="日期" prop="date">
                        <el-input v-model="chosenPerson.date" placeholder="请输入日期" />
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


export default {
    components: {

    },
    data() {
        let validDate = (rule, value, callback) => {
            let regex = /^(19|20)\d\d[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])$/;
            if (value == '') {
                callback(new Error("请输入日期"))
            } else if (!regex.test(value)) {
                callback(new Error("输入日期不合法 格式：2022-06-25"));
            } else {
                callback()
            }
        };
        return {
            realname: localStorage.getItem('realname'),
            userid: localStorage.getItem('userid'),
            keyword: '',
            person: JSON.parse(localStorage.getItem("person")),
            persons: [],
            chosenPerson: {},
            totalPages: 0,
            currentPage: 1,
            pageSize: 8,
            totalResults: 0,
            open: false,
            openOfModify: false,
            deleteButton: true,
            chosenIds: [],
            tittle: "添加人员资料",
            tittle2: "修改人员资料",
            form: {
                name: '',
                url: '',
                date: '',
            },
            rules: {
                name: [
                    { required: true, message: "名称不能为空", trigger: "blur" }
                ],
                url: [
                    { required: true, message: "链接不能为空", trigger: "blur" }
                ],
                date: [
                    { required: true, message: "日期不能为空", trigger: "blur" },
                    { validator: validDate, trigger: "blur" },
                ]
            },
        };
    },
    created() {
        this.getPersons()
    },
    methods: {

        onSearchClick() {

            this.currentPage = 1
            this.getPersons()
        },
        handlePageChange(newPage) {
            this.currentPage = newPage;
            this.getPersons();
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize
            this.getPersons();
        },
        showAddDialog() {
            this.open = true
        },
        showModifyDialog(chosenPerson) {
            this.openOfModify = true
            this.chosenPerson = chosenPerson
        },
        waitforme(millisec) {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve('')
                }, millisec);
            })
        },
        getChosenRows(selection) {
            if (selection.length) {
                this.deleteButton = false
                this.chosenIds = selection.map(row => row.id);
            }

        },
        async getPersons() {
            try {
                const response = await this.$http.post('/v1/personinfo/listSearchPage', {

                    token: localStorage.getItem('token'),
                    pagenumber: this.currentPage,
                    pagesize: this.pageSize,
                    personid: this.person.id,
                    search: this.keyword

                });

                this.persons = response.data.data.records;

                this.currentPage = response.data.data.current;
                this.pageSize = response.data.data.size;
                this.totalResults = response.data.data.total;
                this.totalPages = response.data.data.pages;
            } catch (error) {
                console.error('请求错误:', error);
            }
        },
        async modifyPerson() {
            try {
                const response = await this.$http.post('/v1/personinfo/updatePersoninfo', {

                    token: localStorage.getItem('token'),
                    id: this.chosenPerson.id,
                    name: this.chosenPerson.name,

                    url: this.chosenPerson.url,
                    date: this.chosenPerson.date,
                })

                if (response.data.code === 200) {
                    this.$message.success("修改成功")
                }
            } catch (error) {
                console.error('请求错误:', error);
            }
            await this.waitforme(100);
            this.getPersons();
        },
        async deletePerson(id) {
            try {
                const response = await this.$http.post('/v1/personinfo/deletePersoninfo', {

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
            this.getPersons();
        },
        async batchDelete() {
            try {
                const response = await this.$http.post('/v1/personinfo/deletebatchPersoninfo', {

                    token: localStorage.getItem('token'),
                    personinfoidlist: this.chosenIds
                })
                if (response.data.code === 200) {
                    this.$message.success("删除成功")
                }
            } catch (error) {
                console.error('请求错误:', error);
            }
            await this.waitforme(100);
            this.getPersons();
            this.chosenIds = []
        },
        async addPerson() {

            try {
                const response = await this.$http.post('/v1/personinfo/addPersoninfo', {

                    token: localStorage.getItem('token'),
                    personid: this.person.id,
                    name: this.form.name,
                    url: this.form.url,
                    date: this.form.date,
                });

                if (response.data.code === 200) {
                    this.$message.success("添加成功")
                }
            } catch (error) {
                console.error('请求错误:', error);
            }
            await this.waitforme(100);
            this.getPersons();
        },
        cancel() {
            this.open = false;
            this.form = {
                name: '',
            }
        },
        cancelModify() {
            this.openOfModify = false;
            this.chosenPerson = {}
        },
        async submitAddForm() {
            this.addPerson()
            await this.waitforme(100);
            this.getPersons();
            this.cancel()
        },
        async submitModifyForm() {
            this.modifyPerson()
            await this.waitforme(100);
            this.getPersons();
            this.cancelModify()
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

.header img {
    cursor: pointer;
}

.header .el-button {
    /* color:#333; */
    font-weight: 500;
    font-size: 17px;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
}

.header .el-col {
    margin-top: 5px;
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