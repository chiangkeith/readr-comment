<template>
  <div class="action-alert" :class="{ 'mobile': isMobile }" v-show="showAlert">
    <div class="action-alert__container">
      <div class="message"><span v-text="message"></span></div>
      <div class="btn-wrapper">
        <div class="btn" @click="cancel" v-show="!isDone"><span v-text="COMMENT_SETTING.CANCEL"></span></div>
        <div class="btn" @click="confirm"><span v-text="COMMENT_SETTING.CONFIRM"></span></div>
      </div>
    </div>
  </div>
</template>
<script>
  import { COMMENT_SETTING, POST_ACTION, } from 'src/constants'
  import { get, } from 'lodash'
  const debug = require('debug')('READR-COMMENT:ActionAlert')
  export default {
    name: 'ActionAlert',
    computed: {
      message () {
        return get(COMMENT_SETTING, `CONFIRM_MESSAGE${this.isDone ? '_DONE' : ''}.${this.type}`)
      },
    },
    data () {
      return {
        COMMENT_SETTING,
        isDone: false,
      }
    },
    methods: {
      cancel () {
        this.$emit('update:showAlert', false)
      },
      confirm () {
        if (this.isDone) {
          this.$emit('update:showAlert', false)
          this.isDone = false
        } else {
          this.callback().then(() => {
            this.isDone = true
          })
        }
      },
    },
    mounted () {},
    props: {
      callback: {
        type: Function,
        default: () => Promise.resolve(),
      },
      isMobile: {
        type: Boolean,
        default: () => false,
      },      
      showAlert: {
        type: Boolean,
        default: () => false,
      },
      type: {
        typs: String,
        default: () => ''
      },
    },
    watch: {
      showAlert () {
        debug('Mutation detected: showAlert.', this.showAlert)
      },
    }
  }
</script>
<style lang="stylus" scoped>
  .action-alert
    position fixed
    top 0
    left 0
    z-index 9999
    background-color rgba(0, 0, 0, 0.2)
    width 100vw
    height 100vh
    display flex
    justify-content center
    align-items center
    &__container
      width 200px
      padding 10px
      background-color #fff
      box-shadow 1px 1px 2px 0 rgba(0, 0, 0, 0.5)
      border-top solid 2px #11b8c9
      .message
        font-size 0.75rem
        line-height normal
        margin-bottom 7px
      .btn-wrapper
        width 100%
        display flex
        justify-content flex-end
        .btn
          height 20px
          padding 2px
          border solid 1px #808080
          margin-left 8px
          cursor pointer
          font-size 0.75rem
          display flex
          justify-content center
          align-items center
          &:hover
            color #fff
            background-color #11b8c9
            border solid 1px #11b8c9
    &.mobile
      .action-alert__container
        .message
          font-size 0.875rem
        .btn-wrapper
          .btn
            font-size 0.875rem
            overflow hidden


</style>