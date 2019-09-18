<template>
  <div class="rubic-cube">
    <el-row>
      <el-col :span="12">
        <div class="cube-wrapper">
          <cube></cube>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="comment">
          <p class="title">操作说明:</p>
          <ul>
            <li>R: 右层顺时针转动90度 &nbsp; shift+R: 右层逆时针转动90度</li>
            <li>L: 左层顺时针转动90度 &nbsp; shift+L: 左层逆时针转动90度</li>
            <li>U: 上层顺时针转动90度 &nbsp; shift+U: 上层逆时针转动90度</li>
            <li>D: 下层顺时针转动90度 &nbsp; shift+D: 下层逆时针转动90度</li>
            <li>F: 前层顺时针转动90度 &nbsp; shift+F: 前层逆时针转动90度</li>
            <li>B: 后层顺时针转动90度 &nbsp; shift+B: 后层逆时针转动90度</li>
            <li>鼠标拖拽：整体三维旋转</li>
          </ul>
          <div class="more">
            更多功能开发中。。。
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Cube from '@/components/cube/cube.vue'
export default {
  name: 'rubic-cube',
  components: {
    Cube
  }
}
</script>

<style scoped lang="stylus">
.cube-wrapper
  width: 600px
  height: 600px
.comment
  margin: 100px auto 0
  .title
    font-size: 22px
    font-weight: 400
  ul
    margin-top: 10px
    line-height: 30px
    font-size: 18px
    text-indent: 1em
  .more
    margin: 100px auto
    font-size: 36px
    font-weight: 500
</style>
