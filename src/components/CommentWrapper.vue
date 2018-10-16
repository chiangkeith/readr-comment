<template>
  <CommentTextarea v-if="!comment"
    @addComment="addComment"
    :type="EDIT_TYPE.ADD"
    :level="level || checkLevel()"
    :parentId="parentId"
    :isMobile="isMobile"
    :goLogin="goLogin"
    :me="me"></CommentTextarea>
  <CommentContent v-else-if="comment && !comment.isEditing"
    @refreshSubComment="refreshSubComment"
    @delComment="delComment"
    @hideComment="hideComment"
    @reportComment="reportComment"
    :commentData="comment"
    :showTextarea.sync="comment.showTextarea"
    :isEditing.sync="comment.isEditing"
    :isMobile="isMobile"
    :me="me"></CommentContent>
  <CommentTextarea v-else-if="comment && comment.isEditing"
    @updateComment="update"
    :value="comment.body"
    :type="EDIT_TYPE.UPDATE"
    :level="level || checkLevel()"
    :isEditing.sync="comment.isEditing"
    :parentId="comment.parentId"
    :id="comment.id"
    :isMobile="isMobile"
    :goLogin="goLogin"
    :me="me"></CommentTextarea>
</template>
<script>
  import CommentTextarea from 'src/components/CommentTextarea.vue'
  import CommentContent from 'src/components/CommentContent.vue'
  import { EDIT_TYPE, } from 'src/constants'
  import { get, } from 'lodash'
  const debug = require('debug')('READR-COMMENT:CommentWrapper')
  export default {
    name: 'CommentWrapper',
    components: {
      CommentContent,
      CommentTextarea,
    },
    computed: {},
    data () {
      return {
        EDIT_TYPE,
        comment: {},
      }
    },
    methods: {
      checkLevel () {
        return get(this.comment, 'parentId') ? 1 : 0
      },
    },
    mounted () {
      this.comment = this.commentData
    },
    props: {
      isMobile: {
        type: Boolean,
        default: () => false,
      },
      commentData: {
        type: Object,
      },
      me: {
        type: Object,
      },
      level: {
        type: Number,
      },
      addComment: {
        type: Function,
        default: () => {},
      },
      delComment: {
        type: Function,
        default: () => {},
      },
      hideComment: {
        type: Function,
        default: () => {},
      },
      reportComment: {
        type: Function,
        default: () => {},
      },
      refreshSubComment: {
        type: Function,
        default: () => {},
      },
      update: {
        type: Function,
        default: () => {},
      },
      type: {
        type: String,
      },
      parentId: {
        type: Number,
      },
      goLogin: {
        type: Function,
        default: () => {},
      },
    },
    watch: {
      comment () {
        debug('Mutation detected: comment', this.comment)
      },
      commentData () {
        debug('Mutation detected: commentData', this.commentData)
        debug('Go sync comment.')
        this.comment = this.commentData
      },
    },
  }
</script>
