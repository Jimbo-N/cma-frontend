<template>
    <div class="fs-transfer-panel" :style="panelStyle">
      <div class="fs-transfer-panel_header">
        <el-checkbox
          v-model="allChecked"
          @change="handleAllCheckedChange"
          :indeterminate="isIndeterminate"
        >
          {{ title }}
        </el-checkbox>
        <span>{{ checkedSummary }}</span>
      </div>
      <div class="el-transfer-panel_filter" v-if="filterable">
        <el-input
          class="fs-teansfer-input"
          size="small"
          :placeholder="filterPlaceholder"
          prefix-icon="el-icon-search"
          v-model="keywords"
        />
      </div>
      <div class="fs-transfer-panel_body" ref="panelBody">
        <el-table
          v-bind="tableProps"
          :data="filteredData"
         
          
          :height="350"
          @selection-change="selectionChange"
          :empty-text="emptyText"
          ref="table"
        >
          <el-table-column type="selection" width="55" :selectable="selectable" fixed="left"></el-table-column>
          <slot name="table" />
        </el-table>
      </div>
      <div class="fs-transfer-panel_footer" v-if="$slots.footer">
        <slot name="footer" />
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FsTransferPanel',
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      title: String,
      defaultChecked: Array,
      filterable: Boolean,
      filterPlaceholder: String,
      filterMethod: Function,
      targetOrder: String,
      format: Object,
      rowKey: String,
      selectable: Function,
      panelStyle: Object,
      tableProps: Object
    },
    data() {
      return {
        allChecked: false,
        checked: [],
        keywords: '',
        checkChangeByUser: true,
        tableHeight: 200
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.tableHeight = parseFloat(getComputedStyle(this.$refs.panelBody).height)
      })
    },
    computed: {
      filteredData() {
        return this.data.filter(item => {
          if (typeof this.filterMethod === 'function') {
            return this.filterMethod(this.keywords, item)
          } else {
            return true
          }
        })
      },
      emptyText() {
        if (this.keywords.length && this.filteredData.length === 0) {
          return '无匹配数据'
        }
        return '暂无数据'
      },
      isIndeterminate() {
        if (this.checked.length) {
          if (this.checked.length === this.selectableLength) {
            return false
          } else {
            return true
          }
        }
        return false
      },
      selectableLength() {
        if (typeof this.selectable === 'function') {
          return this.filteredData.filter(this.selectable).length
        } else {
          return this.filteredData.length
        }
      },
      checkableData() {
        if (typeof this.selectable === 'function') {
          return this.filteredData.filter(this.selectable)
        } else {
          return this.filteredData
        }
      },
      checkedSummary() {
        const checkedLength = this.checked.length
        const dataLength = this.data.length
        const { noChecked, hasChecked } = this.format
        if (noChecked && hasChecked) {
          return checkedLength > 0
            ? hasChecked.replace(/\${checked}/g, checkedLength).replace(/\${total}/g, dataLength)
            : noChecked.replace(/\${total}/g, dataLength)
        } else {
          return `${ checkedLength }/${ dataLength }`
        }
      },
    },
    watch: {
      checked(val, oldVal) {
        const valArr = val.map(i => i[this.rowKey])
        const oldValArr = oldVal.map(i => i[this.rowKey])
        if (this.checkChangeByUser) {
          const movedKeys = valArr.concat(oldValArr)
            .filter(v => valArr.indexOf(v) === -1 || oldValArr.indexOf(v) === -1)
          this.$emit('checked-change', valArr, movedKeys, val)
        } else {
          this.$emit('checked-change', valArr)
          this.checkChangeByUser = true
        }
      },
      defaultChecked: {
        immediate: true,
        handler(val, oldVal) {
          if (oldVal && val.length === oldVal.length &&
            val.every(item => oldVal.indexOf(item) > -1)) return;
          const checked = [];
          this.checkableData.forEach(row => {
            if (val.indexOf(row[this.rowKey]) > -1) {
              checked.push(row)
              this.$nextTick(() => {
                this.$refs.table.toggleRowSelection(row, true)
              })
            }
          })
          this.checkChangeByUser = false
          this.checked = checked
        }
      }
    },
    methods: {
      selectionChange(val) {
        this.checked = val
        if (val.length && !this.isIndeterminate) {
          this.allChecked = true
        } else {
          this.allChecked = false
        }
      },
      handleAllCheckedChange(val) {
        if (this.selectableLength === 0) {
          this.allChecked = false
          return
        }
        if (val) {
          this.$refs.table.toggleAllSelection(true)
        } else {
          this.$refs.table.toggleAllSelection(false)
        }
      },
      clearQuery() {
        this.keywords = ''
      }
    }
  }
  </script>
  
  <style lang="scss" scoped>
  $--border-color: #ebeef5;
  .fs-transfer-panel {
    display: inline-flex;
    flex-direction: column;
    vertical-align: middle;
    height: 100%;
    overflow: hidden;
    border: 1px solid $--border-color;
    border-radius: 5px;
    min-width: 200px;
    flex: 1;
  
    .fs-transfer-panel_header {
      height: 40px;
      line-height: 40px;
      background: #f5f7fa;
      border-bottom: 1px solid $--border-color;
      padding: 0 15px;
      span:nth-last-child(1) {
        float: right;
        font-size: 12px;
        color: #909399;
        margin-left: 10px;
      }
    }
  
    .el-transfer-panel_filter {
      padding: 10px;
    }
  
    .fs-transfer-panel_footer {
      padding: 10px;
      border-top: 1px solid $--border-color;
    }
  
    .fs-transfer-panel_body {
      padding: 0 10px;
      // overflow-y: overlay;
      overflow: hidden;
      flex: 1;
    }
  }
  
  ::v-deep .el-table::before {
    height: 0;
  }
  
  ::v-deep .el-input__inner {
    border-radius: 28px;
  }
  
  ::v-deep .el-table__fixed::before {
    height: 0;
  }
  </style>
  