<template>
  <el-aside width="auto" class="side-menu">
    <el-menu
      active-text-color="#ffd04b"
      :collapse="isCollapse"
      class="menu-bar"
      :router="true"
      :default-active="$route.path"
      :unique-opened="true"
    >
      <div style="text-align:center;margin-top:10px">
        <i class="el-icon-menu" style="color:#fff;font-size:24px;cursor:pointer" @click="isCollapse=!isCollapse"></i>
      </div>
<!--      首页和介绍页部分待开发-->
<!--      <el-submenu index="1">-->
<!--        <template slot="title">-->
<!--          <i class="el-icon-info"></i>-->
<!--          <span slot="title">作者简介</span>-->
<!--        </template>-->
<!--        <el-menu-item-group>-->
<!--          &lt;!&ndash;<span slot="title"></span>&ndash;&gt;-->
<!--          <el-menu-item index="/introduction">个人简介</el-menu-item>-->
<!--          <el-menu-item index="/techstack">技术栈</el-menu-item>-->
<!--          <el-menu-item index="/footprint">足迹</el-menu-item>-->
<!--        </el-menu-item-group>-->
<!--      </el-submenu>-->
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span slot="title">三维案例</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/planeDeform">16点控制平面变形</el-menu-item>
          <el-menu-item index="/labelPoint">三维数据标定</el-menu-item>
          <el-menu-item index="/rubicCube">三阶魔方</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: false
    }
  }
}
</script>

<style lang="stylus">
  .side-menu {
    background: url('../assets/image/menu_bg.png');
    background-size 100% 100%
    color: #333;
    .el-menu {
      background rgba(0, 0, 0, 0)
      .el-submenu__title, .el-menu-item {
        color: #fff
      }
    }
    .menu-bar:not(.el-menu--collapse) {
      width: 200px;
    }
    .el-menu-item.is-active {
      position relative
    }
    .el-menu-item.is-active::before {
      content: ''
      position absolute
      top: 0
      left: 0
      bottom: 0
      border-left 3px solid #ffd04b
    }
    .el-submenu__title i {
      color: #eee
    }

    .el-menu-item i {
      color: #eee
    }
    .el-submenu__title:hover {
      background-color: inherit;
    }
    .el-menu-item:focus, .el-menu-item:hover {
      outline: 0;
      background-color: inherit;
    }
    .el-menu {
      border-right none
    }
  }
</style>
