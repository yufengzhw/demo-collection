import {
  CubeGeometry,
  MeshBasicMaterial,
  Mesh,
  Vector3,
  Quaternion
} from 'three'
import { requestAnimFrame } from '@/common/js/requestAnimFrame'

function rotationAroundWorldX (obj, rad) {
  // 绕魔方x轴旋转
  const y0 = obj.position.y
  const z0 = obj.position.z
  const q = new Quaternion()
  q.setFromAxisAngle(new Vector3(1, 0, 0), rad)
  obj.quaternion.premultiply(q)
  obj.position.y = Math.cos(rad) * y0 - Math.sin(rad) * z0
  obj.position.z = Math.cos(rad) * z0 + Math.sin(rad) * y0
}

function rotationAroundWorldY (obj, rad) {
  // 绕魔方y轴旋转
  const x0 = obj.position.x
  const z0 = obj.position.z
  const q = new Quaternion()
  q.setFromAxisAngle(new Vector3(0, 1, 0), rad)
  obj.quaternion.premultiply(q)
  obj.position.x = Math.cos(rad) * x0 + Math.sin(rad) * z0
  obj.position.z = Math.cos(rad) * z0 - Math.sin(rad) * x0
}

function rotationAroundWorldZ (obj, rad) {
  // 绕魔方z轴旋转
  const x0 = obj.position.x
  const y0 = obj.position.y
  const q = new Quaternion()
  q.setFromAxisAngle(new Vector3(0, 0, 1), rad)
  obj.quaternion.premultiply(q)
  obj.position.x = Math.cos(rad) * x0 - Math.sin(rad) * y0
  obj.position.y = Math.cos(rad) * y0 + Math.sin(rad) * x0
}

class Rotation {
  constructor (cornerBlocks, edgeBlocks, centerBlock, axis, directionSign) {
    /*
    cornerBlocks: 角块，按顺时针方向排列
    edgeBlocks: 边块，按顺时针方向排列
    centerBlock: 中心块
    axis: 'x' || 'y' || 'z'
    directionSign: 1:正向，-1:逆向 (右手坐标系)
     */
    this.cornerBlocks = cornerBlocks
    this.edgeBlocks = edgeBlocks
    this.centerBlock = centerBlock
    this.axis = axis
    this.blocks = cornerBlocks.concat(edgeBlocks, [centerBlock])
    this.sign = directionSign
    this.rotationFunc =
      axis === 'x'
        ? rotationAroundWorldX
        : axis === 'y'
          ? rotationAroundWorldY
          : rotationAroundWorldZ
  }

  move (obj, rad) {
    // 转动过程中执行
    return this.rotationFunc(obj, rad * this.sign)
  }

  adjustBlockStatus (blockStatus, actionFactor) {
    // 每次转动完成后执行
    // actionFactor:  1, -1, 2
    if (actionFactor !== 1 && actionFactor !== -1 && actionFactor !== 2) {
      console.error('actionFactor must be 1, -1 or 2')
    }
    let originIndexes = this.cornerBlocks.map(block => blockStatus.indexOf(block))
    this.cornerBlocks.forEach((block, index) => {
      blockStatus[originIndexes[index]] = this.cornerBlocks[(index + actionFactor + this.cornerBlocks.length) % this.cornerBlocks.length]
    })

    originIndexes = this.edgeBlocks.map(block => blockStatus.indexOf(block))
    this.edgeBlocks.forEach((block, index) => {
      blockStatus[originIndexes[index]] = this.edgeBlocks[(index + actionFactor + this.edgeBlocks.length) % this.edgeBlocks.length]
    })
  }
}

const cornerBlocks = {
  r: ['ruf', 'rub', 'rdb', 'rdf'],
  l: ['luf', 'ldf', 'ldb', 'lub'],
  u: ['luf', 'lub', 'rub', 'ruf'],
  d: ['ldf', 'rdf', 'rdb', 'ldb'],
  f: ['luf', 'ruf', 'rdf', 'ldf'],
  b: ['rub', 'lub', 'ldb', 'rdb'],
  cr: ['uf', 'ub', 'db', 'df'],
  cu: ['lf', 'lb', 'rb', 'rf'],
  cf: ['lu', 'ru', 'rd', 'ld']
}

const edgeBlocks = {
  r: ['ru', 'rb', 'rd', 'rf'],
  l: ['lu', 'lf', 'ld', 'lb'],
  u: ['uf', 'lu', 'ub', 'ru'],
  d: ['df', 'rd', 'db', 'ld'],
  f: ['uf', 'rf', 'df', 'lf'],
  b: ['ub', 'lb', 'db', 'rb'],
  cr: ['u', 'b', 'd', 'f'],
  cu: ['f', 'l', 'b', 'r'],
  cf: ['u', 'r', 'd', 'l']
}

const RotationR = new Rotation(cornerBlocks.r, edgeBlocks.r, 'r', 'x', -1)
const RotationL = new Rotation(cornerBlocks.l, edgeBlocks.l, 'l', 'x', 1)
const RotationU = new Rotation(cornerBlocks.u, edgeBlocks.u, 'u', 'y', -1)
const RotationD = new Rotation(cornerBlocks.d, edgeBlocks.d, 'd', 'y', 1)
const RotationF = new Rotation(cornerBlocks.f, edgeBlocks.f, 'f', 'z', -1)
const RotationB = new Rotation(cornerBlocks.b, edgeBlocks.b, 'b', 'z', 1)
const RotationCR = new Rotation(cornerBlocks.cr, edgeBlocks.cr, 'c', 'x', -1) // R方向中层
const RotationCU = new Rotation(cornerBlocks.cu, edgeBlocks.cu, 'c', 'y', -1) // U方向中层
const RotationCF = new Rotation(cornerBlocks.cf, edgeBlocks.cf, 'c', 'z', -1) // F方向中层

/*
采用国际通用魔方公式记号：
R,L,U,D,F,B: 分别表示右(right),左(left),上(upper),下(down),前(front),后(back)
大写表示一层，小写表示两层(加中间层)
默认面向该面以顺时针转动90度，加'(这里用_)表示逆时针转动90度，加2表示转动180度
x,y,z: 分别以R, U, F方向整体转动，规则同上
比如：
R: 右层顺时针转动90度
D'(这里用D_): 下层逆时针转动90度
b2: 后两层转动180度
y'(这里用y_): 整体沿U方向逆时针转动90度
Rotation对象中包含以上转动的所有顺时针转动，逆时针和180度转动通过actionFactor控制
 */
const Rotations = {
  R: RotationR,
  L: RotationL,
  U: RotationU,
  D: RotationD,
  F: RotationF,
  B: RotationB,
  CR: RotationCR,
  CU: RotationCU,
  CF: RotationCF,
  r: {
    rotations: [RotationR, RotationCR],
    factors: [1, 1]
  },
  l: {
    rotations: [RotationL, RotationCR],
    factors: [1, -1]
  },
  u: {
    rotations: [RotationU, RotationCU],
    factors: [1, 1]
  },
  d: {
    rotations: [RotationD, RotationCU],
    factors: [1, -1]
  },
  f: {
    rotations: [RotationF, RotationCF],
    factors: [1, 1]
  },
  b: {
    rotations: [RotationB, RotationCF],
    factors: [1, -1]
  },
  X: {
    rotations: [RotationR, RotationCR, RotationL],
    factors: [1, 1, -1]
  },
  Y: {
    rotations: [RotationU, RotationCU, RotationD],
    factors: [1, 1, -1]
  },
  Z: {
    rotations: [RotationF, RotationCF, RotationB],
    factors: [1, 1, -1]
  }
}

export default class RubicCube {
  constructor (blockCenterDis, blockSize, actionTime) {
    this.blockCenterDis = blockCenterDis // 两个块中心间距离
    this.blockSize = blockSize // 块边长
    this.actionTime = actionTime // 每个action的默认时长
    this.blockStatus = [
      'luf', 'uf', 'ruf', 'lu', 'u', 'ru', 'lub', 'ub', 'rub',
      'lf', 'f', 'rf', 'l', 'c', 'r', 'lb', 'b', 'rb',
      'ldf', 'df', 'rdf', 'ld', 'd', 'rd', 'ldb', 'db', 'rdb'
    ] // 初始状态
    this.cube = this.initCube()
    this.rotating = false
    this.actions = []
    this.registerActions()
  }

  initCube () {
    // 初始化，创建魔方几何体和网格
    const group = new Mesh()
    // 标准配色：上白下黄左绿右蓝前红后橙
    const meshFace = {
      down: new MeshBasicMaterial({ color: 0xfffa54 }), // yellow
      upper: new MeshBasicMaterial({ color: 0xffffff }), // white
      back: new MeshBasicMaterial({ color: 0xe76a2c }), // orange
      front: new MeshBasicMaterial({ color: 0x861c11 }), // red
      right: new MeshBasicMaterial({ color: 0x002cf5 }), // blue
      left: new MeshBasicMaterial({ color: 0x43912a }), // green
      inside: new MeshBasicMaterial({ color: 0xcccccc }) // gray
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          const index = i * 9 + j * 3 + k
          const status = this.blockStatus[index]
          const cubeGeom = new CubeGeometry(this.blockSize, this.blockSize, this.blockSize)
          const mats = []
          mats.push(status.includes('r') ? meshFace.right : meshFace.inside)
          mats.push(status.includes('l') ? meshFace.left : meshFace.inside)
          mats.push(status.includes('u') ? meshFace.upper : meshFace.inside)
          mats.push(status.includes('d') ? meshFace.down : meshFace.inside)
          mats.push(status.includes('f') ? meshFace.front : meshFace.inside)
          mats.push(status.includes('b') ? meshFace.back : meshFace.inside)
          const cube = new Mesh(cubeGeom, mats)
          cube.translateX((k % 3 - 1) * this.blockCenterDis)
          cube.translateY((1 - i % 3) * this.blockCenterDis)
          cube.translateZ((1 - j % 3) * this.blockCenterDis)
          group.add(cube)
        }
      }
    }
    return group
  }

  bindScene (scene) {
    scene.add(this.cube)
  }

  unbindScene (scene) {
    scene.remove(this.cube)
  }

  basicMove (rotation, actionFactor, callback, actionTime = this.actionTime, newAction = true) {
    // 执行一次action
    // rotation: class Rotation
    // actionFactor: 1, -1, 2分别对应顺时针90度，逆时针90度，180度
    // rotation: array(Rotation) or Rotation
    if (rotation instanceof Rotation) {
      rotation = [rotation]
      actionFactor = [actionFactor]
    }
    if (newAction) {
      this.actions.push({
        rotation,
        actionFactor,
        callback,
        actionTime
      })
    }
    if (this.rotating) {
      return
    }
    const that = this
    this.rotating = true
    const startTime = Date.now()
    let lastTime = startTime

    // search the blocks to rotate
    const rotateBlocks = new Array(rotation.length).fill(null).map(() => [])
    this.blockStatus.forEach((block, index) => {
      rotation.forEach((r, ind) => {
        if (r.blocks.includes(block)) {
          rotateBlocks[ind].push(this.cube.children[index])
        }
      })
    })

    function render () {
      if (lastTime >= startTime + actionTime) {
        // 执行完毕，改变魔方状态
        rotation.forEach((r, ind) => {
          r.adjustBlockStatus(that.blockStatus, actionFactor[ind])
        })
        that.rotating = false
        that.actions.splice(0, 1)
        if (that.actions.length > 0) {
          // 执行队列中后续action
          let { rotation, actionFactor, callback, actionTime } = that.actions[0]
          that.basicMove(rotation, actionFactor, callback, actionTime, false)
        }
        return
      }
      let nowTime = Date.now()
      if (nowTime >= startTime + actionTime) {
        nowTime = startTime + actionTime
      }

      rotateBlocks.forEach((blocks, ind) => {
        const angle = Math.PI / 2 * (nowTime - lastTime) / actionTime * actionFactor[ind]
        blocks.forEach(block => {
          rotation[ind].move(block, angle)
        })
      })
      lastTime = nowTime
      callback()
      requestAnimFrame(render)
    }

    render()
  }

  rotate (axis, angle) {
    this.cube.rotateOnWorldAxis(axis, angle)
  }

  registerActions () {
    const that = this
    ;['R', 'L', 'U', 'D', 'F', 'B'].forEach(key => {
      this[`move${key}`] = function (callback, actionTime = that.actionTime) {
        that.basicMove(Rotations[key], 1, callback, actionTime)
      }
      this[`move${key}_`] = function (callback, actionTime = that.actionTime) {
        that.basicMove(Rotations[key], -1, callback, actionTime)
      }
      this[`move${key}2`] = function (callback, actionTime = that.actionTime) {
        that.basicMove(Rotations[key], 2, callback, actionTime)
      }
    })
    ;['r', 'l', 'u', 'd', 'f', 'b', 'X', 'Y', 'Z'].forEach(key => {
      this[`move${key}`] = function (callback, actionTime = that.actionTime) {
        that.basicMove(
          Rotations[key].rotations,
          Rotations[key].factors,
          callback,
          actionTime
        )
      }
      this[`move${key}_`] = function (callback, actionTime = that.actionTime) {
        that.basicMove(
          Rotations[key].rotations,
          Rotations[key].factors.map(factor => -1 * factor),
          callback,
          actionTime
        )
      }
      this[`move${key}2`] = function (callback, actionTime = that.actionTime) {
        that.basicMove(
          Rotations[key].rotations,
          Rotations[key].factors.map(factor => 2 * factor),
          callback,
          actionTime
        )
      }
    })
  }
}
