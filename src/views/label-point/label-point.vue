<template>
  <div class="label-point">
    <el-row>
      <el-col :span="7">
        <a href="javascript:;" class="file">选择文件
          <input type="file" class="form-control" id="file" :accept="SheetJSFT" @change="_change"/>
        </a>
        <a href="javascript:;" class="file" @click.prevent.stop="loadExampleData">加载示例数据
          <input type="button" class="form-control"/>
        </a>
        <a href="javascript:;" class="file" @click.prevent.stop="saveFile">保存文件
          <input type="button" class="form-control"/>
        </a>
        <div style="margin: 10px auto 10px">x=0: {{timeRefFormat}}</div>
        <el-table
          :data="data"
          height="800"
          border
          :row-class-name="tableRowClassName"
          @current-change="selectRow"
          ref="dataTable">
          <el-table-column
            prop="0"
            label="x">
          </el-table-column>
          <el-table-column
            prop="1"
            label="y">
          </el-table-column>
          <el-table-column
            prop="2"
            label="z"
          >
          </el-table-column>
          <el-table-column
            prop="tag1"
            label="tag1"
          >
          </el-table-column>
          <el-table-column
            prop="tag2"
            label="tag2"
          >
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="4">
        <div class="dis-option" style="margin: 10px 5px 0">
          <p class="text">显示选项</p>
          <div class="noise-hidden" style="margin: 5px 10px">
            <el-switch v-model="noiseHidden" active-text="屏蔽噪音" inactive-text="显示噪音" @change="_updateFigure"></el-switch>
          </div>
          <div class="tag1-hidden" style="margin: 5px 10px">
            <el-select v-model="tag1Hidden" multiple placeholder="请选择屏蔽的tag1" @change="_updateFigure">
              <el-option v-for="item in tag1Group" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </div>
          <div class="tag2-hidden" style="margin: 5px 10px">
            <el-select v-model="tag2Hidden" multiple placeholder="请选择屏蔽的tag2" @change="_updateFigure">
              <el-option v-for="item in tag2Group" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </div>
        </div>
        <div class="group-choose" style="margin: 0 5px">
          <p class="text">选择附近的点</p>
          <el-button type="primary" style="margin: 0 10px 10px" @click="chooseNeighbor">选择</el-button>
          <div class="group-option" style="margin: 0 10px">
            <div class="scale option-item">
              <p>距离范围</p>
              <el-input-number v-model="distanceRange" :precision="2" :step="0.05" :max="10" :min="0.01"></el-input-number>
            </div>
            <div class="t-scale option-item">
              <p>x_scale</p>
              <el-input-number v-model="xScale" :precision="3" :step="0.05" :max="5" :min="0.01"></el-input-number>
            </div>
            <div class="t-scale option-item">
              <p>y_scale</p>
              <el-input-number v-model="yScale" :precision="2" :step="0.1" :max="4" :min="0.01"></el-input-number>
            </div>
            <div class="t-scale option-item">
              <p>z_scale</p>
              <el-input-number v-model="zScale" :precision="0" :step="1" :max="50" :min="0.01"></el-input-number>
            </div>
            <div style="margin-top: 10px; line-height: 20px;">
              <div>距离计算公式:</div>
              <div>d^2 = (x/x_scale)^2+(y/y_scale)^2+(z/z_scale)^2</div>
            </div>
          </div>
        </div>
        <div style="margin: 0 5px">
          <p style="margin: 10px 10px 5px">快捷键说明</p>
          <div style="margin: 0 15px; line-height: 20px">
            <div>w,s:选择上（下）个点</div>
            <div>g:选择附近的点</div>
            <div>c:清空选择</div>
            <div>1~9:设置当前选择点的tag1（1～9）</div>
            <div>l,r:设置当前选择点的tag2（1/2）</div>
            <div>q:设置当前选择点为噪点</div>
          </div>
        </div>
      </el-col>
      <el-col :span="13">
        <div class="figure" ref="figure" width="100%"></div>
      </el-col>
    </el-row>
    <div class="comment">
      <p class="title">说明：</p>
      <ul>
        <li>*该工具用于对某种类型的三维数据进行手动快速标定</li>
        <li>*初次运行Demo程序可先点击加载示例数据，后续可以点击选择文件来加载已保存的xlsx文件</li>
        <li>*点击保存文件直接下载数据为xlsx文件</li>
        <li>*选择数据点：点击表格中一行数据或从图中选择数据点</li>
        <li>*从当前数据选择附近数据：点击选择附近的点或者按g可从当前数据点选择附近的点，用于批量编辑数据</li>
      </ul>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'

const _SheetJSFT = [
  'xlsx', 'xlsb', 'xlsm', 'xls', 'xml', 'csv', 'txt', 'ods', 'fods', 'uos', 'sylk', 'dif', 'dbf', 'prn', 'qpw', '123', 'wb*', 'wq*', 'html', 'htm'
].map(function (x) {
  return '.' + x
}).join(',')

const tagColor = ['#1710c0', '#0b9df0', '#00fea8', '#f5f811', '#f09a09', '#fe0300', '#000000']
const selectColor = '#000000'
const noiseColor = '#B0B5BE'

export default {
  data () {
    return {
      data: [],
      timeRef: 0,
      SheetJSFT: _SheetJSFT,
      showFourth: false,
      indexSelect: -1,
      noiseHidden: false,
      tag1Group: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      tag1Hidden: [],
      tag2Group: [1, 2],
      tag2Hidden: [],
      groupPointSelect: [],
      xScale: 50,
      yScale: 1.5,
      zScale: 4,
      distanceRange: 1
    }
  },
  computed: {
    timeRefFormat () {
      return this.timeRef === 0 ? '' : this.formatDate(new Date(this.timeRef * 1000))
    }
  },
  mounted () {
    this._initFigure()
    this.registerKeyEvent()
  },
  methods: {
    loadExampleData () {
      const data = []
      this.timeRef = ((new Date()).getTime() / 1000) | 0
      for (let i = 0; i < 100; i++) {
        let dataItem = [
          parseFloat((i * 2 + Math.random() * 10).toFixed(3)),
          parseFloat((2.5 + Math.random() * 0.5).toFixed(3)),
          parseFloat((5 + 0.35 * i + Math.random() * 0.05).toFixed(3))
        ]
        dataItem.tag1 = 1
        dataItem.tag2 = 1
        data.push(dataItem)

        dataItem = [
          parseFloat((i * 2 + Math.random() * 10).toFixed(3)),
          parseFloat((4.5 + Math.random() * 0.5).toFixed(3)),
          parseFloat((5 + 0.35 * i + Math.random() * 0.05).toFixed(3))
        ]
        dataItem.tag1 = 1
        dataItem.tag2 = 2
        data.push(dataItem)

        dataItem = [
          parseFloat((i * 2 + Math.random() * 10).toFixed(3)),
          parseFloat((6.5 + Math.random() * 0.5).toFixed(3)),
          parseFloat((15 + 0.35 * i + Math.random() * 0.05).toFixed(3))
        ]
        dataItem.tag1 = 2
        dataItem.tag2 = 1
        data.push(dataItem)

        dataItem = [
          parseFloat((i * 2 + Math.random() * 10).toFixed(3)),
          parseFloat((8.5 + Math.random() * 0.5).toFixed(3)),
          parseFloat((15 + 0.35 * i + Math.random() * 0.05).toFixed(3))
        ]
        dataItem.tag1 = 2
        dataItem.tag2 = 2
        data.push(dataItem)

        dataItem = [
          i > 0 ? parseFloat((Math.random() * 200).toFixed(3)) : 0,
          parseFloat((Math.random() * 10).toFixed(3)),
          parseFloat((Math.random() * 60).toFixed(3))
        ]
        dataItem.tag1 = -1
        dataItem.tag2 = -1
        data.push(dataItem)
      }
      data.sort((a, b) => a[0] - b[0])
      this.data = data
      this.$nextTick(() => {
        this._initFigure()
        this._updateFigure()
      })
    },
    formatDate (date) {
      console.log(date)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let minute = date.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      let second = date.getSeconds()
      second = second < 10 ? ('0' + second) : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    },
    outputName () {
      let date = new Date(this.timeRef * 1000)
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let minute = date.getMinutes()
      minute = minute < 10 ? ('0' + minute) : minute
      return `${m}_${d}_${h}_${minute}_label.xlsx`
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === this.indexSelect) {
        return 'select-row'
      } else if (this.groupPointSelect.indexOf(rowIndex) > -1) {
        return 'multi-select-row'
      } else if (this.data[rowIndex].tag1 > 0) {
        return 'useful-row'
      }
      return 'blank-row'
    },
    _change (evt) {
      this.data = []
      const files = evt.target.files
      if (files && files[0]) this._file(files[0])
    },
    _file (file) {
      /* Boilerplate to set up FileReader */
      const reader = new FileReader()
      reader.onload = (e) => {
        /* Parse data */
        const bstr = e.target.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        /* Get first worksheet */
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true })
        this.timeRef = (data[0] && data[0][0]) || 0
        for (let i = 0; i < data.length; i++) {
          if (data[i].length > 0) {
            data[i][0] = parseFloat((data[i][0] - this.timeRef).toFixed(3))
            data[i].tag1 = data[i][3] ? data[i][3] : -1
            data[i].tag2 = data[i][4] ? data[i][4] : -1
          }
        }
        this.data = data
        console.log('data', data)
        this._refreshDataTable()
        this._updateFigure()
      }
      reader.readAsBinaryString(file)
    },
    _clearDataTag () {
      for (let i = 0; i < this.data.length; i++) {
        this.data[i].tag = -1
      }
    },
    _refreshDataTable () {
      let data = this.data
      this.data = []
      this.data = data
    },
    _initFigure () {
      this.figure = this.$echarts.init(this.$refs.figure)
      this.figure.on('click', val => {
        this.indexSelect = this.data.findIndex(item => {
          return item[0] === val.data[2] && item[1] === val.data[1] && item[2] === val.data[0]
        })
        if (this.indexSelect > -1) {
          this._updateFigure()
        }
        if (val.dataIndex && val.dataIndex >= 0 && val.dataIndex < this.data.length) {
          this.indexSelect = val.dataIndex
          this._updateFigure()
        }
      })
    },
    _updateFigure () {
      let data = []
      for (let i = 0; i < this.data.length; i++) {
        let item = this.data[i]
        if (this.noiseHidden && item.tag1 === -1) {
          continue
        }
        if (this.tag1Hidden.indexOf(item.tag1) > -1) {
          continue
        }
        if (this.tag2Hidden.indexOf(item.tag2) > -1) {
          continue
        }
        if (this.indexSelect > -1 && this.indexSelect === i) {
          data.push([item[0], item[1], item[2], 100, item['tag2']])
        } else if (this.groupPointSelect.indexOf(i) > -1) {
          data.push([item[0], item[1], item[2], 100, item['tag2']])
        } else {
          data.push([item[0], item[1], item[2], item['tag1'], item['tag2']])
        }
      }
      this.figure.setOption({
        visualMap: [{
          show: false,
          type: 'piecewise',
          splitNumber: 6,
          pieces: [
            { min: 4.5 },
            { min: 3.5, max: 4.5 },
            { min: 2.5, max: 3.5 },
            { min: 1.5, max: 2.5 },
            { min: 0.5, max: 1.5 },
            { min: -0.5, max: 0.5 }
          ],
          dimension: 'tag1',
          inRange: {
            color: tagColor
          },
          outOfRange: {
            color: [noiseColor]
          }
        }],
        xAxis3D: {
          name: 'x',
          type: 'value'
        },
        yAxis3D: {
          name: 'y',
          type: 'value'
        },
        zAxis3D: {
          name: 'z',
          type: 'value'
        },
        grid3D: {
          viewControl: {
            projection: 'orthographic'
          }
        },
        series: [{
          type: 'scatter3D',
          dimensions: ['x', 'y', 'z', 'tag1', 'tag2'],
          data: data,
          symbolSize: 12,
          itemStyle: {
            //              borderWidth: 1,
            //              borderColor: 'rgba(255, 0, 0, 0)'
          },
          emphasis: {
            itemStyle: {
              color: selectColor
            }
          }
        }]
      })
    },
    selectRow (val) {
      this.indexSelect = this.data.findIndex(item => item === val)
      this.groupPointSelect = [] // 清空多选
      console.log('select row', this.indexSelect)
      this._refreshDataTable()
      this._updateFigure()
    },
    clearSelection () {
      this.indexSelect = -1
      this.groupPointSelect = []
      this._refreshDataTable()
      this._updateFigure()
    },
    toggleIndex (tag) {
      //        console.log(tag)
      if (this.data.length === 0) {
        return
      }
      if (tag === 'down') {
        this.indexSelect += 1
        this.indexSelect = (this.indexSelect < this.data.length) ? this.indexSelect : (this.data.length - 1)
      } else if (tag === 'up') {
        this.indexSelect -= 1
        this.indexSelect = (this.indexSelect < 0) ? 0 : this.indexSelect
      }
      this._updateFigure()
    },
    setTag1 (val) {
      if (this.indexSelect < 0) {
        return
      }
      this.data[this.indexSelect].tag1 = val
      if (val > -1) {
        this.data[this.indexSelect].tag2 = 1
      } else {
        this.data[this.indexSelect].tag2 = -1
      }
      this.groupPointSelect.forEach((item) => {
        this.data[item].tag1 = val
        if (val > -1) {
          this.data[item].tag2 = 1
        } else {
          this.data[item].tag2 = -1
        }
      })
      this.indexSelect = -1
      this.groupPointSelect = []
      this._refreshDataTable()
      this._updateFigure()
    },
    setTag2 (val) {
      if (this.indexSelect < 0 || this.data[this.indexSelect].tag1 < 0) {
        return
      }
      this.data[this.indexSelect].tag2 = val
      this.groupPointSelect.forEach((item) => {
        if (this.data[item].tag1 > -1) {
          this.data[item].tag2 = val
        }
      })
      this.indexSelect = -1
      this.groupPointSelect = []
      this._refreshDataTable()
      this._updateFigure()
    },
    chooseNeighbor () {
      if (this.indexSelect < 0) {
        return
      }
      this.groupPointSelect = []
      let currentItem = this.data[this.indexSelect]
      for (let i = 0; i < this.data.length; i++) {
        if (i !== this.indexSelect) {
          let item = this.data[i]
          if (this.noiseHidden && item.tag1 === -1) {
            continue
          }
          if (this.tag1Hidden.indexOf(item.tag1) > -1) {
            continue
          }
          if (this.tag2Hidden.indexOf(item.tag2) > -1) {
            continue
          }
          let xDiff = (item[0] - currentItem[0]) / this.xScale
          let yDiff = (item[1] - currentItem[1]) / this.yScale
          let zDiff = (item[2] - currentItem[2]) / this.zScale
          if (xDiff * xDiff + yDiff * yDiff + zDiff * zDiff < this.distanceRange * this.distanceRange) {
            this.groupPointSelect.push(i)
          }
        }
      }
      this._refreshDataTable()
      this._updateFigure()
    },
    registerKeyEvent () {
      window.document.onkeydown = event => {
        if (event.code.startsWith('Digit')) {
          return this.setTag1(Number(event.code.slice(-1)))
        }
        switch (event.code) {
          case 'KeyW':
            this.toggleIndex('up')
            break
          case 'KeyS':
            this.toggleIndex('down')
            break
          case 'KeyQ':
            this.setTag1(-1)
            break
          case 'KeyR':
            this.setTag2(2)
            break
          case 'KeyL':
            this.setTag2(1)
            break
          case 'KeyC':
            this.clearSelection()
            break
          case 'KeyG':
            this.chooseNeighbor()
            break
          default:
            break
        }
      }
    },
    saveFile () {
      if (this.data.length === 0) {
        return
      }
      let data = this.data.map(item => [item[0] + this.timeRef, item[1], item[2], item.tag1, item.tag2])
      let ws = XLSX.utils.aoa_to_sheet(data)
      let wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'new_sheet')
      XLSX.writeFile(wb, this.outputName())
    }
  }
}
</script>
<style lang="stylus">
  .label-point
    .file
      position: relative
      display: inline-block
      background: #D0EEFF
      border: 1px solid #99D3F5
      border-radius: 4px
      padding: 4px 12px
      overflow: hidden
      color: #1E88C7
      text-decoration: none
      text-indent: 0
      line-height: 20px
      &:hover
        background: #AADFFD;
        border-color: #78C3F3;
        color: #004974;
        text-decoration: none;
      input
        position: absolute
        font-size: 100px
        right: 0
        top: 0
        opacity: 0
    .group-choose
      .text
        line-height: 20px
      .group-option
        .option-item
          margin: 5px 0 5px 0
          p
            line-height: 20px
    .figure
      margin-top: 30px
      width: 800px
      height: 800px
    .select-row
      background-color: #a0cfff !important;
    .multi-select-row
      background-color: #a0cfff !important;
    .comment
      margin-top: 30px
      .title
        font-weight: 500
      ul
        margin-top: 10px
        line-height: 20px
        text-indent: 1em
</style>
