<template>
  <div class="label-point">
    <el-row>
      <el-col :span="7">
        <file-loader-button @change="changeLoadData">加载文件</file-loader-button>
        <el-button type="primary" @click="loadExampleData">加载示例数据</el-button>
        <el-button type="primary" @click="saveFile">保存文件</el-button>
        <div style="margin: 10px auto 10px">x=0: {{timeRefFormat}}</div>
        <el-table
          :data="data"
          height="800"
          border
          :row-class-name="tableRowClassName"
          @current-change="selectRow"
          ref="dataTable">
          <el-table-column prop="0" label="x"></el-table-column>
          <el-table-column prop="1" label="y"></el-table-column>
          <el-table-column prop="2" label="z"></el-table-column>
          <el-table-column prop="tag1" label="tag1"></el-table-column>
          <el-table-column prop="tag2" label="tag2"></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="4">
        <div class="dis-option" style="margin: 10px 5px 0">
          <p class="text">显示选项</p>
          <div class="noise-hidden" style="margin: 5px 10px">
            <el-switch v-model="noiseHidden" active-text="屏蔽噪音" inactive-text="显示噪音" @change="updateFigure"></el-switch>
          </div>
          <div class="tag1-hidden" style="margin: 5px 10px">
            <el-select v-model="tag1Hidden" multiple placeholder="请选择屏蔽的tag1" @change="updateFigure">
              <el-option v-for="item in tag1Group" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </div>
          <div class="tag2-hidden" style="margin: 5px 10px">
            <el-select v-model="tag2Hidden" multiple placeholder="请选择屏蔽的tag2" @change="updateFigure">
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
            <div class="option-item">
              <p>x_scale</p>
              <el-input-number v-model="xScale" :precision="3" :step="0.05" :max="5" :min="0.01"></el-input-number>
            </div>
            <div class="option-item">
              <p>y_scale</p>
              <el-input-number v-model="yScale" :precision="2" :step="0.1" :max="4" :min="0.01"></el-input-number>
            </div>
            <div class="option-item">
              <p>z_scale</p>
              <el-input-number v-model="zScale" :precision="0" :step="1" :max="50" :min="0.01"></el-input-number>
            </div>
            <div style="margin-top: 10px; line-height: 20px;">
              <div>距离计算公式:</div>
              <div>d^2 = (x/x_scale)^2+(y/y_scale)^2+(z/z_scale)^2</div>
            </div>
          </div>
        </div>
        <div class="shortcut-comment" v-once>
          <list-comment title="快捷键说明:" :data="shortcutComment" bullet="*"></list-comment>
        </div>
      </el-col>
      <el-col :span="13">
        <div class="figure" ref="figure"></div>
      </el-col>
    </el-row>
    <div class="comment" v-once>
      <list-comment title="说明:" :data="pageComment" bullet="*"></list-comment>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/common/js/date'
import { genExampleData, preprocessData, saveData } from '@/components/label-point/data'
import { getfigureOptions, SELECT_TAG } from '@/components/label-point/figure'
import ListComment from '@/base/list-comment/list-comment.vue'
import FileLoaderButton from '@/components/label-point/csvFileLoaderButton/fileLoaderButton.vue'

export default {
  data () {
    const maxTag1 = 4
    return {
      data: [],
      timeRef: 0,
      showFourth: false,
      indexSelect: -1,
      noiseHidden: false,
      maxTag1,
      tag1Group: new Array(maxTag1).fill(null).map((_, index) => index + 1),
      tag1Hidden: [],
      tag2Group: [1, 2],
      tag2Hidden: [],
      groupPointSelect: [],
      xScale: 50,
      yScale: 1.5,
      zScale: 4,
      distanceRange: 1,
      shortcutComment: [
        'w,s:选择上（下）个点',
        'g:选择附近的点',
        'c:清空选择',
        '1~4:设置当前选择点的tag1(1～4)',
        'l,r:设置当前选择点的tag2(1/2)',
        'q:设置当前选择点为噪点'
      ],
      pageComment: [
        '该工具用于对某种类型的三维数据进行手动快速标定',
        '初次运行Demo程序可先点击加载示例数据，后续可以点击选择文件来加载已保存的xlsx文件',
        '点击保存文件直接下载数据为xlsx文件',
        '选择数据点：点击表格中一行数据或从图中选择数据点',
        '从当前数据选择附近数据：点击选择附近的点或者按g可从当前数据点选择附近的点，用于批量编辑数据'
      ]
    }
  },
  computed: {
    timeRefFormat () {
      return this.timeRef === 0 ? '' : this.formatDate(new Date(this.timeRef * 1000))
    }
  },
  mounted () {
    this.initFigure()
    this.registerKeyEvent()
  },
  methods: {
    loadExampleData () {
      this.timeRef = ((new Date()).getTime() / 1000) | 0
      this.data = genExampleData()
      this.$nextTick(() => {
        this.updateFigure()
      })
    },
    changeLoadData (data) {
      this.timeRef = (data[0] && data[0][0]) || 0
      this.data = preprocessData(data, this.timeRef)
      this.$nextTick(() => {
        this.updateFigure()
      })
    },
    formatDate (date) {
      return formatDate(date)
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
    initFigure () {
      this.figure = this.$echarts.init(this.$refs.figure)
      this.figure.on('click', val => {
        this.indexSelect = this.data.findIndex(item => {
          return item[0] === val.data[0] && item[1] === val.data[1] && item[2] === val.data[2]
        })
        if (this.indexSelect > -1) {
          this.updateFigure()
        }
        if (val.dataIndex && val.dataIndex >= 0 && val.dataIndex < this.data.length) {
          this.indexSelect = val.dataIndex
          this.updateFigure()
        }
      })
    },
    updateFigure () {
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
          data.push([item[0], item[1], item[2], SELECT_TAG, item['tag2']])
        } else if (this.groupPointSelect.indexOf(i) > -1) {
          data.push([item[0], item[1], item[2], SELECT_TAG, item['tag2']])
        } else {
          data.push([item[0], item[1], item[2], item['tag1'], item['tag2']])
        }
      }
      this.figure.setOption(getfigureOptions(data))
    },
    toggleIndex (tag) {
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
      this.updateFigure()
    },
    selectRow (val) {
      this.indexSelect = this.data.findIndex(item => item === val)
      this.groupPointSelect = [] // 清空多选
      this.updateFigure()
    },
    clearSelection () {
      this.indexSelect = -1
      this.groupPointSelect = []
      this.updateFigure()
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
      this.updateFigure()
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
      this.updateFigure()
    },
    chooseNeighbor () {
      if (this.indexSelect < 0) {
        return
      }
      this.groupPointSelect = []
      let currentItem = this.data[this.indexSelect]
      // optimized in the future
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
      this.updateFigure()
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
      saveData(this.data, this.timeRef)
    }
  },
  components: {
    FileLoaderButton,
    ListComment
  }
}
</script>
<style lang="stylus">
  @import "~@/common/css/variable"
  .label-point
    .group-choose
      .text
        line-height: 20px
      .group-option
        .option-item
          margin: 5px 0 5px 0
          p
            line-height: 20px
    .shortcut-comment
      margin: 10px 15px 5px 15px
    .figure
      margin-top: 30px
      width: 800px
      height: 800px
    .select-row
      background-color: $color-table-row-select !important;
    .multi-select-row
      background-color: $color-table-row-select !important;
    .comment
      margin-top: 30px
</style>
