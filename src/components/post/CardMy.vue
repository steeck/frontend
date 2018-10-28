<template>

  <v-card  class="pl-3 pr-3 card-my-page mt-2 mb-2">
    <v-card-text>
      <v-layout justify-space-between align-center xs12 row>
        <v-flex d-inline-block >
          <v-layout align-center>
            <v-avatar color="grey lighten-4" size="48">
              <v-img :src="'https://steemitimages.com/u/' + item.author + '/avatar'"></v-img>
            </v-avatar>
            <v-flex d-inline-block>
              <router-link :to="'/user/' + item.author" :tag="'a'" v-if="item.author !== $store.state.me.account.name" class="card-author">
                {{ item.author }}
              </router-link>
              <div v-else class="card-author">{{ item.author }}</div>
              <div class="card-post_time">{{ this.createdTime | ago}}</div>
            </v-flex>
          </v-layout>
        </v-flex>
        <card-menu :item="item"></card-menu>
      </v-layout>
    </v-card-text>
    <v-card-title>
      <v-flex column v-if="postType === 'post'" @click="jumpToPost" class="area-click" xs12>
        <v-flex xs12 class="headline text-truncate">{{ item.title }}</v-flex>
        <v-flex xs12 class="grey--text text-truncate">{{ this.bodyChip }}</v-flex>
      </v-flex>
      <v-flex column v-else-if="postType === 'comment'" xs12>
        <v-flex xs12 class="grey--text text-truncate pb-2">
          <div @click="jumpToRootPost" class="area-click" >Post Title : {{ item.root_title }}</div>
          <div @click=openParentUser class="caption area-click">Comment to : {{ item.parent_author }} </div>
        </v-flex>
        <v-flex xs12 v-html="markedCommentBody" class="MarkdownViewer Markdown area-click" @click="jumpToPost"></v-flex>
      </v-flex>
    </v-card-title>
    <v-card-text v-if="jsonMetadata && jsonMetadata.image.length > 0">
      <v-carousel hide-delimiters class="area-carousel">
        <v-carousel-item
          v-for="(image, i) in jsonMetadata.image"
          :key="i"
          :src="image"
          contain
        ></v-carousel-item>
        </v-carousel>
    </v-card-text>
    <v-card-text class="card-footer pt-2 mt-3">
      <v-layout justify-space-between align-center xs12 row>
        <v-flex d-inline-block>
          <v-flex d-inline-block>
            <v-layout align-center>
              <v-icon class="pr-1">monetization_on</v-icon>
              <span>{{ getPayoutValue }}</span>
            </v-layout>
          </v-flex>
          <v-flex d-inline-block class="ml-2">
            <v-layout align-center>
              <v-icon class="pr-1">chat_bubble_outline</v-icon>
              <span>{{ item.children }}개</span>
            </v-layout>
          </v-flex>
        </v-flex>
        <v-menu d-inline-block>
          <v-btn slot="activator" icon >
            <v-icon>bookmark_border</v-icon>
          </v-btn>
          <v-list class="card-more">
            <v-list-tile @click="">
              <v-list-tile-title>메뉴</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-layout>
    </v-card-text>


  </v-card>
</template>

<script>
  /**
   * @property root_title
   * @property root_author
   * @property root_permlink
   */
  import CardMenu from '@/components/post/Menu'
  import Remarkable from 'remarkable'
  let md = new Remarkable({html: true, linkify: true, linkTarget: '_blank'})

  export default {
    name: 'CardMy',
    props: {
      item: {
        type: Object
      },
      postType: {
        type: String
      }
    },
    components: {
      'card-menu': CardMenu
    },
    data () {
      return {
        author: {
          json_metadata: {
            profile: {
              profile_image: '',
              about: 'Update about me',
              name: '',
              location: '',
              website: 'https://about.steeck.io',
              cover_image: ''
            }
          }
        },
        jsonMetadata: {
          tags: [],
          app: '',
          format: '',
          image: []
        }
      }
    },
    computed: {
      // 도착한시간을 한국 시간에 맞게 9시간을 더해줌
      createdTime: function () {
        let originTime = new Date(this.item.created)
        return new Date(originTime.setHours(originTime.getHours() + 9)).toISOString()
      },
      // 글 본문내용 중 일부를 반환 코멘트인경우 전체를 리턴
      bodyChip: function () {
        // eslint-disable-next-line
        let tmp = this.item.body.split('\n').join(' ').replace(/(!\[.*?\))/gi, '').replace(/(<.*?>)/gi, '')
        return this.postType === 'post' ? (tmp.substring(0, tmp.length < 100 ? tmp.length : 100)) : tmp
      },
      getPayoutValue: function () {
        // console.log(this.item.content.pending_payout_value)
        return parseFloat(this.item.pending_payout_value.replace(' SBD', '')).toFixed(2)
      },
      // 댓글 마크업 html
      markedCommentBody: function () {
        return this.item.body ? md.render(this.item.body) : ''
      }
    },
    methods: {
      jumpToPost: function () {
        let url = '/' + this.item.category + '/' + this.item.author + '/' + this.item.permlink
        this.$router.push(url)
      },
      jumpToRootPost: function () {
        let url = '/' + this.item.category + '/' + this.item.root_author + '/' + this.item.root_permlink
        this.$router.push(url)
      },
      openParentUser: function () {
        let url = '/user/' + this.item.parent_author
        window.open(url)
      }
    },
    mounted () {
      if (this.item.json_metadata) {
        this.jsonMetadata = Object.assign(this.jsonMetadata, JSON.parse(this.item.json_metadata))
      }
    }
  }
</script>

<style lang="scss" scoped>
 @import "../../colorset";

 .card-my-page {
   box-shadow: none;
   border: 0.5px solid $defaultRightBorderColor;

   .card-footer {
     border-top: 0.5px solid $defaultRightBorderColor;
   }
 }

 .card-author {
   font-size: 1.2rem;
   font-weight: 600;
   color: #425363;
   text-decoration: none;
 }

  .card-post_time {
    color: gray;
  }


 .area-carousel{
   max-height: 80vw;
 }

 .area-click {
   cursor: pointer;
 }


 .Markdown {
   font-family: 'Source Serif Pro', serif;
   font-size: 120%;
   line-height: 150%;
 }

 .Markdown, .ReplyEditor__body.rte {
   overflow-wrap: break-word;
   word-wrap: break-word;
   word-break: break-word;
   -webkit-hyphens: none;
   -ms-hyphens: none;
   hyphens: none;
 }

 .Markdown h1, .Markdown h2, .Markdown h3, .Markdown h4, .Markdown h5, .Markdown h6, .ReplyEditor__body.rte h1, .ReplyEditor__body.rte h2, .ReplyEditor__body.rte h3, .ReplyEditor__body.rte h4, .ReplyEditor__body.rte h5, .ReplyEditor__body.rte h6 {
   font-family: "Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;
   font-weight: 600;
 }

 .Markdown h1, .ReplyEditor__body.rte h1 {
   margin: 2.5rem 0 .3rem;
   font-size: 160%;
 }

 .Markdown h2, .ReplyEditor__body.rte h2 {
   margin: 2.5rem 0 .3rem;
   font-size: 140%;
 }

 .Markdown h3, .ReplyEditor__body.rte h3 {
   margin: 2rem 0 0.3rem;
   font-size: 120%;
 }

 .Markdown h4, .ReplyEditor__body.rte h4 {
   margin: 1.5rem 0 0.2rem;
   font-size: 110%;
 }

 .Markdown h5, .ReplyEditor__body.rte h5 {
   margin: 1rem 0 0.2rem;
   font-size: 100%;
 }

 .Markdown h6, .ReplyEditor__body.rte h6 {
   margin: 1rem 0 0.2rem;
   font-size: 90%;
 }

 .Markdown code, .ReplyEditor__body.rte code {
   padding: 0.2rem;
   font-size: 85%;
   border-radius: 3px;
   border: none;
   background-color: #F4F4F4;
   font-weight: inherit;
   overflow: scroll;
 }

 .Markdown pre > code, .ReplyEditor__body.rte pre > code {
   display: block;
 }

 .Markdown strong, .ReplyEditor__body.rte strong {
   font-weight: 600;
 }

 .Markdown ol, .Markdown ul, .ReplyEditor__body.rte ol, .ReplyEditor__body.rte ul {
   margin-left: 2rem;
 }

 .Markdown table td, .ReplyEditor__body.rte table td {
   word-break: normal;
 }

 .Markdown p, .ReplyEditor__body.rte p {
   font-size: 100%;
   line-height: 150%;
   margin: 0 0 0.5rem 0;
 }

 .Markdown img, .ReplyEditor__body.rte img {
   width: auto;
   max-width: 100%;
   height: auto;
   max-height: none;
 }

 .Markdown iframe, .ReplyEditor__body.rte iframe {
   max-width: 100%;
   max-height: 75vw;
 }

 .Markdown div.pull-right, .ReplyEditor__body.rte div.pull-right {
   float: right;
   padding-left: 1rem;
   max-width: 50%;
 }

 .Markdown div.pull-left, .ReplyEditor__body.rte div.pull-left {
   float: left;
   padding-right: 1rem;
   max-width: 50%;
 }

 .Markdown div.text-justify, .ReplyEditor__body.rte div.text-justify {
   text-align: justify;
 }

 .Markdown div.text-right, .ReplyEditor__body.rte div.text-right {
   text-align: right;
 }

 .Markdown div.text-center, .ReplyEditor__body.rte div.text-center {
   text-align: center;
 }

 .Markdown div.text-rtl, .ReplyEditor__body.rte div.text-rtl {
   direction: rtl;
 }

 .Markdown div.videoWrapper, .ReplyEditor__body.rte div.videoWrapper {
   width: 100%;
   height: 0;
   padding-bottom: 56.2%;
   position: relative;
 }

 .Markdown div.videoWrapper iframe, .ReplyEditor__body.rte div.videoWrapper iframe {
   position: absolute;
   width: 100%;
   height: 100%;
   left: 0;
   top: 0;
 }

</style>
