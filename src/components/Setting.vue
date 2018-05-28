<template>
  <div class="setting" tabIndex="0" @focusout="closeDropbox" @focus="openDropbox" v-if="hasAnyAbility" >
    <div class="setting__btn"><span>▪▪▪</span></div>
    <div class="setting__dropbox">
      <div class="container" v-show="dtopbox_status">
        <div class="edit" v-if="get(abilities, 'isEditable')" @click="goAct(POST_ACTION.EDIT)"><span v-text="COMMENT_SETTING.EDIT"></span></div>
        <div class="delete" v-if="get(abilities, 'isDeletible')" @click="goAct(POST_ACTION.DELETE)"><span v-text="COMMENT_SETTING.DEL"></span></div>
        <div class="hide" v-if="get(abilities, 'isHiddable')" @click="goAct(POST_ACTION.HIDE)"><span v-text="COMMENT_SETTING.HIDE"></span></div>
      </div>
    </div>
  </div>
</template>
<script>
  import { COMMENT_SETTING, POST_ACTION, } from 'src/constants'
  import { map, get, } from 'lodash'
  const debug = require('debug')('READR-COMMENT:Setting')
  export default {
    name: 'Setting',
    computed: {
      hasAnyAbility () {
        let isAny = false
        map(this.abilities, (a, k) => {
          if (a) {
            isAny = true
          }
        })
        return isAny
      }
    },
    data () {
      return {
        COMMENT_SETTING,
        POST_ACTION,
        dtopbox_status: 0,
      }
    },
    methods: {
      closeDropbox () { this.dtopbox_status = 0 },
      get,
      goAct (type) { this.$emit('goAct', type) },
      openDropbox () { this.dtopbox_status = 1 },
    },
    mounted () {},
    props: {
      abilities: {
        type: Object,
        default: () => ({
          isEditable: false,
          isDeletible: false,
          isHiddable: false,          
        })
      },
    },
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