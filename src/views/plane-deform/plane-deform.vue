<template>
  <div class="plane-deform">
    <el-button-group class="scale-button">
      <el-button size="mini" type="primary" icon="el-icon-arrow-left" @click.stop.prevent="scale(false)">缩放-</el-button>
      <el-button size="mini" type="primary" @click.stop.prevent="scale(true)">缩放+<i
        class="el-icon-arrow-right el-icon--right"></i></el-button>
    </el-button-group>
    <div class="upper">
      <div class="canvas-wrapper" @mousedown.prevent.stop="mouseDown" @mousemove.prevent.stop="mouseMove"
           @mouseup.prevent.stop="mouseUp">
        <rect-deform class="rect-deform"
                     ref="rectDeform"
                     :value="drawValue"
                     :rotateX="rotateX"
                     :rotateY="rotateY"
                     :rotateZ="rotateZ"
                     :scale="scaleRatio"></rect-deform>
      </div>
      <div class="operation">
        <ul>
          <li v-for="(item, index) in data" :key="index">
            <div class="block">
              <el-slider v-model="item.value" :format-tooltip="formatTooltip" @change="refresh"></el-slider>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="btn-group">
      <el-button type="primary" @click.stop.prevent="reset">重置视图</el-button>
      <el-button type="primary" @click.stop.prevent="randomRefresh">随机刷新</el-button>
      <el-button type="primary" @click.stop.prevent="clear">清除</el-button>
      <el-button type="primary" @click.stop.prevent="controlAnimation1">
        {{animationTitle(animation1)}}
      </el-button>
      <el-button type="primary" @click.stop.prevent="controlAnimation2">
        {{animationTitle(animation2)}}
      </el-button>
    </div>
    <div class="comment">
      <list-comment title="说明:" :data="comment" bullet="*"></list-comment>
    </div>
  </div>
</template>

<script>
import RectDeform from '@/components/rect-deform/rect-deform.vue'
import ListComment from '@/base/list-comment/list-comment'

export default {
  data () {
    let data = Array(16).fill({})
    for (let i = 0; i < 16; i++) {
      data[i] = {
        index: i,
        title: `点${i + 1}`,
        value: 50
      }
    }
    return {
      data,
      refreshing: false,
      rotateX: -0.89,
      rotateY: -1.2,
      rotateZ: -0.57,
      scaleRatio: 0.8,
      translateX: 0,
      translateY: 0,
      dragging: false,
      draggingSpeed: 100 / 60000,
      lastX: -1,
      lastY: -1,
      animation1: {
        name: '动画1',
        run: false,
        flag: null,
        staticValue: Array(16).fill(0)
      },
      animation2: {
        name: '动画2',
        run: false,
        flag: null,
        staticValue: Array(16).fill(0),
        theta: Array(16).fill(0)
      },
      comment: [
        '该案例通过16个离散点操作平面变形',
        '通过点击随机刷新或者拖拽各点数值可看到平面光滑变形效果变形，点击清除可将各点数值清零',
        '鼠标左键拖拽视图可进行三维旋转，点击缩放按钮可进行视图缩放，点击重置视图可将视图重置',
        '预设两个动画，点击动画1或动画2可根据当前各点数值生成预设动画效果，点击停止动画可停止播放动画'
      ]
    }
  },
  computed: {
    drawValue () {
      return this.data.map(item => (item.value / 50 - 1))
    },
    animationStatus () {
      return this.animation1.run || this.animation2.run
    }
  },
  methods: {
    animationTitle (obj) {
      return obj.run ? '停止动画' : obj.name
    },
    controlAnimation1 () {
      if (!this.animation1.run && !this.animationStatus) {
        this.animation1.staticValue = this.drawValue.slice()
        this.animation1.run = true
        this.animation1.flag = setInterval(() => {
          this.render1()
        }, 50)
      } else if (this.animation1.run === true) {
        clearInterval(this.animation1.flag)
        this.animation1.flag = null
        this.animation1.run = false
      }
    },
    render1 () {
      let time = Date.now()
      let period = 2000
      this.animation1.staticValue.forEach((val, ind) => {
        this.data[ind].value = val * Math.sin(2 * Math.PI / period * time) * 50 + 50
      })
      this.refresh()
    },
    controlAnimation2 () {
      if (!this.animation2.run && !this.animationStatus) {
        this.animation2.staticValue = this.drawValue.slice()
        this.animation2.staticValue.forEach((val, ind) => {
          this.animation2.theta[ind] = Math.asin(val)
        })
        this.animation2.run = true
        this.animation2.flag = setInterval(() => {
          this.render2()
        }, 50)
      } else if (this.animation2.run === true) {
        clearInterval(this.animation2.flag)
        this.animation2.flag = null
        this.animation2.run = false
      }
    },
    render2 () {
      const time = Date.now()
      const period = 2000
      this.animation2.theta.forEach((val, ind) => {
        this.data[ind].value = Math.sin(2 * Math.PI / period * time + val) * 50 + 50
      })
      this.refresh()
    },
    mouseDown (ev) {
      // only for left button
      if (ev.buttons !== 1) {
        return
      }
      let x = ev.clientX; let y = ev.clientY
      // Start dragging if a mouse is in <canvas>
      let rect = ev.target.getBoundingClientRect()
      if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
        this.lastX = x
        this.lastY = y
        this.dragging = true
      }
    },
    mouseMove (ev) {
      // only for left button
      if (ev.buttons !== 1) {
        return
      }
      let x = ev.clientX; let y = ev.clientY
      if (this.dragging) {
        let factor = this.draggingSpeed
        let dx = factor * (x - this.lastX)
        let dy = factor * (y - this.lastY)
        this.rotateX = this.rotateX + dy
        this.rotateY = this.rotateY + dx
      }
      this.lastX = x
      this.lastY = y
      this.refresh()
    },
    mouseUp (ev) {
      // only for left button
      if (ev.buttons !== 1) {
        return
      }
      if (this.dragging) {
        this.refresh()
      }
      this.dragging = false
    },
    randomRefresh () {
      if (this.animationStatus) {
        return
      }
      this.randomValue()
      this.$nextTick(() => {
        this.$refs.rectDeform.updatePic()
      })
    },
    refresh () {
      if (this.refreshing) {
        return
      }
      this.refreshing = true
      this.$nextTick(() => {
        this.$refs.rectDeform.updatePic()
        this.refreshing = false
      })
    },
    formatTooltip (val) {
      return (val / 50 - 1).toFixed(2)
    },
    randomValue () {
      this.data.forEach(val => {
        val.value = Math.random() * 100
      })
    },
    reset () {
      // reset view
      this.rotateX = -0.89
      this.rotateY = -1.2
      this.rotateZ = -0.57
      this.scaleRatio = 0.8
      this.translateX = 0
      this.translateY = 0
      this.$nextTick(() => {
        this.$refs.rectDeform.updatePic()
      })
    },
    clear () {
      if (this.animationStatus) {
        return
      }
      for (let i = 0; i < 16; i++) {
        this.data[i].value = 50
      }
      this.$nextTick(() => {
        this.$refs.rectDeform.updatePic()
      })
    },
    rotate (axis, add) {
      const key = `rotate${axis === 'x' ? 'X' : axis === 'y' ? 'Y' : 'Z'}`
      const incre = 1 / 180 * Math.PI
      this[key] += (add ? incre : -incre)
      this.refresh()
    },
    scale (add) {
      const factor = 0.02
      this.scaleRatio = this.scaleRatio * Math.exp((add ? factor : -factor))
      this.refresh()
    }
  },
  components: {
    RectDeform,
    ListComment
  }
}
</script>

<style scoped lang="stylus">
  .plane-deform
    .upper
      display: flex
      .canvas-wrapper
        flex: 1
        margin: 10px 20px 10px 10px
        width: 600px
        height: 600px
        .rect-deform
          width: 100%
          height: 100%
      .operation
        flex: 1
    .comment
      margin-top: 30px
</style>
