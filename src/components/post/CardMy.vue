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
      <v-layout column v-if="postType === 'post'" @click="jumpToPost" class="area-click">
        <div class="headline">{{ item.title }}</div>
        <div class="grey--text text-truncate">{{ this.bodyChip }}</div>
      </v-layout>
      <v-layout column v-else-if="postType === 'comment'">
        <div class="headline">RE : {{ this.bodyChip}}</div>
      </v-layout>
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
  import CardMenu from '@/components/post/Menu'

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
      }
    },
    methods: {
      jumpToPost: function () {
        let url = '/' + this.item.category + '/' + this.item.author + '/' + this.item.permlink
        this.$router.push(url)
      }
    },
    mounted () {
      // console.log(this.postType)
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

</style>
