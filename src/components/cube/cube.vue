<template>
  <div class="cube"
       ref="cube"
       @mousedown.prevent.stop="mouseDown"
       @mousemove.prevent.stop="mouseMove"
       @mouseup.prevent.stop="mouseUp"></div>
</template>

<script>
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AmbientLight,
  SpotLight,
  Object3D,
  Vector3
} from 'three'
import RubicCube from './cube.js'

export default {
  name: 'cube',
  data () {
    return {
      width: 600,
      height: 600,
      moveTime: 1000,
      updating: false,
      dragging: false,
      moving: false,
      lastX: -1,
      lastY: -1
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initScene()
    })
    this.registerKeyEvents()
    this.registerMove()
  },
  methods: {
    registerKeyEvents () {
      window.document.onkeydown = event => {
        if (['KeyR', 'KeyL', 'KeyF', 'KeyB', 'KeyU', 'KeyD'].includes(event.code)) {
          this.move(event.code.slice(-1).toLowerCase(), event.shiftKey)
        }
      }
    },
    registerMove () {
      ['R', 'L', 'U', 'D', 'F', 'B'].forEach(key => {
        this[`move${key}`] = reverse => {
          reverse
            ? this.rubicCube[`move${key}_`](this.updateView, requestAnimationFrame, this.moveTime)
            : this.rubicCube[`move${key}`](this.updateView, requestAnimationFrame, this.moveTime)
        }
      })
    },
    move (tag, reverse) {
      this[`move${tag.toUpperCase()}`](reverse)
    },
    initScene () {
      // 创建场景，摄像机，渲染器，设置画布背景色和尺寸
      this.scene = new Scene()
      this.camera = new PerspectiveCamera(45, this.width / this.height, 1, 1000)
      this.camera.position.set(0, 0, 25)
      this.renderer = new WebGLRenderer()
      this.renderer.setClearColor('#E9EEF3')
      this.renderer.setSize(this.width, this.height)
      this.$refs.cube.append(this.renderer.domElement)

      // 创建魔方
      this.rubicCube = new RubicCube(3, 2.8, this.moveTime)
      this.rubicCube.bindScene(this.scene)

      // 添加灯光效果
      this.ambientLight = new AmbientLight('#ffffff')
      this.spotLight = this.getSpotLight()
      this.scene.add(this.ambientLight)
      this.scene.add(this.spotLight)

      this.rubicCube.rotate(new Vector3(1, 0, 0), 0.3)
      this.rubicCube.rotate(new Vector3(0, 1, 0), -0.3)
      this.updateView()
    },
    getSpotLight () {
      let pointColor = '#ffffff'
      let spotLight = new SpotLight(pointColor)
      spotLight.position.set(0, 5, 20)
      let target = new Object3D()
      spotLight.target = target
      return spotLight
    },
    updateView () {
      if (this.updating) {
        return
      }
      this.updating = true
      this.renderer.render(this.scene, this.camera)
      this.$nextTick(() => {
        this.updating = false
      })
    },
    mouseDown (ev) {
      const x = ev.clientX
      const y = ev.clientY
      const rect = ev.target.getBoundingClientRect()
      if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
        this.lastX = x
        this.lastY = y
        this.dragging = true
      }
    },
    mouseMove (ev) {
      const x = ev.clientX
      const y = ev.clientY
      if (ev.buttons !== 1) {
        return
      }
      const factor = 100 / 60000
      const dx = factor * (x - this.lastX)
      const dy = factor * (y - this.lastY)
      this.lastX = x
      this.lastY = y
      this.rubicCube.rotate(new Vector3(1, 0, 0), dy)
      this.rubicCube.rotate(new Vector3(0, 1, 0), dx)
      this.updateView()
    },
    mouseUp () {
      if (this.dragging) {
        this.updateView()
      }
      this.dragging = false
    }
  }
}
</script>

<style scoped lang="stylus">
  .cube
    width: 100%
    height: 100%
</style>
