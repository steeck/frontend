<template>
  <div>
    <div v-if="$vuetify.breakpoint.xsOnly">
      <!-- <a class="btn-link" @click="dialog = true">댓글 {{ list.length }}</a> -->
      <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        scrollable
      >
        <v-card tile>
          <v-toolbar card dark color="#6633ff">
            <v-btn icon dark @click="close()">
              <v-icon>close</v-icon>
            </v-btn>
            <span class="font-weight-bold">댓글보기</span>
          </v-toolbar>
          <v-card-text>
            <card-comment v-for="(item, index) in list" :item="item" :key="'c_' + index"></card-comment>
          </v-card-text>
          <v-footer
            height="auto"
            color="#f6f6f6"
          >
            <v-layout row wrap pa-2>
              <v-flex xs10>
                <v-text-field
                  solo
                  v-model="inputBody"
                ></v-text-field>
              </v-flex>
              <v-flex xs2 class="text-xs-right">
                <v-btn outline color="#6633ff" style="background-color: #fff !important" class="btn-comment" v-if="markedBody === ''">작성</v-btn>
                <v-btn dark color="#6633ff" class="btn-comment" :loading="processComment" v-else @click="pushComment">작성</v-btn>
              </v-flex>
            </v-layout>
                <!-- <v-alert :value="actionFail" type="error" transition="scale-transition">
                  작업을 완료하지 못했습니다.
                </v-alert> -->
                <!--작성 영역-->
                <!-- <v-flex xs12 pa-0 ma-0>
                  <v-textarea
                    :label="'Comment to \'' + item.author + '\''"
                    auto-grow solo
                    v-model="inputBody" :disabled="processComment"
                  ></v-textarea>
                </v-flex> -->
                <!--버튼 영역-->
                <!-- <v-flex xs12 class="text-xs-right pt-0">
                  <v-btn color="primary" :loading="processComment" :disabled="markedBody === ''" @click="pushComment">작성</v-btn>
                  <v-btn @click="condition.openEdit = false" :disabled="processComment">취소</v-btn>
                </v-flex>
              </v-flex> -->
          </v-footer>
        </v-card>
      </v-dialog>
    </div>
    <div v-else>
      <v-slide-y-transition class="py-0" tag="div">
        <div v-if="dialog">
          <card-comment v-for="(item, index) in list" :item="item" :key="'c_' + index"></card-comment>
          <v-layout row wrap pa-2>
            <v-flex xs10>
              <v-text-field
                solo
                v-model="inputBody"
              ></v-text-field>
            </v-flex>
            <v-flex xs2 class="text-xs-right">
              <v-btn block outline color="#6633ff" style="background-color: #fff !important" class="btn-comment" v-if="markedBody === ''">작성</v-btn>
              <v-btn block dark color="#6633ff" class="btn-comment" :loading="processComment" v-else @click="pushComment">작성</v-btn>
            </v-flex>
          </v-layout>
        </div>
      </v-slide-y-transition>
    </div>
  </div>
</template>

<script>
  import steem from '@/services/steem'
  import steemutil from '@/mixins/steemutil'
  import steemconnect from '@/services/steemconnect'
  import EditComment from '@/components/post/EditComment'
  import CardComment from '@/components/post/CardComment'
  import api from '@/api/steecky'
  import Remarkable from 'remarkable'
  let md = new Remarkable({html: true, linkify: true, linkTarget: '_blank'})

  export default {
    name: 'Comment',
    mixins: [steemutil],
    props: ['list', 'item', 'show', 'complete'],
    components: {
      EditComment,
      CardComment
    },
    data () {
      return {
        dialog: false,
        transition: false,
        inputBody: '',
        processComment: false,
        actionFail: false
      }
    },
    computed: {
      markedBody: function () {
        return this.inputBody ? md.render(this.inputBody) : ''
      }
    },
    mounted () {
      this.dialog = this.show
    },
    methods: {
      loadComment: function () {
        steem.api.getContentRepliesAsync(this.item.author, this.item.permlink)
          .then((res) => {
            this.list = res
            // console.log(res)
          })
      },
      completeComment: function () {
        this.loadComment()
      },
      pushComment: function () {
        if (!this.$store.state.auth.username) {
          alert('로그인 후 이용이 가능합니다')
          return
        }
        // console.log('pushComment')
        let vm = this
        this.processComment = true
        let parentAuthor = this.item.author
        let parentPermlink = this.item.permlink
        let author = this.$store.state.auth.username
        let permlink = 'steeck-cmt-' + Math.random().toString(36).substring(2)
        let title = ''
        let body = this.inputBody
        let jsonMetadata = ''
        steemconnect.setAccessToken(this.$store.state.auth.accessToken)
        steemconnect.comment(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata)
          .then((res) => {
            console.log(res)
            vm.inputBody = ''
            vm.complete()
            // vm.condition.openEdit = false
            vm.processComment = false
            vm.createSteecky()
          })
          .catch(err => {
            console.log(err)
            vm.actionFail = true
            vm.processComment = false
          })
      },
      close: function () {
        this.dialog = false
        this.$emit('child-event', false)
      },
      createSteecky: function () {
        if (!this.$store.state.auth.username) {
          return
        }

        api.create({username: this.$store.state.auth.username, type: 'comment', permlink: this.item.permlink})
          .then(res => {
            console.log(res)
          }).catch(error => {
            console.log(error)
          })
      }
    }
  }
</script>

<style scoped>
.btn-link {
  color: #425363 !important;
  font-weight: 600;
}
.btn-vote {
  position: relative;
  margin: 0;
  width: 20px;
  height: 20px;
}
.btn-comment {
  padding: 0 12px!important;
  min-width: 10px;
  margin: 0;
  height: 48px;
  /* background-color: #6644ff !important;
  color: #fff !important; */
}
/* .btn-comment.theme--light.v-btn.v-btn--disabled:not(.v-btn--icon):not(.v-btn--flat) {
  background-color: #fff !important;
  color: #6644ff !important;
  border: 1px solid #6644ff;
} */
.v-menu__content {
  background-color: #fff;
  padding-bottom: 8px;
}
.percent {
  font-size: 0.8em;
}
.vote-text {
  color: #333;
  font-size: 0.9em;
}
>>>.v-footer {
  min-height: 64px;
}
>>>.v-input__slot {
  margin-bottom: 0;
}
>>>.v-text-field__details {
  display: none;
}
</style>
