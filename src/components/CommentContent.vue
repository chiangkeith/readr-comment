<template>
  <CommentContainer class="content" :class="{ 'mobile': isMobile }" :isMobile="isMobile" :level="level">
    <img :src="authorImage" slot="left" v-if="authorImage">
    <template slot="middle">
      <div class="content__author">
        <template v-if="authorPage"><a :href="authorPage"><span v-text="authorNickname"></span></a></template>
        <template v-else><span v-text="authorNickname"></span></template>
      </div>
      <div class="content__comment" :class="{ 'prevent-select': showSettingFloat && hasAnyAbility }"><span v-html="body"></span></div>
      <div class="content__toolbox">
        <div class="timestamp"><Timestamp :datetime="timestamp"></Timestamp></div>
        <div class="reply" @click="openTextarea"><span v-text="commentCount"></span></div>
        <div class="report" @click="goAct(POST_ACTION.REPORT)" v-if="showReport"><span v-text="COMMENT_SETTING.REPORT"></span></div>
      </div>      
    </template>
    <Setting v-if="me && !isMobile" slot="right"
      :class="'content__setting'"
      :abilities="abilities"
      @goAct="goAct"></Setting>
    <SettingFloat v-else-if="me && isMobile"
      :showSettingFloat.sync="showSettingFloat"
      :me="me"
      :commentData="commentData"
      :abilities="abilities"
      @goAct="goAct" slot="middle"></SettingFloat>
  </CommentContainer>
</template>
<script>
  import { COMMENT_SETTING, POST_ACTION, } from 'src/constants'
  import { get, map, } from 'lodash'
  import CommentContainer from 'src/components/CommentContainer.vue'
  import Setting from 'src/components/Setting.vue'
  import SettingFloat from 'src/components/SettingFloat.vue'
  import Timestamp from 'src/components/Timestamp.vue'
  import moment from 'moment'
  const debug = require('debug')('READR-COMMENT:CommentContent')

  export default {
    name: 'CommentContent',
    components: {
      CommentContainer,
      Setting,
      SettingFloat,
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
      authorPage () {
        return get(this.commentData, 'authorPage')
      },
      body () {
        return decodeURI(get(this.commentData, 'body', '').replace(/\r?\n/g, '<br>'))
      },
      commentCount () {
        return get(this.commentData, 'commentAmount', 0)
      },
      hasAnyAbility () {
        let isAny = false
        map(this.abilities, (a, k) => {
          if (a) {
            isAny = true
          }
        })
        return isAny
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
        longpress: false,
        presstimer: null,
        showSettingFloat: false,
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
      pressStart (e) {
        if (e.type === 'click' && e.button !== 0) { return }
        this.longpress = false
        if (this.presstimer === null) {
          this.presstimer = setTimeout(() => {
            this.longpress = true
          }, 1000)
        }

        return false
      },
      pressCancel (e) {
        if (this.presstimer !== null) {
          clearTimeout(this.presstimer)
          this.presstimer = null
          this.longpress = false
        }
      },
      setupLongPressListeners () {
        this.$el.addEventListener('touchstart', this.pressStart)
        this.$el.addEventListener('touchend', this.pressCancel)
        this.$el.addEventListener('touchleave', this.pressCancel)
        this.$el.addEventListener('touchcancel', this.pressCancel)
        this.$el.addEventListener('touchmove', this.pressCancel)
      },
    },
    mounted () {
      debug('CommentContent Mounted')
      debug('isMobile', this.isMobile)
      this.isMobile && this.setupLongPressListeners()
    },
    props: {
      isMobile: {
        type: Boolean,
        default: () => false,
      },
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
    watch: {
      longpress () {
        debug('Mutation detected: longpress', this.longpress)
        if (this.longpress) {
          this.showSettingFloat = true
        }
      }
    },
  }
</script>
<style lang="stylus" scoped>
  .content
    font-size 0.9375rem
    line-height normal
    &__author
      font-weight 500
      & >>> a, a:hover, a:link, a:visited
        color #000      
    &__comment
      font-weight 300
      overflow-wrap break-word
      &.prevent-select
        user-select none
      & >>> a, a:hover, a:link, a:visited
        font-weight 300
        color #10b8c9
      & >>> a:hover
        color #0c919f
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
  
    &.mobile
      font-size 0.6875rem
      .content__comment
        text-align justify
      .content__toolbox
        > div
          font-size 0.625rem
          &:not(:last-child)
            &::after
              font-size 0.25rem
        .timestamp
          display flex
          justify-content center
          align-items center

</style>
