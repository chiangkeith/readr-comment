<template>
  <div class="readr-comment">
    <CommentTextarea v-if="!showTextareaBottom"
      @addComment="add"
      :type="EDIT_TYPE.ADD"
      :level="0"></CommentTextarea>
    <template v-for="comment in commentList">
      <CommentContent v-if="!comment.isEditing"
        :commentData="comment"
        :showTextarea.sync="comment.showTextarea"
        :isEditing.sync="comment.isEditing"></CommentContent>
      <CommentTextarea v-else
        @updateComment="update"
        :value="comment.comment"
        :type="EDIT_TYPE.UPDATE"
        :level="0"
        :isEditing.sync="comment.isEditing"
        :targetId="comment.id"></CommentTextarea>
      <template v-for="sub_comment in comment.replies">
        <CommentContent v-if="!sub_comment.isEditing"
          :commentData="sub_comment"
          :showTextarea.sync="comment.showTextarea"
          :isEditing.sync="sub_comment.isEditing"></CommentContent>
        <CommentTextarea v-else
          @updateComment="update"
          :value="sub_comment.comment"
          :type="EDIT_TYPE.UPDATE"
          :level="1"
          :isEditing.sync="sub_comment.isEditing"
          :subTargetId="sub_comment.id"
          :targetId="comment.id"></CommentTextarea>          
      </template>
      <CommentTextarea v-show="comment.showTextarea"
        @addComment="add"
        :type="EDIT_TYPE.ADD"
        :level="1"
        :targetId="comment.id"></CommentTextarea>
    </template>
    <CommentTextarea v-if="showTextareaBottom"
      @addComment="add"
      :type="EDIT_TYPE.ADD"
      :level="0"></CommentTextarea>
  </div>
</template>
<script>
  import CommentContent from 'src/components/CommentContent.vue'
  import CommentTextarea from 'src/components/CommentTextarea.vue'
  import { EDIT_TYPE, } from 'src/constants'
  import { find, get, } from 'lodash'
  const debug = require('debug')('READR-COMMENT:Comment')

  export default {
    name: 'Comment',
    components: {
      CommentContent,
      CommentTextarea,
    },
    computed: {
      commentList () {
        return [ ...this.curr_comments, ...this.comments, ]
      },
    },
    data () {
      return {
        EDIT_TYPE,
        curr_comments: [],
        showTextareaBottom: this.comments.length < 3
      }
    },
    methods: {
      add (comment, level, targetId) {
        const target_comment = find(this.commentList, { id: targetId })
        debug(comment, level, targetId, target_comment)
        if (target_comment) {
          if (!target_comment.replies) {
            target_comment.replies = [{
                author: 'Readr User D',
                comment,
                level,
                timestamp: 'Just'
            }]
          } else {
            target_comment.replies.push({
              author: 'Readr User D',
              comment,
              level,
              timestamp: 'Just'
            })
          }
        } else {
          this.curr_comments.push({
              author: 'Readr User D',
              comment,
              level,
              timestamp: 'Just'
          })
        }
        this.$forceUpdate()
      },
      update (comment, level, targetId, subTargetId) {
        const target_comment = find(this.commentList, { id: targetId })
        debug(comment, level, targetId, target_comment)
        if (target_comment) {
          if (!subTargetId) {
            target_comment.comment = comment
            target_comment.isEditing = false
          } else {
            const sub_target_comment = find(get(target_comment, 'replies', []), { id: subTargetId })
            if(sub_target_comment) {
              sub_target_comment.comment = comment
              sub_target_comment.isEditing = false
            }
          }
        }
        this.$forceUpdate()
      },
    },
    mounted () {
      debug('Comment mounted!')
      debug('Check it out!')
    },
    props: {
      comments: {
        type: Array,
        default: () => ([
          {
            author: 'Readr User A',
            comment: '受外市主生相題公用解氣目情險語成家形小指斷何得高是成成；我這英原？外從家轉但外公連是黨處來足。',
            level: 0,
            timestamp: '1分鐘',
            id: '4324'
          },
          {
            author: 'Readr User B',
            comment: '防反重來了拉有想跑奇，手正反市沒起！愛神是。理股就酒成，美中我查行絕得臺，率國價不受……燈們國媽英做東故兒共望體有人持統下院種曾與陸，止天今國人她水度原聲有之高感成輕一年是門童一還。成信可出議學表，空一示！當間要類老了金，這個景大率一後展？白數正，數候電食他出新呢了未日從死還不室就像。',
            level: 0,
            timestamp: '3分鐘',
            id: '4324d',
            replies: [
              {
                author: 'Readr User A',
                comment: '笑大他特母消；間頭意善結！了起功相它算個發走美位內需技教取事是國別係臺麼受大日過般期整認國一資比和相作問為！度海！',
                level: 1,
                timestamp: '2分鐘',
                id: 'r32ff',
              },
              {
                author: 'Readr User C',
                comment: '國命都樂此醫那業面語不命發市，到間境走常手員的里其個，同黨子、散形子！沒術創體。問修量友管全件為分意要合樓運男來政！',
                level: 1,
                timestamp: '3分鐘',
                id: 'r32faa2f',
              },
            ]
          },
          {
            author: 'Readr User A',
            comment: '這能寫詩嗎？',
            level: 0,
            timestamp: '4分鐘',
            id: '43249'
          },
        ])
      },
    }
  }
</script>
<style lang="stylus" scoped>
</style>