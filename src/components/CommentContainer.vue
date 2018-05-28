<template>
  <div class="comment-container" :class="`level-${level}`">
    <div class="comment-container__left avatar"><slot name="left"></slot></div>
    <div class="comment-container__middle"><slot name="middle"></slot></div>
    <div class="comment-container__right"><slot name="right"></slot></div>
  </div>
</template>
<script>
  export default {
    name: 'CommentContainer',
    methods: {},
    mounted () {},
    props: {
      level: {
        type: Number,
        default: () => 0
      },
    },
  }
</script>
<style lang="stylus" scoped>
.comment-container
  display flex
  min-height 30px
  margin 15px 0
  padding-left 60px
  &.level-0
    min-height 50px
    padding-left 0
    .comment-container__left.avatar
      width 50px
      height 50px
  &__right
    width 40px
  &__middle
    flex 1
  &__left
    &.avatar
      width 30px
      height 30px
      border-radius 50%
      background-image url(../assets/favicon.png)
      background-size contain
      background-repeat no-repeat
      background-position center center
      margin-right 10px  
      overflow hidden
      img
        width 100%
        height 100%
        object-position center center
        object-fit contain
        border-radius 50%

  &.mobile
    &.level-0
      .comment-container__left.avatar
        width 40px
        height 40px
    .comment-container__left
      &.avatar
        width 25px
        height 25px
    .comment-container__right
      width 0
      display none
</style>