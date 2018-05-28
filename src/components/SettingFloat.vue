<template>
  <div class="setting-float" v-show="showSettingFloat">
    <div class="container" v-if="hasAnyAbility">
      <div class="edit" v-if="get(abilities, 'isEditable')" @click="goAct(POST_ACTION.EDIT)"><span v-text="COMMENT_SETTING.EDIT"></span></div>
      <div class="delete" v-if="get(abilities, 'isDeletible')" @click="goAct(POST_ACTION.DELETE)"><span v-text="COMMENT_SETTING.DEL"></span></div>
      <div class="hide" v-if="get(abilities, 'isHiddable')" @click="goAct(POST_ACTION.HIDE)"><span v-text="COMMENT_SETTING.HIDE"></span></div>
      <div class="cancel" @click="cancel"><span v-text="COMMENT_SETTING.CANCEL"></span></div>
    </div>  
  </div>
</template>
<script>
  import { COMMENT_SETTING, POST_ACTION, } from 'src/constants'
  import { get, map, } from 'lodash'
  export default {
    name: 'SettingFloat',
    computed: {  
      hasAnyAbility () {
        let isAny = false
        map(this.abilities, (a, k) => {
          if (a) {
            isAny = true
          }
        })
        return isAny
      },
    },
    data () {
      return {
        COMMENT_SETTING,
        POST_ACTION,
      }
    },
    methods: {
      cancel () {
        this.$emit('update:showSettingFloat', false)
      },
      get,
      goAct (type) { this.$emit('goAct', type) },
    },
    mounted () {},
    props: {
      commentData: {
        type: Object,
      },
      me: {
        type: Object,
      },
      abilities: {
        type: Object,
        default: () => ({
          isEditable: false,
          isDeletible: false,
          isHiddable: false,          
        })
      },
      showSettingFloat: {
        type: Boolean,
        default: () => false,
      },
    },    
  }
</script>
<style lang="stylus" scoped>
.setting-float
  background-color rgba(0, 0, 0, 0.4)
  position fixed
  top 0
  left 0
  width 100vw
  height 100vh
  z-index 9999
  display flex
  justify-content center
  align-items center
  .container
    width 250px
    > div
      background-color #fff
      height 30px
      display flex
      justify-content center
      align-items center
      font-size 0.875rem
      color #444746
      &:hover
        background-color #d3d3d3
      &.cancel
        margin-top 12px
      &:not(:last-child)
       border-bottom solid 1px #d3d3d3
</style>  