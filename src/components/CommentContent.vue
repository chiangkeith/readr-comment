<template>
  <CommentContainer class="content" :level="level">
    <img :src="authorImage" slot="left" v-if="authorImage">
    <template slot="middle">
      <div class="content__author"><span v-text="authorNickname"></span></div>
      <div class="content__comment"><span v-text="body"></span></div>
      <div class="content__toolbox">
        <div class="timestamp"><Timestamp :datetime="timestamp"></Timestamp></div>
        <div class="reply" @click="openTextarea"><span v-text="commentCount"></span></div>
        <div class="report" @click="goAct(POST_ACTION.REPORT)" v-if="showReport"><span v-text="COMMENT_SETTING.REPORT"></span></div>
      </div>      
    </template>
    <Setting v-if="me" slot="right"
      :class="'content__setting'"
      :abilities="abilities"
      @goAct="goAct"></Setting>
  </CommentContainer>
</template>
<script>
  import { COMMENT_SETTING, POST_ACTION, } from 'src/constants'
  import { get, } from 'lodash'
  import CommentContainer from 'src/components/CommentContainer.vue'
  import Setting from 'src/components/Setting.vue'
  import Timestamp from 'src/components/Timestamp.vue'
  import moment from 'moment'
  const debug = require('debug')('READR-COMMENT:CommentContent')

  export default {
    name: 'CommentContent',
    components: {
      CommentContainer,
      Setting,
      Timestamp,
    },
    computed: {
      abilities () {
        return {
          isEditable: get(this.commentData, 'author') === get(this.me, 'id'),
          isDeletible: get(this.commentData, 'author') === get(this.me, 'id'),
          isHiddable: get(this.me, 'role') === 'admin',
        }
      },
      authorNickname () {
        return get(this.commentData, 'authorNickname', COMMENT_SETTING.USER)
      },
      authorImage () {
        return get(this.commentData, 'authorImage')
      },
      body () {
        return get(this.commentData, 'body', '灣國寶示心臉和大我毛商求部嚴臺據期親來看不形可毒升果於小二眾現進子化少許度，看有總如積這。')
      },
      commentCount () {
        return get(this.commentData, 'commentAmount', 0)
      },
      level () {
        return get(this.commentData, 'parentId') ? 1 : 0
      },
      showReport () {
        return get(this.commentData, 'author') !== get(this.me, 'id')
      },
      timestamp () {
        return get(this.commentData, 'createdAt', moment().format('YYYY-MM-DD HH:mm:ss'))
          || get(this.commentData, 'timestamp', moment().format('YYYY-MM-DD HH:mm:ss'))
      },
    },
    data () {
      return {
        COMMENT_SETTING,
        POST_ACTION,
      }
    },
    methods: {
      goAct (type) {
        switch (type) {
          case 'EDIT':
            debug('update:isEditing', true)
            this.$emit('update:isEditing', true)
            break
          case 'DELETE':
            debug('Go Del!')
            this.$emit('delComment', this.commentData)
            break
          case 'HIDE':
            this.$emit('hideComment', this.commentData)
            break
          case 'REPORT':
            this.$emit('reportComment', this.commentData)
            break
        }
      },
      openTextarea () {
        if (this.commentCount) {
          this.$emit('refreshSubComment', get(this.commentData, 'id'))
        } else {
          debug('update:showTextarea', true)
          this.$emit('update:showTextarea', true)
        }
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
      me: {
        type: Object,
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
      margin-top 5px
      > div
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
        top 5px
        padding-left 15px
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
          top -5px
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
