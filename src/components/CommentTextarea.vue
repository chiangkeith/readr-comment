<template>
  <CommentContainer :level="level">
    <div class="textarea-container" slot="middle">
      <textarea :rows="rows" cols="50" v-model="curr_value" @click="activate"
        :placeholder="placeholder || COMMENT_SETTING.PLACEHOLDER"></textarea>
    </div>
    <div class="tool" slot="middle" v-show="status">
      <div class="tool__cancel" @click="doCancel"><span v-text="COMMENT_SETTING.CANCEL"></span></div>
      <div class="tool__confirm" @click="doComment"><span v-text="COMMENT_SETTING.CONFIRM"></span></div>
    </div>
  </CommentContainer>
</template>
<script>
  import CommentContainer from 'src/components/CommentContainer.vue'
  import { COMMENT_SETTING, EDIT_TYPE, } from 'src/constants'

  export default {
    name: 'CommentTextarea',
    components: {
      CommentContainer,
    },
    computed: {
      rows () {
        return this.status ? 4 : 2
      },
    },
    data () {
      return {
        COMMENT_SETTING,
        EDIT_TYPE,
        curr_value: '',
        status: false,
      }
    },
    methods: {
      activate () {
        this.status = true
      },
      doCancel () {
        if (this.type === EDIT_TYPE.ADD) {
          this.curr_value = ''
          this.status = false
        } else if (this.type === EDIT_TYPE.UPDATE) {
          this.$emit('update:isEditing', false)
        }        
      },
      doComment () {
        if (this.type === EDIT_TYPE.ADD) {
          this.$emit('addComment', this.curr_value, this.level, this.targetId)
        } else if (this.type === EDIT_TYPE.UPDATE) {
          this.$emit('updateComment', this.curr_value, this.level, this.targetId, this.subTargetId)
        }
        this.curr_value = ''
        this.status = false
      },
    },
    mounted () {
      this.curr_value = this.value
      if (this.type === EDIT_TYPE.UPDATE) {
        this.status = true
      }
    },
    props: {
      level: {
        type: Number,
        default: () => 0,
      },
      isEditing: {
        type: Boolean,
      },
      placeholder: {
        type: String,
      },
      subTargetId: {
        type: String,
      },
      targetId: {
        type: String,
      },
      value: {
        type: String,
      },
      type: {
        type: String,
      }
    },
    watch: {
      curr_value: function () {
        this.$emit('update:value', this.curr_value)
      }
    }    
  }
</script>
<style lang="stylus" scoped>
  .textarea-container
    width 100%
    background-color #fff
    textarea
      width 100%
      border solid 1px #d3d3d3
      outline none
      font-size 0.875rem
      font-weight 300
      padding 5px 10px
      resize none
      transition height 1s
      &::-webkit-input-placeholder
        color #bdbdbd
        font-weight 100
  .tool
    display flex
    color #11b8c9
    font-size 0.75rem
    font-weight 500
    text-decoration underline
    line-height normal
    cursor pointer
    div
      margin-right 10px
</style>