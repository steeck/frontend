<template>

  <v-card  class="pl-3 pr-3 card-my-page mt-2 mb-2">
    <v-card-text>
      <v-layout justify-space-between align-center xs12 row>
        <v-flex d-inline-block>
          <v-avatar size="80" color="grey lighten-4" >
            <v-img v-if="author.json_metadata.profile.profile_image !== ''" :src="author.json_metadata.profile.profile_image" contain></v-img>
            <v-icon v-else :size="80">sentiment_satisfied_alt</v-icon>
          </v-avatar>
          <v-flex d-inline-block>
            <div>{{ item.author }}</div>
            <div>{{ this.createdTime | ago}}</div>
          </v-flex>
        </v-flex>
        <v-menu d-inline-block>
          <v-btn slot="activator" icon >
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list class="card-more">
            <v-list-tile @click="">
              <v-list-tile-title>공유하기</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="" >
              <v-list-tile-title>팔로우 취소</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="" >
              <v-list-tile-title>다운보트</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="" >
              <v-list-tile-title>신고하기</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-layout>
    </v-card-text>
    <v-card-title>
      <v-layout column>
        <div class="headline">{{ item.title }}</div>
        <div class="grey--text">{{ this.bodyChip}}</div>
      </v-layout>
    </v-card-title>
    <v-card-text v-if="jsonMetadata.image.length > 0">
      <v-carousel :style="'height:20rem'">
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
              <v-icon>monetization_on</v-icon>
              <span>{{ getPayoutValue }}</span>
            </v-layout>
          </v-flex>
          <v-flex d-inline-block>
            <v-layout align-center>
              <v-icon>chat_bubble_outline</v-icon>
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
  import steem from '@/services/steem'
  export default {
    name: 'CardMy',
    props: ['item'],
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
      // 글 본문내용 중 일부를 반환
      bodyChip: function () {
        let tmp = this.item.body.split('\n').join(' ')
        return tmp.substring(0, tmp.length < 30 ? tmp.length : 30) + (tmp.length < 30 ? '' : '...')
      },
      getPayoutValue: function () {
        // console.log(this.item.content.pending_payout_value)
        return parseFloat(this.item.pending_payout_value.replace(' SBD', '')).toFixed(2)
      }
    },
    methods: {
      // 작성자 정보를 확인
      getAuthor () {
        let vm = this
        steem.api
          .callAsync('get_accounts', [[this.item.author]])
          // .call('get_accounts', [['ura-soul']])
          .then(function (result) {
            result[0].json_metadata = result[0].json_metadata ? Object.assign(vm.author.json_metadata, JSON.parse(result[0].json_metadata)) : vm.author.json_metadata
            vm.author = result[0]
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    mounted () {
      // console.log(this.item)
      this.jsonMetadata = Object.assign(this.jsonMetadata, JSON.parse(this.item.json_metadata))
      this.getAuthor()
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

</style>
