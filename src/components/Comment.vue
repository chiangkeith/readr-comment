<template>
  <div class="readr-comment">
    <CommentWrapper  v-if="!showTextareaBottom(commentList.length)"
      :isMobile="isMobile"
      :goLogin="goLogin"
      :addComment="addComment" :level="0" :me="me"></CommentWrapper>      
    <template v-for="comment in commentList">
      <CommentWrapper v-if="comment.status"
        :isMobile="isMobile"
        :commentData="comment"
        :refreshSubComment="refreshSubComment"
        :reportComment="doReportComment"
        :hideComment="doHideComment"
        :delComment="delComment"
        :goLogin="goLogin"
        :update="update" :me="me"></CommentWrapper>
      <template v-for="sub_comment in comment.replies">
        <CommentWrapper v-if="sub_comment.status"
          :isMobile="isMobile"
          :commentData="sub_comment"
          :refreshSubComment="refreshSubComment"
          :reportComment="doReportComment"
          :hideComment="doHideComment"
          :delComment="delComment"
          :goLogin="goLogin"
          :update="update" :me="me"></CommentWrapper>       
      </template>
      <CommentWrapper v-show="comment.showTextarea || get(comment, 'replies.length', 0)"
        :isMobile="isMobile"
        :addComment="addComment"
        :parentId="comment.id"
        :goLogin="goLogin"
        :level="1" :me="me"></CommentWrapper>
    </template>
    <CommentWrapper v-if="showTextareaBottom(commentList.length)"
      :isMobile="isMobile"
      :goLogin="goLogin"
      :addComment="addComment" :level="0" :me="me"></CommentWrapper>
    <ActionAlert :showAlert.sync="showAlert" :type="alertType" :callback="alertConfirmCb" :isMobile="isMobile"></ActionAlert>
  </div>
</template>
<script>
  import ActionAlert from 'src/components/ActionAlert.vue'
  import CommentWrapper from 'src/components/CommentWrapper.vue'
  import isMobile from 'ismobilejs'
  import { NEW_COMMENT_WAY, POST_ACTION, } from 'src/constants'
  import { find, get, remove, } from 'lodash'
  const debug = require('debug')('READR-COMMENT:Comment')

  export default {
    name: 'Comment',
    components: {
      ActionAlert,
      CommentWrapper,
    },
    computed: {
      isMobile () {
        return isMobile.any
      },
    },
    data () {
      return {
        alertType: '',
        alertConfirmCb: () => {},
        curr_comments: [],
        commentList: [],
        showAlert: false,
      }
    },
    methods: {
      addComment (comment_data, parentId) {
        const target_comment = find(this.commentList, { id: parentId })
        debug(comment_data, parentId, target_comment)
        if (target_comment) {
          if (!target_comment.replies) {
            this.processData(NEW_COMMENT_WAY.NEW, target_comment, comment_data).then(() => this.saveComment && this.saveComment(comment_data))
          } else {
            this.processData(NEW_COMMENT_WAY.INSERT_CHILD, target_comment, comment_data).then(() => this.saveComment && this.saveComment(comment_data))
          }
        } else {
          this.processData(NEW_COMMENT_WAY.INSERT, this.curr_comments, comment_data).then(() => this.saveComment && this.saveComment(comment_data))
        }
        this.$forceUpdate()
      },
      delComment (comment_data) {
        const { parentId, id } = comment_data
        this.alertType = POST_ACTION.DELETE
        this.showAlert = true

        this.alertConfirmCb = () => new Promise(resolve => {
          debug('Del!', parentId, id)
          let target_comment = find(this.commentList, { id: parentId })
          if (target_comment) {
            if (id) {
              remove(get(target_comment, 'replies', []), { id })
            } else {
              console.error(`There's no comment matched.`, id)
            }
          } else {
            remove(this.commentList, { id, })
          }
          this.$forceUpdate()
          this.deleteComment && this.deleteComment(comment_data, id)
          resolve()
        })
      },
      doHideComment (comment_data) {
        const { parentId, id } = comment_data
        this.showAlert = true
        this.alertType = POST_ACTION.HIDE
        this.alertConfirmCb = () => new Promise(resolve => {
          debug('Hide!', parentId, id)
          let target_comment = find(this.commentList, { id: parentId })
          if (target_comment) {
            if (id) {
              const sub_target_comment = find(get(target_comment, 'replies', []), { id })
              if(sub_target_comment) {
                sub_target_comment.status = 0
              }                
            } else {
              console.error(`There's no comment matched.`, id)
            }
          } else {
            target_comment = find(this.commentList, { id })
            target_comment && (target_comment.status = 0)
          }
          this.$forceUpdate()
          this.hideComment && this.hideComment(comment_data, id)
          resolve()
        })        
      },
      doReportComment (comment_data) {
        const { parentId, id } = comment_data
        this.showAlert = true
        this.alertType = POST_ACTION.REPORT
        this.alertConfirmCb = () => new Promise(resolve => {
          debug('Hide!', parentId, id)
          if (!this.hideComment) {
            let target_comment = find(this.commentList, { id: parentId })
            if (target_comment) {
              if (id) {
                const sub_target_comment = find(get(target_comment, 'replies', []), { id })
                if(sub_target_comment) {
                  sub_target_comment.isReported = true
                }                
              } else {
                console.error(`There's no comment matched.`, id)
              }
            } else {
              target_comment = find(this.commentList, { id })
              target_comment && (target_comment.isReported = true)
            }
          } else {
            this.reportComment(comment_data, id)
          }
          resolve()
        })        
      },
      get,
      processData (type, target, data) {
        return new Promise(resolve => {
          const new_comment = {
            author: data.author,
            authorNickname: data.authorNickname,
            authorImage: data.authorImage,
            body: data.body,
            level: data.level,
            parentId: data.parentId,
            status: 1,
            timestamp: data.timestamp          
          }
          debug(type, target, data)
          switch (type) {
            case 'INSERT':
              // target.push(new_comment)
              this.curr_comments.push(new_comment)
              break
            case 'INSERT_CHILD':
              target.replies.push(new_comment)
              break
            case 'NEW':
              target.replies = [ new_comment ]
              break
          }
          debug('target.replies', target)
          this.$forceUpdate()
          resolve()
        })
      },
      showTextareaBottom (length) {
        debug('typeof(length)', typeof(length))
        return typeof(length) === 'number' && length < 3
      },
      update (comment_data, parentId, id) {
        let target_comment = find(this.commentList, { id: parentId })
        debug(comment_data, parentId, target_comment)
        if (target_comment) {
          if (!id) {
            target_comment.body = comment_data.body
            target_comment.isEditing = false
          } else {
            const sub_target_comment = find(get(target_comment, 'replies', []), { id })
            if(sub_target_comment) {
              sub_target_comment.body = comment_data.body
              sub_target_comment.isEditing = false
            }
          }
        } else {
          target_comment = find(this.commentList, { id })
          if(target_comment) {
            target_comment.body = comment_data.body
            target_comment.isEditing = false
          }          
        }
        this.updateComment && this.updateComment(comment_data, id)
        this.$forceUpdate()
      },
    },
    mounted () {
      debug('Comment mounted!')
      debug('Check it out!')
      this.commentList = [ ...this.curr_comments, ...this.comments, ]
    },
    props: {
      comments: {
        type: Array,
        default: () => ([])
      },
      saveComment: {
        type: Function,
      },
      deleteComment: {
        type: Function,
      },
      hideComment: {
        type: Function,
      },
      updateComment: {
        type: Function,
      },
      reportComment: {
        type: Function,
      },
      refreshSubComment: {
        type: Function,
        default: id => debug('Refresh sub comment!(DEFAULT FUNCTION)', id)
      },
      me: {
        type: Object,
      },
      goLogin: {
        type: Function,
        default: () => {},
      },
    },
    watch: {
      comments () {
        debug('Mutation detected: comments')
        this.commentList = [ ...this.comments, ]
        this.curr_comments = []
      },
      curr_comments () {
        debug('Mutation detected: curr_comments')
        this.commentList = [ ...this.curr_comments, ...this.comments, ]        
      },
      commentList () {
        debug('Mutation detected: commentList', this.commentList)
      },
    },
  }
</script>
