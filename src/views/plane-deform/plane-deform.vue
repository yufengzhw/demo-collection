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
    <div class="confirm">
      <div>
        <el-button type="primary" @class="reset-button" @click.stop.prevent="reset">重置视图</el-button>
        <el-button type="primary" @class="random-button" @click.stop.prevent="randomRefresh">随机刷新</el-button>
        <el-button type="primary" @class="clear-button" @click.stop.prevent="clear">清除</el-button>
        <el-button type="primary" @class="animation-button" @click.stop.prevent="controlAnimation1">
          {{animationTitle(animation1)}}
        </el-button>
        <el-button type="primary" @class="animation-button" @click.stop.prevent="controlAnimation2">
          {{animationTitle(animation2)}}
        </el-button>
      </div>
    </div>
    <div class="comment">
      <p class="title">说明:</p>
      <ul>
        <li>* 该案例通过16个离散点操作平面变形</li>
        <li>* 通过点击随机刷新或者拖拽各点数值可看到平面光滑变形效果变形，点击清除可将各点数值清零</li>
        <li>* 鼠标左键拖拽视图可进行三维旋转，点击缩放按钮可进行视图缩放，点击重置视图可将视图重置</li>
        <li>* 预设两个动画，点击动画1或动画2可根据当前各点数值生成预设动画效果，点击停止动画可停止播放动画</li>
      </ul>
    </div>
  </div>
</template>

<script>
import rectDeform from '@/components/rectdeform/rectdeform.vue'

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
      }
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
      if (this.animation1.run === false && this.animationStatus === false) {
        this.animation1.staticValue = this.drawValue.slice()
        this.animation1.run = true
        this.animation1.flag = setInterval(() => {
          this.render1()
        }, 50)
        console.log(this.animation1.staticValue)
      } else if (this.animation1.run === true) {
        clearInterval(this.animation1.flag)
        this.animation1.flag = null
        this.animation1.run = false
      }
    },
    render1 () {
      let time = Date.now()
      let period = 2000
      for (let i = 0; i < 16; i++) {
        this.data[i].value = this.animation1.staticValue[i] * Math.sin(2 * Math.PI / period * time) * 50 + 50
      }
      this.refresh()
    },
    controlAnimation2 () {
      if (this.animation2.run === false && this.animationStatus === false) {
        this.animation2.staticValue = this.drawValue.slice()
        for (let i = 0; i < 16; i++) {
          this.animation2.theta[i] = Math.asin(this.animation2.staticValue[i])
        }
        this.animation2.run = true
        this.animation2.flag = setInterval(() => {
          this.render2()
        }, 50)
        console.log(this.animation2.staticValue)
      } else if (this.animation2.run === true) {
        clearInterval(this.animation2.flag)
        this.animation2.flag = null
        this.animation2.run = false
      }
    },
    render2 () {
      let time = Date.now()
      let period = 2000
      for (let i = 0; i < 16; i++) {
        this.data[i].value = Math.sin(2 * Math.PI / period * time + this.animation2.theta[i]) * 50 + 50
      }
      this.refresh()
    },
    mouseDown (ev) {
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
      let x = ev.clientX; let y = ev.clientY
      if (ev.buttons === 1) {
        // 鼠标左键
        if (this.dragging) {
          let factor = 100 / 60000
          let dx = factor * (x - this.lastX)
          let dy = factor * (y - this.lastY)
          this.rotateX = this.rotateX + dy
          this.rotateY = this.rotateY + dx
          //            currentAngle[0] = currentAngle[0] + dy;
          //            currentAngle[1] = currentAngle[1] + dx;
        }
        this.lastX = x
        this.lastY = y
      } else if (ev.buttons === 2) {
        // 鼠标右键
        if (this.dragging) {
          let factor = 1
          let dx = factor * (x - this.lastX)
          let dy = factor * (y - this.lastY)
          this.translateX = this.translateX + dx
          this.translateY = this.translateY - dy
          //            currentTranslate[0] = currentTranslate[0] + dx;
          //            currentTranslate[1] = currentTranslate[1] - dy;
        }
        this.lastX = x
        this.lastY = y
      } else if (ev.buttons === 4) {
        // 鼠标中键
        if (this.dragging) {
          let factor = 0.01
          let dy = factor * (y - this.lastY)
          this.scaleRatio = this.scaleRatio * Math.exp(-dy)
        }
        this.lastX = x
        this.lastY = y
      }
      this.refresh()
    },
    mouseUp (ev) {
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
      for (let i = 0; i < 16; i++) {
        this.data[i].value = Math.random() * 100
      }
    },
    reset () {
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
      let key = `rotate${axis === 'x' ? 'X' : axis === 'y' ? 'Y' : 'Z'}`
      let incre = 1 / 180 * Math.PI
      this[key] += (add ? incre : -incre)
      console.log(key, this[key])
      this.refresh()
    },
    scale (add) {
      let factor = 0.02
      this.scaleRatio = this.scaleRatio * Math.exp((add ? factor : -factor))
      this.refresh()
    }
  },
  components: {
    rectDeform
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
      .title
        font-weight: 500
      ul
        margin-top: 10px
        line-height: 20px
        text-indent: 1em
</style>
