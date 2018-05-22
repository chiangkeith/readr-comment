<template>
  <CommentContainer class="content" :level="level">
    <template slot="middle">
      <div class="content__author"><span v-text="author"></span></div>
      <div class="content__comment"><span v-text="comment"></span></div>
      <div class="content__toolbox">
        <div class="timestamp"><span v-text="timestamp"></span></div>
        <div class="reply" @click="openTextarea"></div>
        <div class="report"><span v-text="COMMENT_SETTING.REPORT"></span></div>
      </div>      
    </template>
    <Setting :class="'content__setting'" slot="right" @goEdit="goEdit"></Setting>
  </CommentContainer>
</template>
<script>
  import { COMMENT_SETTING, } from 'src/constants'
  import { get } from 'lodash'
  import CommentContainer from 'src/components/CommentContainer.vue'
  import Setting from 'src/components/Setting.vue'
  const debug = require('debug')('READR-COMMENT:CommentContent')

  export default {
    name: 'CommentContent',
    components: {
      CommentContainer,
      Setting,
    },
    computed: {
      author () {
        return get(this.commentData, 'author', 'Readr User')
      },
      comment () {
        return get(this.commentData, 'comment', '灣國寶示心臉和大我毛商求部嚴臺據期親來看不形可毒升果於小二眾現進子化少許度，看有總如積這。')
      },
      level () {
        return get(this.commentData, 'level', 0)
      },
      timestamp () {
        return get(this.commentData, 'timestamp', '3小時')
      },
    },
    data () {
      return {
        COMMENT_SETTING,
      }
    },
    methods: {
      goEdit () {
        this.$emit('update:isEditing', true)
      },
      openTextarea () {
        this.$emit('update:showTextarea', true)
      },
    },
    mounted () {
      debug('CommentContent Mounted')
    },
    props: {
      commentData: {
        type: Object,
        default: () => ({
          author: '',
          comment: '',
          level: 0,
          timestamp: ''
        })
      },
      isEditing: {
        type: Boolean,
        default: () => false,
      },
      showTextarea: {
        type: Boolean,
        default: () => false,
      },
    },
  }
</script>
<style lang="stylus" scoped>
  .content
    font-size 0.9375rem
    line-height normal
    &__author
      font-weight 500
    &__comment
      font-weight 300
    &__toolbox
      display flex
      justify-content flex-start
      align-items center
      height 18px
      margin-top 3px
      div
        padding-right 15px
        min-height 18px
        position relative
        font-size 0.75rem
        color #808080
        &:not(:last-child)
          &::after
            font-size 0.5rem
            content '▪'
            display flex
            justify-content center
            align-items center
            width 15px
            height 100%
            position absolute
            right 0
            top 0
      // .timestamp
      .report, .reply
        padding-left 18px
        font-size 0.625rem
        font-weight 500
        color #11b8c9
        display flex
        align-items flex-end
        cursor pointer
        &::before
          content ''
          display block
          position absolute
          left 0
          top 0
          background-repeat no-repeat
          background-position center center
          background-size contain
      .report
        &::before
          width 18px
          height 100%
          background-image url(../assets/flags.png)
      .reply
        &::before
          width 18px
          height 100%
          background-image url(../assets/comment-blue.png)
    &:hover
      .content__setting
        display block
    &__setting
      display none
</style>
