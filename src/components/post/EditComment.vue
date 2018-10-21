<template>
    <v-layout column>
      <!--실패시-->
      <v-alert :value="actionFail" type="error" transition="scale-transition">
        작업을 완료하지 못했습니다.
      </v-alert>
      <!--작성 영역-->
      <v-flex d-block ma0>
        <v-textarea :label="'Comment to \'' + item.author + '\''" solo v-model="inputBody" :disabled="processComment"></v-textarea>
      </v-flex>
      <!--버튼 영역-->
      <v-flex>
        <v-btn color="primary" :loading="processComment" :disabled="markedBody === ''" @click="pushComment">저장</v-btn>
        <v-btn @click="condition.openEdit = false" :disabled="processComment">취소</v-btn>
        <!--<v-btn @click="processComment = !processComment">test</v-btn>-->
      </v-flex>
      <!--미리보기 영역-->
      <v-flex v-if="markedBody !== ''">
        <v-flex tag="small">preview</v-flex>
        <v-flex d-block v-html="markedBody" class="MarkdownViewer Markdown elevation-3 pa-2"></v-flex>
      </v-flex>
    </v-layout>
</template>

<script>
  import steemconnect from '@/services/steemconnect'
  // import steem from '@/services/steem'
  import Remarkable from 'remarkable'
  let md = new Remarkable({html: true, linkify: true, linkTarget: '_blank'})

  export default {
    name: 'EditComment',
    props: {
      item: {
        type: Object
      },
      condition: {
        type: Object
      },
      complete: {
        type: Function
      }
    },
    data: function () {
      return {
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
    methods: {
      pushComment: function () {
        console.log('pushComment')
        this.processComment = true
        let parentAuthor = this.item.author
        let parentPermlink = this.item.permlink
        let author = this.$store.state.me.account.name
        let permlink = 'steeck-' + Math.random().toString(36).substring(2)
        let title = ''
        let body = this.inputBody
        let jsonMetadata = ''
        steemconnect.setAccessToken(this.$store.state.auth.accessToken)
        steemconnect.comment(parentAuthor, parentPermlink, author, permlink, title, body, jsonMetadata)
          .then((res) => {
            console.log(res)
            this.complete()
            this.condition.openEdit = false
            this.processComment = false
          })
          .catch(err => {
            console.log(err)
            this.actionFail = true
            this.processComment = false
          })
      }
    },
    mounted: function () {
    },
    destroyed: function () {
      this.actionFail = false
      this.inputBody = ''
    }
  }
</script>

<style scoped>

</style>
