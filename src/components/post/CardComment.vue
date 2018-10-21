<template>
  <v-layout column>
    <v-layout row class="block-comment pa-1" align-start>
      <v-avatar color="grey lighten-4 mr-3">
        <!--<img :src="'https://steemitimages.com/u/' + item.author + '/avatar'" alt="avatar">-->
        <v-img :src="'https://steemitimages.com/u/' + item.author + '/avatar'"></v-img>
      </v-avatar>
      <v-layout column>
        <!--코멘트 상단-->
        <v-flex class="caption">
          <span>{{ item.author }}</span>
          <span>({{ reputationCount }})</span>
          <span>{{ item.last_update | convdate | ago }}</span>

        </v-flex>
        <!--실패시-->
        <v-alert :value="actionFail" type="error" transition="scale-transition">
          작업을 완료하지 못했습니다.
        </v-alert>
        <!--코멘트 내용-->
        <v-flex v-html="markedBody" class="area-comment MarkdownViewer Markdown"></v-flex>
        <!--보팅관련 -->
        <v-flex>
          <v-layout row justify-start>
            <div class="block-cus_icon" @click="openVote">
              <v-icon size="20" color="primary" v-text="isVoted ? 'lens' : 'panorama_fish_eye'"></v-icon>
              <v-icon size="20" :color="isVoted ? 'rgb(255,255,255)' : 'primary'" v-text="'keyboard_arrow_up'"></v-icon>
            </div>
            <div class="mr-2">${{ parseFloat(item.pending_payout_value.replace(' SBD', '')).toFixed(2) }}</div>
            <a @click="viewVotes = !viewVotes">{{ item.active_votes.length }}보팅</a>
            <a class="mx-2" v-if="item.author === $store.state.me.account.name" @click="openConfirm = true">삭제</a>
            <a class="mx-2" @click="editComment.openEdit = true">댓글</a>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-layout>
    <!--코멘트 컴포넌트-->
    <v-slide-y-transition class="py-0" tag="v-flex">
      <edit-comment v-if="editComment.openEdit" :item="item" :condition="editComment" :complete="completeInComment"></edit-comment>
    </v-slide-y-transition>
    <!--보트 컴포넌트-->
    <v-slide-y-transition class="py-0" tag="v-flex" v-if="dialog">
      <vote :item="item" :close="closeVote" :complete="completeVote"></vote>
    </v-slide-y-transition>
    <v-layout row v-if="subList.length > 0" align-start>
      <v-icon class="replay">reply</v-icon>
      <!--하위 코멘트-->
      <v-flex>
        <card-comment v-for="list in subList" :item="list" :key="list.permlink" :completeComment="completeInComment"></card-comment>
      </v-flex>
    </v-layout>
    <v-dialog v-model="openConfirm" persistent max-width="290">
      <v-card>
        <v-card-title class="title">삭제</v-card-title>
        <v-card-text>코멘트를 삭제하시겠 습니까?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" flat @click.native="openConfirm = false" :disabled="actionDoing">취소</v-btn>
          <!--<v-btn color="grey darken-1" flat @click.native="downVoteFalse = !downVoteFalse">test</v-btn>-->
          <v-btn color="green darken-1" flat @click.native="deleteComment" :loading="actionDoing">삭제</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  /**
   * @property {timestamp} last_update : 마지막 작성/수정 일
   */
  import CardComment from './CardComment'
  import EditComment from '@/components/post/EditComment'
  import Vote from '@/components/post/Vote'
  import steem from '@/services/steem'
  import steemconnect from '@/services/steemconnect'
  import Remarkable from 'remarkable'
  let md = new Remarkable({html: true, linkify: true, linkTarget: '_blank'})

  export default {
    name: 'cardComment',
    props: {
      item: {
        type: Object
      },
      completeComment: {
        type: Function
      }
    },
    components: {
      CardComment,
      Vote,
      EditComment
    },
    data: function () {
      return {
        subList: [],
        isVoted: false,
        viewVotes: false,
        dialog: false,
        editComment: {
          openEdit: false
        },
        actionFail: false,
        openConfirm: false,
        actionDoing: false
      }
    },
    computed: {
      reputationCount: function () {
        return steem.formatter.reputation(this.item.author_reputation)
      },
      markedBody: function () {
        return this.item.body ? md.render(this.item.body) : ''
      }
    },
    watch: {
      '$store.state.reloadCommentPermlink': function () {
        if (this.$store.state.reloadCommentPermlink === this.item.permlink) {
          this.loadComment()
        }
      }
    },
    methods: {
      loadComment: function () {
        steem.api.getContentRepliesAsync(this.item.author, this.item.permlink)
          .then((res) => {
            this.subList = res
          })
      },
      openVote: function () {
        this.dialog = this.isVoted ? false : !this.dialog
      },
      closeVote: function () {
        this.dialog = false
      },
      completeInComment: function () {
        this.loadComment()
      },
      deleteComment: function () {
        let vm = this
        this.actionDoing = true
        steemconnect.setAccessToken(this.$store.state.auth.accessToken)
        steemconnect.deleteComment(this.$store.state.me.account.name, this.item.permlink, function (err, res) {
          if (res) {
            console.log(res)
            vm.actionDoing = false
            vm.completeComment()
          }
          if (err) {
            console.log(err)
            vm.actionDoing = false
          }
        })
      }
    },
    mounted: function () {
      if (this.item.children > 0) {
        this.loadComment()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .replay {
    transform: rotate(180deg);
  }
</style>
