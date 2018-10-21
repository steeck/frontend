<template>
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
        <!--코멘트 내용-->
        <v-flex v-html="markedBody" class="area-comment MarkdownViewer Markdown"></v-flex>
        <!--보팅관련 -->
        <v-flex>
          <v-layout row justify-start>
            <div class="block-cus_icon" @click="openVote">
              <v-icon size="20" color="primary" v-text="isVoted ? 'lens' : 'panorama_fish_eye'"></v-icon>
              <v-icon size="20" :color="isVoted ? 'rgb(255,255,255)' : 'primary'" v-text="'keyboard_arrow_up'"></v-icon>
            </div>
            <div class="mr-3">${{ parseFloat(item.pending_payout_value.replace(' SBD', '')).toFixed(2) }}</div>
            <v-flex tag="a" d-inline-block @click="viewVotes = !viewVotes">{{ item.active_votes.length }}보팅</v-flex>
          </v-layout>
          <v-slide-y-transition class="py-0" tag="v-flex" v-if="dialog">
            <vote :item="item" :close="closeVote" :complete="completeVote"></vote>
          </v-slide-y-transition>
        </v-flex>
        <!--하위 코멘트-->
        <v-flex v-if="subList.length > 0">
          <card-comment v-for="list in subList" :item="list" :key="list.permlink"></card-comment>
        </v-flex>
      </v-layout>
    </v-layout>
</template>

<script>
  /**
   * @property {timestamp} last_update : 마지막 작성/수정 일
   */
  import CardComment from './CardComment'
  import Vote from '@/components/post/Vote'
  import steem from '@/services/steem'
  import Remarkable from 'remarkable'
  let md = new Remarkable({html: true, linkify: true, linkTarget: '_blank'})

  export default {
    name: 'cardComment',
    props: {
      item: {
        type: Object
      }
    },
    components: {
      CardComment,
      Vote
    },
    data: function () {
      return {
        subList: [],
        isVoted: false,
        viewVotes: false,
        dialog: false
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
      completeVote: function () {
        this.isVoted = true
        this.dialog = false
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
</style>
