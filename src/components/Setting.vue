<template>
  <div class="setting" tabIndex="0" @focusout="closeDropbox" @focus="openDropbox">
    <div class="setting__btn"><span>▪▪▪</span></div>
    <div class="setting__dropbox">
      <div class="container" v-show="dtopbox_status">
        <div class="edit" @click="goEdit"><span v-text="COMMENT_SETTING.EDIT"></span></div>
        <div class="delete"><span v-text="COMMENT_SETTING.DEL"></span></div>
        <div class="hide"><span v-text="COMMENT_SETTING.HIDE"></span></div>
      </div>
    </div>
  </div>
</template>
<script>
  import { COMMENT_SETTING } from 'src/constants'
  const debug = require('debug')('READR-COMMENT:Setting')
  export default {
    name: 'Setting',
    data () {
      return {
        dtopbox_status: 0,
        COMMENT_SETTING,
      }
    },
    methods: {
      closeDropbox () {
        this.dtopbox_status = 0
      },
      goEdit () {
        this.$emit('goEdit')
      },
      openDropbox () {
        this.dtopbox_status = 1
      },
    },
    mounted () {},
  }
</script>
<style lang="stylus" scoped>
.setting
  cursor pointer
  width 40px
  // height 40px
  font-size 0.75rem
  outline none
  &__btn
    width 100%
    height 0.75rem
    color #ddcf21
    display flex
    justify-content center
    align-items center

  &__dropbox
    position relative
    width 100%
    padding-top 8px
    .container
      border 1px solid #c7c7c7
      overflow hidden
      div
        padding 3px 5px
        font-size 0.75rem
        &:hover
          background-color #444746
          color #fff
          &:first-child
            &::after
              border-color transparent transparent #444746 transparent
        &:first-child              
          &::before
            content ''
            position absolute
            top -2px
            left 50%
            width 10px
            height 10px
            display block
            border-width 0 5px 9px 5px
            border-color transparent transparent #c7c7c7 transparent
            border-style solid
            margin-left -5px
          &::after
            content ''
            position absolute
            top 0
            left 50%
            width 10px
            height 10px
            display block
            border-width 0 5px 9px 5px
            border-color transparent transparent #fff transparent
            border-style solid
            margin-left -5px
</style>