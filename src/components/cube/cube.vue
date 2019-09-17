<template>
  <div class="cube" ref="cube"></div>
</template>

<script>
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  CubeGeometry,
  MeshBasicMaterial,
  Mesh,
  AmbientLight,
  SpotLight,
  PlaneGeometry,
  MeshLambertMaterial,
  MeshPhongMaterial,
  MeshFaceMaterial,
  Object3D,
  Vector3
} from 'three'

export default {
  name: 'cube',
  data () {
    return {
      width: 600,
      height: 600,
      blockStatus: [
        'ufl', 'uf', 'urf', 'ul', 'u', 'ur', 'ulb', 'ub', 'ubr',
        'fl', 'f', 'fr', 'l', '', 'r', 'lb', 'b', 'rb',
        'fdl', 'fd', 'frd', 'ld', 'd', 'rd', 'ldb', 'bd', 'rbd'
      ]
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.initScene()
    })
  },
  methods: {
    initScene () {
      // 创建场景，摄像机，渲染器，设置画布背景色和尺寸
      this.scene = new Scene()
      this.camera = new PerspectiveCamera(45, this.width / this.height, 1, 1000)
      this.camera.position.set(0, 0, 25)
      this.renderer = new WebGLRenderer()
      this.renderer.setClearColor('#ffffff')
      this.renderer.setSize(this.width, this.height)
      this.$refs.cube.append(this.renderer.domElement)

      let geometry = new CubeGeometry(2, 2, 2)// 创建一个立方体
      let material = new MeshLambertMaterial({ color: 0xff0000 })// 填充的材质
      // let cube = new Mesh(geometry, material)// 网格绘制
      let cube = this.initCube()

      this.light = this.getSpotLight()
      this.scene.add(this.light)
      this.scene.add(cube)// 场景添加网格
      cube.rotation.x += 0.3
      cube.rotation.y -= 0.3
      this.renderer.render(this.scene, this.camera)
    },
    getSpotLight () {
      let pointColor = '#ffffff'
      let spotLight = new SpotLight(pointColor)
      spotLight.position.set(0, 5, 20)
      let target = new Object3D()
      spotLight.target = target
      return spotLight
    },
    initCube () {
      let group = new Mesh()
      let mats = []
      let meshFace = {
        yellow: new MeshBasicMaterial({ color: 0xfffa54 }),
        white: new MeshBasicMaterial({ color: 0xffffff }),
        orange: new MeshBasicMaterial({ color: 0xe76a2c }),
        red: new MeshBasicMaterial({ color: 0x861c11 }),
        blue: new MeshBasicMaterial({ color: 0x002cf5 }),
        green: new MeshBasicMaterial({ color: 0x432d2a }),
        inside: new MeshBasicMaterial({ color: 0xcccccc }) // gray
      }
      mats.push(new MeshBasicMaterial({ color: 0xfffa54 }))
      mats.push(new MeshBasicMaterial({ color: 0xffffff }))
      mats.push(new MeshBasicMaterial({ color: 0xe76a2c }))
      mats.push(new MeshBasicMaterial({ color: 0x861c11 }))
      mats.push(new MeshBasicMaterial({ color: 0x432d2a }))
      mats.push(new MeshBasicMaterial({ color: 0x002cf5 }))
      let faceMaterial = new MeshFaceMaterial(mats)
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          for (let k = 0; k < 3; k++) {
            let index = i * 9 + j * 3 + k
            let cubeGeom = new CubeGeometry(2.8, 2.8, 2.8)
            // let mats = []
            // let status = this.blockStatus[index]
            let cube = new Mesh(cubeGeom, faceMaterial)
            cube.translateX(k % 3 * 3 - 3)
            cube.translateY(3 - i % 3 * 3)
            cube.translateZ(3 - j % 3 * 3)
            // cube.translate(x * 3 - 3, y * 3, z * 3 - 3)
            // cube.position = new Vector3(x * 3 - 3, y * 3, z * 3 - 3)
            group.add(cube)
          }
        }
      }
      return group
    }
  }
}
</script>

<style scoped lang="stylus">
  .cube
    width: 100%
    height: 100%
</style>
