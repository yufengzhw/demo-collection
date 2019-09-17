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
          开发中...
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
  font-size: 36px
</style>
