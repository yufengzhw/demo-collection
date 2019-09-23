<template>
  <div class="rect-deform" ref="rectDeform">
  </div>
</template>

<script>
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Color,
  BufferGeometry,
  Mesh,
  BufferAttribute,
  RawShaderMaterial
} from 'three'
import { getMeshData } from '@/api/api'
import { fragShader, vertShader } from './shader.js'
import { colorMapJet } from './color.js'

export default {
  props: {
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
    return {
      width: 600,
      height: 600,
      translateX: 0,
      translateY: 0,
      translateZ: 0
    }
  },
  mounted () {
    this.$nextTick(() => {
      getMeshData().then(res => {
        this.resolveMesh(res)
        this.$nextTick(() => {
          this.initPic()
        })
      })
    })
  },
  methods: {
    resolveMesh (res) {
      res = JSON.parse(res)
      this.interMatrix = res.interMatrix

      const vertex = new Float32Array(res.infoVer.length)
      const indices = new Uint16Array(res.infoElem.length)
      for (let i = 0; i < res.infoVer.length; i++) {
        vertex[i] = res.infoVer[i]
      }
      for (let i = 0; i < res.infoElem.length; i++) {
        indices[i] = res.infoElem[i]
      }
      this.vertex = vertex
      this.indices = indices
    },
    initPic () {
      // 创建场景，摄像机，渲染器，设置画布背景色和尺寸
      this.scene = new Scene()
      this.camera = new PerspectiveCamera(45, this.width / this.height, 0, 1000)
      this.camera.position.set(0, 0, 1)
      this.renderer = new WebGLRenderer({
        alpha: true,
        antialias: true
      })
      this.renderer.setClearColor(new Color(0xE9EEF3))
      this.renderer.setSize(this.width, this.height)
      // 赋值顶点和网格点坐标
      this.vertices = this.vertex.slice()
      this.faces = this.indices
      // 颜色赋值
      this.colors = new Float32Array(this.vertex.length)
      for (let i = 0; i < this.vertex.length / 3; i++) {
        let color = colorMapJet(0, -1, 1)
        this.colors.set([color[0], color[1], color[2]], 3 * i)
      }
      // 创建图像
      this.geometry = new BufferGeometry()
      this.geometry.setIndex(new BufferAttribute(this.faces, 1))
      this.updateGeometry()
      // 着色器
      this.meshMaterial = new RawShaderMaterial({
        vertexShader: vertShader,
        fragmentShader: fragShader
      })
      this.object = new Mesh(this.geometry, this.meshMaterial)
      this.scene.add(this.object)
      // 挂载，渲染
      this.$refs.rectDeform.append(this.renderer.domElement)
      this.renderer.render(this.scene, this.camera)
    },
    updatePic () {
      // 更新
      this.updateInterpolation()
      this.updateGeometry()
      this.renderer.render(this.scene, this.camera)
    },
    updateInterpolation () {
      // 根据插值矩阵和value更新网格节点值
      this.vertices = this.vertex.slice()
      for (let i = 0; i < this.vertex.length / 3; i++) {
        let value = 0
        for (let j = 0; j < this.value.length; j++) {
          value += this.interMatrix[i][j] * this.value[j]
        }
        // normalized to [-1, 1]
        this.vertices[3 * i + 2] = ((value - this.disMin) / (this.disMax - this.disMin) * 2 - 1) * this.ratio

        const color = colorMapJet(value, this.disMin, this.disMax)
        this.colors.set([color[0], color[1], color[2]], 3 * i)
      }
    },
    updateGeometry () {
      // 将数据更新到webgl
      this.geometry.addAttribute('position', new BufferAttribute(this.vertices, 3))
      this.geometry.addAttribute('color', new BufferAttribute(this.colors, 3))
      this.geometry.rotateX(this.rotateX)
      this.geometry.rotateY(this.rotateY)
      this.geometry.rotateZ(this.rotateZ)
      this.geometry.scale(this.scale, this.scale, this.scale)
    },
    randomValue () {
      for (let i = 0; i < this.value.length; i++) {
        this.value[i] = Math.random() * 2 - 1
      }
    }
  }
}
</script>
