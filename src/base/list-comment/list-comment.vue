<template>
  <div class="list-comment">
    <p class="title">{{title}}</p>
    <ul class="list">
      <li v-for="(item, index) in data" :key="index" class="list-item">
        <p class="text">{{isNumberBullet ? index + '.' : bullet}}{{item}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'list-comment',
  props: {
    title: String,
    data: Array,
    isNumberBullet: {
      type: Boolean,
      default: false
    },
    bullet: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="stylus">
@import "~@/common/css/variable"
.list-comment
  .title
    font-size: $font-size-l
    font-weight: 500
  .list
    margin-top: 10px
    .list-item
      .text
        line-height: 20px
        font-size: $font-size-m
        text-indent: 1em
</style>
