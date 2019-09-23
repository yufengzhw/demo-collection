<template>
  <div class="rubic-cube">
    <el-row>
      <el-col :span="12">
        <div class="cube-wrapper">
          <cube></cube>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="comment" v-once>
          <list-comment title="操作说明:" :data="comment"></list-comment>
          <div class="more">
            更多功能开发中。。。
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ListComment from '@/base/list-comment/list-comment.vue'
import Cube from '@/components/cube/cube.vue'
export default {
  name: 'rubic-cube',
  data () {
    return {
      comment: [
        'R: 右层顺时针转动90度; shift+R: 右层逆时针转动90度',
        'ctrl+R: 右两层顺时针转动90度; ctrl+shift+R: 右两层逆时针转动90度',
        'L: 左层顺时针转动90度; shift+L: 左层逆时针转动90度',
        'ctrl+L: 左两层顺时针转动90度; ctrl+shift+L: 左两层逆时针转动90度',
        'U: 上层顺时针转动90度; shift+U: 上层逆时针转动90度',
        'ctrl+U: 上两层顺时针转动90度; ctrl+shift+U: 上两层逆时针转动90度',
        'D: 下层顺时针转动90度; shift+D: 下层逆时针转动90度',
        'ctrl+D: 下两层顺时针转动90度; ctrl+shift+D: 下两层逆时针转动90度',
        'F: 前层顺时针转动90度; shift+F: 前层逆时针转动90度',
        'ctrl+F: 前两层顺时针转动90度; ctrl+shift+F: 前两层逆时针转动90度',
        'B: 后层顺时针转动90度; shift+B: 后层逆时针转动90度',
        'ctrl+B: 后两层顺时针转动90度; ctrl+shift+B: 后两层逆时针转动90度',
        'X: 整体以R的方向顺时针转动90度; shift+X: 整体以R的方向逆时针转动90度',
        'Y: 整体以U的方向顺时针转动90度; shift+Y: 整体以U的方向逆时针转动90度',
        'Z: 整体以F的方向顺时针转动90度; shift+Z: 整体以F的方向逆时针转动90度',
        '鼠标拖拽：整体三维旋转'
      ]
    }
  },
  components: {
    ListComment,
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
  .more
    margin: 100px auto
    font-size: 36px
    font-weight: 500
</style>
