<template>
  <div class="rect-deform" ref="rectDeform">
  </div>
</template>

<script>
import {
  Scene,
  // OrthographicCamera,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  BufferGeometry,
  Mesh,
  BufferAttribute,
  RawShaderMaterial
} from 'three'
import { infoVer, infoElem, interMatrix } from './basemesh.js'
import { fragShader, vertShader } from './shader.js'
import { colorMapJet } from './color.js'

export default {
  props: {
    id: [Number, String],
    value: {
      type: Array,
      default: () => Array(16).fill(0)
    },
    disMax: {
      type: Number,
      default: 1
    },
    disMin: {
      type: Number,
      default: -1
    },
    ratio: {
      type: Number,
      default: 0.15
    },
    rotateX: {
      type: Number,
      default: 30
    },
    rotateY: {
      type: Number,
      default: 0
    },
    rotateZ: {
      type: Number,
      default: -30
    },
    scale: {
      type: Number,
      default: 0.8
    }
  },
  data () {
    let vertex = new Float32Array(infoVer.length)
    let indices = new Uint16Array(infoElem.length)
    for (let i = 0; i < infoVer.length; i++) {
      vertex[i] = infoVer[i]
    }
    for (let i = 0; i < infoElem.length; i++) {
      indices[i] = infoElem[i]
    }
    return {
      vertex,
      indices,
      width: 600,
      height: 600,
      translateX: 0,
      translateY: 0,
      translateZ: 0
      //        rotateX: 30,
      //        rotateY: 0,
      //        rotateZ: -30,
      //        scale: 0.8,
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initPic()
    })
    //      setTimeout(() => {
    //        this._$randomValue()
    //        this._$updatePic()
    //      }, 200)
  },
  methods: {
    initPic () {
      // 创建场景，摄像机，渲染器，设置画布背景色和尺寸
      console.log(this.vertex, this.indices)
      this.scene = new Scene()
      this.camera = new PerspectiveCamera(45, this.width / this.height, 0, 1000)
      this.camera.position.set(0, 0, 1)
      this.renderer = new WebGLRenderer({
        alpha: true,
        antialias: true
      })
      //        this.renderer.setClearColor(new Color(0xD8D8D8))
      this.renderer.setClearColor(new Color(0xE9EEF3))
      this.renderer.setSize(this.width, this.height)
      // 赋值顶点和网格点坐标
      this.vertices = this.vertex.slice()
      this.faces = this.indices
      // 颜色赋值
      this.colors = new Float32Array(infoVer.length)
      for (let i = 0; i < infoVer.length / 3; i++) {
        let color = colorMapJet(0, -1, 1)
        this.colors.set([color[0], color[1], color[2]], 3 * i)
      }
      // console.log('color', this.colors)
      // 创建图像
      this.geometry = new BufferGeometry()
      this.geometry.setIndex(new BufferAttribute(this.faces, 1))
      this.geometry.addAttribute('position', new BufferAttribute(this.vertices, 3))
      this.geometry.addAttribute('color', new BufferAttribute(this.colors, 3))
      this.geometry.rotateX(this.rotateX)
      this.geometry.rotateY(this.rotateY)
      this.geometry.rotateZ(this.rotateZ)
      this.geometry.scale(this.scale, this.scale, this.scale)
      //        this.geometry.rotateZ(-30)
      //        this.geometry.rotateX(30)
      //        this.geometry.scale(0.8, 0.8, 0.8)
      // console.log('vertices', this.vertices)
      // console.log('vertex', this.vertex)
      this.meshMaterial = new RawShaderMaterial({
        vertexShader: vertShader,
        fragmentShader: fragShader
      })
      this.object = new Mesh(this.geometry, this.meshMaterial)
      this.scene.add(this.object)
      this.$refs.rectDeform.append(this.renderer.domElement)
      this.renderer.render(this.scene, this.camera)
    },
    updatePic () {
      console.log('value !!!', this.value)
      this.vertices = this.vertex.slice()
      for (let i = 0; i < infoVer.length / 3; i++) {
        let value = 0
        for (let j = 0; j < 16; j++) {
          value += interMatrix[i][j] * this.value[j]
        }
        let normalValue = ((value - this.disMin) / (this.disMax - this.disMin) * 2 - 1) * this.ratio
        //          console.log('normalValue', normalValue)
        // z坐标变化
        //          this.vertices.set([normalValue], 3 * i + 2)
        this.vertices[3 * i + 2] = normalValue

        let color = colorMapJet(value, this.disMin, this.disMax)
        this.colors.set([color[0], color[1], color[2]], 3 * i)
      }
      console.log(this.colors)
      console.log('vertices', this.vertices)
      this.geometry.addAttribute('position', new BufferAttribute(this.vertices, 3))
      this.geometry.addAttribute('color', new BufferAttribute(this.colors, 3))
      this.geometry.rotateX(this.rotateX)
      this.geometry.rotateY(this.rotateY)
      this.geometry.rotateZ(this.rotateZ)
      this.geometry.scale(this.scale, this.scale, this.scale)
      //        this.geometry.translateX(this.translateX)
      //        this.geometry.translateY(this.translateY)
      //        this.geometry.translateZ(this.translateZ)
      this.renderer.render(this.scene, this.camera)
    },
    randomValue () {
      for (let i = 0; i < 16; i++) {
        this.value[i] = Math.random() * 2 - 1
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
</style>
