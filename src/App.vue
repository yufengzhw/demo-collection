<template>
  <div id="app">
    <el-container style="height: 100%;">
      <el-header class="top-menu" height="60">
        <top-menu></top-menu>
      </el-header>
      <el-container style="height: 100%;">
        <side-menu></side-menu>
        <el-main style="height: 100%">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import '../public/css/reset.css'
import topMenu from './layout/nav.vue'
import sideMenu from './layout/menu.vue'

export default {
  name: 'App',
  components: {
    topMenu,
    sideMenu
  }
}
</script>

<style lang="stylus">
  html, body, #app {
    height: 100%;
  }

  #app {
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-size: 14px;
  }

  .top-menu {
    height 60px
    background-color: #545c64;
    background: url('./assets/image/top_bg.png');
    background-size 100%;
    color: #333;
    padding 0;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }
</style>
