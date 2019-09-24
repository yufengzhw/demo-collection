<template>
  <a href="javascript:" class="file-btn"><slot></slot>
    <input type="file" class="form-control" id="file" :accept="SheetJSFT" @change="change"/>
  </a>
</template>

<script>
import XLSX from 'xlsx' // https://github.com/SheetJS/js-xlsx/

export default {
  name: 'fileLoader',
  data () {
    return {
      SheetJSFT: [
        'xlsx', 'xlsb', 'xlsm', 'xls', 'xml', 'csv', 'txt', 'ods', 'fods', 'uos', 'sylk', 'dif', 'dbf', 'prn', 'qpw', '123', 'wb*', 'wq*', 'html', 'htm'
      ].map(function (x) {
        return '.' + x
      }).join(',')
    }
  },
  methods: {
    change (evt) {
      const files = evt.target.files
      if (files && files[0]) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const bstr = e.target.result
          console.log(bstr)
          const wb = XLSX.read(bstr, { type: 'binary' })
          // Get first worksheet
          const wsname = wb.SheetNames[0]
          const ws = wb.Sheets[wsname]
          // Convert array of arrays
          const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true })
          // data: the first sheet of file, 2d array
          this.$emit('change', data)
        }
        reader.readAsBinaryString(files[0])
      }
    }
  }
}
</script>

<style lang="stylus">
@import "~@/common/css/variable"
.file-btn
  position: relative
  display: inline-block
  vertical-align: top
  padding: 12px 20px
  overflow: hidden
  transition: .1s
  background: $color-btn-bg-primary
  border: 1px solid $color-btn-bg-primary
  border-radius: 4px
  white-space: nowrap
  line-height: 1
  text-align: center
  font-weight: 500
  font-size: $font-size-m
  color: $color-btn-primary
  text-decoration: none
  text-indent: 0
  align-items: flex-start
  .el-button + &
    margin-right: 10px
  & + .el-button
    margin-left: 10px
  &:hover
    background-color: $color-btn-bg-hover-primary
    border-color: $color-btn-bg-hover-primary
  input
    position: absolute
    right: 0
    top: 0
    opacity: 0
</style>
