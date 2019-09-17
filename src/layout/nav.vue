<template>
    <div class="header-wrapper">
      <div class="options">
        <span>
        <img src="../assets/image/role.png" alt="" class="portrait">
        </span>
      </div>
    </div>
</template>

<script>
export default {
}
</script>

<style lang="stylus" scoped>
.header-wrapper{
  display flex
  .options {
    flex:1
    text-align right
    vertical-align middle
    .portrait {
      margin 6px 40px 0 0
      width: 50px;
      height 50px;
      border-radius 50%
    }
  }
}
</style>
