<template>
  <v-container grid-list-xl>
    <v-layout row wrap>
      <v-flex xs12 sm3 md2>
        <v-btn flat outline color="grey" @click="addCard">
          <v-icon>add</v-icon> <span style="color:grey;">카드추가</span>
        </v-btn>
      </v-flex>
      <v-flex xs12 sm3 md2>
        <v-select
          :items="categories"
          v-model="category"
          label="카테고리"
        ></v-select>
      </v-flex>
      <v-flex xs12 sm4 md6>
        <v-text-field placeholder="제목" v-model="title"></v-text-field>
      </v-flex>
      <v-flex xs12 sm2 md2 justify-end>
        <v-btn
          round flat outline
          color="deep-purple"
          v-on:click="publish"
        >
          발행하기
        </v-btn>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12 sm4 md2>
        <div class="preview mb-5" justify-center v-for="(item, i) in contents" :key="i">
          <v-layout row wrap>
            <v-flex xs6 class="py-0">
              <v-btn
                class="ma-0"
                small
                flat
                :color="selected === i ? 'indigo' : ''"
                @click="selectCard(i)"
              >
                <span v-if="i === 0">표지</span>
                <span v-else>{{ i }}</span>
              </v-btn>
            </v-flex>
            <v-flex xs6 class="py-0 text-lg-right">
              <v-btn
                v-if="i !== 0"
                class="ma-0"
                small
                flat
                @click="removeCard(i)"
              >Del</v-btn>
            </v-flex>
          </v-layout>
          <div @click="selectCard(i)">
            <v-card>
              <v-img
                class="preview-img"
                :src="item.url ? item.url : 'https://user-images.githubusercontent.com/24529218/46792326-16fc3180-cd7e-11e8-80dc-2842504d6b52.png'"
              ></v-img>
              <v-card-text class="preview-text">
                {{ item.text }}
              </v-card-text>
            </v-card>
          </div>
        </div>
      </v-flex>

      <v-flex xs12 sm6 md8>
        <v-layout flex align-center justify-center>
          <v-flex xs1>
            <v-btn flat icon color="black" theme--dark backgroud-color="black" @click="navigation('prev')">
              <v-icon>arrow_left</v-icon>
            </v-btn>
          </v-flex>

          <v-flex xs10>
            <h3 class="mb-3">스티커</h3>
            <div class="editor">
              <input v-if="!url" type="file" class="file-upload" @change="upload">
              <div v-else style="box-shadow: none !important;">
                <v-img v-if="url"
                  height="250px"
                  :src="url"
                ></v-img>
                <v-btn fab
                  icon
                  top
                  right
                  absolute
                  small
                  color="white"
                  class="mt-4"
                  @click="removeImg(selected)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </div>
              <div class="pa-3">
                <textarea
                  box
                  rows="12"
                  v-model="text"
                  class="text-field"
                  @keyup="bindText"
                ></textarea>
              </div>
            </div>
          </v-flex>

          <v-flex xs1>
            <v-btn flat icon color="black" theme--dark backgroud-color="black" @click="navigation('next')">
              <v-icon>arrow_right</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex xs12 sm4 md2>
        <div>
          <h3 class="mb-3">태그</h3>
          <v-card>
            <v-flex>
              <v-text-field v-model="tag"
                label="태그단어"
                single-line
                v-on:keyup.enter="addTag"
              ></v-text-field>
              <v-layout row wrap align-center >
                <v-btn v-for="(tag, i) in tags" :key="i"
                  class="black--text caption"
                  depressed small
                  round
                  outline color="indigo"
                  @click="removeTag(i)"
                >{{ tag }}</v-btn>
              </v-layout>
            </v-flex>
          </v-card>
        </div>
        <br><br><br>

        <h3 class="mb-3">보상 설정</h3>
        <v-select
          :items="rewards"
          v-model="reward"
          label="보상"
          solo
        ></v-select>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from '@/api/posts'
// import steem from '@/services/steem'
import steemconnect from '@/services/steemconnect'
// import vue2Dropzone from 'vue2-dropzone'
// import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  data () {
    return {
      selected: 0,
      url: '',
      text: '',
      tag: '',
      categories: [
        { value: 'hot', text: '핫이슈' },
        { value: 'crypto', text: '암호화폐' },
        { value: 'fashion', text: '패션·뷰티' },
        { value: 'life', text: '라이프' },
        { value: 'travel', text: '여행' },
        { value: 'culture', text: '문화·예술' },
        { value: 'lesson', text: '어학·강좌' },
        { value: 'car', text: '차·테크' },
        { value: 'game', text: '게임' },
        { value: 'food', text: '푸드' },
        { value: 'essey', text: '공감·에세이' },
        { value: 'sponsor', text: '스폰서' }
      ],
      rewards: [
        { value: 'all', text: '100% 스팀파워' },
        { value: 'half', text: '50% 스팀달러와 50% 스팀파워' },
        { value: 'none', text: '보상거절' }
      ],
      reward: 'half',
      category: '',
      title: '',
      contents: [{url: null, text: ''}],
      tags: ['steeck'],
      toggle_exclusive: 2,
      toggle_multiple: [0, 1, 2],
      submit: false,
      width: 300
      // dropzoneOptions: {
      //   // url: (file) => this.saveImages(file),
      //   url: 'https://httpbin.org/post',
      //   // thumbnailWidth: 150,
      //   // headers: { "My-Awesome-Header": "header value" },
      //   params: () => {
      //     return ({id: 'testingid'})
      // }
    }
  },
  components: {
    // vueDropzone: vue2Dropzone
  },
  mounted () {
    steemconnect.setAccessToken(this.$store.state.auth.accessToken)
  },
  methods: {
    addTag: function (e) {
      if (!this.tag || this.tags.indexOf(this.tag) >= 0) {
        return
      }
      if (this.tags.length >= 5) {
        alert('태그는 5개까지 가능합니다.')
        return
      }
      this.tags.push(this.tag)
      this.tag = ''
    },
    removeTag: function (index) {
      if (index === 0 || this.tags[index] === 'steeck') {
        return
      }
      this.tags.splice(index, 1)
    },
    navigation: function (direction) {
      if (direction === 'prev' && this.selected !== 0) {
        this.selected--
        this.url = this.contents[this.selected].url
        this.text = this.contents[this.selected].text
      } else if (direction === 'next' && this.selected < this.contents.length - 1) {
        this.selected++
        this.url = this.contents[this.selected].url
        this.text = this.contents[this.selected].text
      }
    },
    removeImg: function (i) {
      this.url = null
      this.contents[i].url = null
    },
    selectCard: function (index) {
      this.selected = index
      this.url = this.contents[this.selected].url
      this.text = this.contents[this.selected].text
    },
    bindText: function () {
      this.contents[this.selected].text = this.text
    },
    addCard: function () {
      this.contents.push({ url: null, text: '' })
      this.selected++
      this.selectCard(this.selected)
    },
    removeCard: function (index) {
      this.contents.splice(index, 1)
      if (index <= this.selected) {
        this.selected--
        this.selectCard(this.selected)
      }
    },
    upload: async function (event) {
      let vm = this
      let file = event.target.files
      let formData = new FormData()
      formData.append('file', file[0])
      api.upload(formData).then(res => {
        vm.contents[vm.selected].url = res.data.Location
        vm.url = res.data.Location
      })
    },
    publish: function () { // create the contents
      this.contents.forEach((item, i) => {
        if (!item.url && !item.text) {  // remove empty card
          this.contents.splice(i, 1)
        }
      })
      if (!this.contents.length) {
        alert('내용을 작성해주세요')
        return
      }

      let data = {
        category: this.category,
        author: this.$store.state.me.account.name,
        title: this.title,
        contents: this.contents,
        layout: { 'width': '700', 'height': '700', 'layout': 'bottom' },
        pending_payout_value: (Math.random() * 100).toFixed(3),
        children: 8,
        net_votes: 13,
        json_metadata: {
          tags: this.tags,
          format: 'html'
        }
      }

      api.create(data)
        .then(res => {
          data.permlink = res.data.permlink

          // @TODO 스팀에 브로드캐스팅은 나중에...
          // let steemContentsBody = '<html>'
          // for (let i in data.contents) {
          //   let img = data.contents[i].url ? '<p><img src="' + data.contents[i].url + '"></p>' : ''
          //   let text = data.contents[i].text ? '<p>' + data.contents[i].text + '</p>' : ''
          //   steemContentsBody += img + text + '<br>'
          // }
          // steemContentsBody += '</html>'
          // steemconnect.comment('', 'steeck', data.author, data.permlink, data.title, steemContentsBody, data.json_metadata)
          //   .then(res => {
          //     console.log('works')
          //     console.log(res)
          //
          //     let commentOptionsConfig = {
          //       author: data.author,
          //       permlink: data.permlink,
          //       allow_votes: true,
          //       allow_curation_rewards: true,
          //       max_accepted_payout: '1000000.000 SBD',
          //       percent_steem_dollars: 10000,
          //       extensions: [[0, { beneficiaries: [{ account: 'steeck', weight: 1500 }] }]]
          //     }
          //
          //     if (vm.reward === 'all') {
          //       commentOptionsConfig.percent_steem_dollars = 0
          //     } else if (vm.reward === 'none') {
          //       commentOptionsConfig.max_accepted_payout = '0.000 SBD'
          //     }
          //     steemconnect.broadcast([['comment_options', commentOptionsConfig]])
          //       .then(res => {
          //         console.log(res)
          //       })
          //       .catch(error => {
          //         console.log('err', error)
          //       })
          //   })
          //   .catch(err => {
          //     if (err) {}
          //     api.delete(data.permlink)
          //       .then(res2 => {
          //         console.log(data.permlink, 'deleted')
          //       })
          //       .catch(error => {
          //         console.log('api del error', error)
          //       })
          //   })
          alert('새로운 글이 등록되었습니다.')
          this.$router.push('/posts/' + res.data.id)
        })
        .catch(error => {
          console.log('err', error)
        })
    }
  }
}
</script>

<style>
.v-navigation-drawer {
  transition: none !important;
}

.lightbox {
  box-shadow: 0 0 20px inset rgba(0, 0, 0, 0.2);
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.4) 0%, transparent 72px);
}
#textinput {
  padding: 0px 0px 0px 1px;
  height:250px;
  width:268px;
  color: black;
}

.preview-img {
  height: 40%;
}
.preview-text {
  padding: 0.5rem;
  font-size: 0.8rem;
  height: 120px;
  overflow: hidden;
  border-top: 1px solid #ddd;
}

.editor {
  position: relative;
  border-style: solid;
  border-width: 0.5px;
  border-color: rgba(0,0,0,0.3);
}
.editor .file-upload {
  width: 100%;
  height:250px;
  box-shadow: none !important;
  background-color: rgb(224, 224, 224, 0.3);
}
.editor .text-field {
  width: 100%;
}






  .background {
    color: grey;
  }

  .dropbox {
    outline: 2px dashed grey; /* the dash box */
    outline-offset: -10px;
    background: lightcyan;
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }

  .inputbox:hover {
    background: lightblue; /* when mouse over to the drop zone, change color */
  }

  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }

  .thumbnail {
    /* background-color: white; */
    height: 600px;
    width: 100%;
    overflow: auto;
  }
  .toolbar {
    width: 145px;
    margin-top: 0px;
  }
  .submitBtn {
    margin-bottom: 0px;
    float: right;
    border-radius:50px;
    background-color: blue;
    color: white;
  }
  .topToolbar {
    margin-top: 0px;
    margin-bottom: 0px;
    top: 0px;
    height: 50px;
  }
  #thumbnailCard {
    width: 150px;
    border-width:0.5px;
    border-color: rgba(0,0,0,0.3);
  }
  #hasbtn{
    width:30px;
    height:20px;
  }
  .v-btn {
    min-width: 0;
  }
</style>
