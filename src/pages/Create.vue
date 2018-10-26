<template>
  <v-container grid-list-xl>
    <v-layout>
      <v-flex xs12 sm4 md4>
        <v-select
          :items="categories"
          v-model="category"
          label="카테고리"
        ></v-select>
      </v-flex>
      <v-flex xs12 sm4 md6>
        <v-text-field placeholder="제목" v-model="title"></v-text-field>
      </v-flex>
      <v-flex xs12 sm4 md2 justify-end>
        <v-btn class="submitBtn" v-on:click="submitBtn" style="background-color:blue; color:white;">Submit</v-btn>
      </v-flex>
    </v-layout>

    <v-layout row justify-space-between>
      <v-flex xs12 sm6 md4>
        <div class="thumbnail">
          <v-layout flex align-center justify-center>
            <v-flex id="thubnailCard" xs5 style="padding-left:0px;">
              <div justify-center v-for="(item, i) in contents" :key="i" @click="selectCard(i)">
                <v-card-title v-if="i === 0" class="black--text" >표지</v-card-title>
                <v-card-title v-else-if="i > 0" class="black--text" >{{ i }}</v-card-title>
                <v-card style="width:140px; border-style:solid; border-width:0.5px; border-color: rgba(0,0,0,0.3);">
                  <v-img v-if="item.url"
                    class="black--text"
                    height="130px"
                    :src="item.url"
                  >
                    <v-container fill-height fluid>
                      <v-layout fill-height>
                        <v-flex xs12 align-end flexbox>
                          <span class="white--text">Test</span>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-img>
                  <div v-else>
                    <v-img
                      width="130px"
                      src="https://user-images.githubusercontent.com/24529218/46792326-16fc3180-cd7e-11e8-80dc-2842504d6b52.png"
                      height="130px"
                    ></v-img>
                  </div>
                  <v-card-title>
                    <div style="height:100px;">
                      <span v-if="!item.text" class="grey--text">Input text</span>
                      <span>{{ item.text }}</span><br>
                    </div>
                  </v-card-title>
                </v-card>
              </div>
            </v-flex>
          </v-layout>

          <!-- add button -->
          <v-layout justify-center>
            <v-flex xs12 sm3>
              <v-btn flat icon color="grey" @click="addCard">
                <v-icon>add</v-icon>
              </v-btn>
              <span style="color:grey;">카드추가</span>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>

      <!-- content card -->
      <v-layout><v-flex>
        <v-btn flat icon color="black" theme--dark backgroud-color="black" @click="navigation(selected, 'back')">
          <v-icon>arrow_left</v-icon>
        </v-btn>
      </v-flex></v-layout>
      <v-layout flex align-center justify-center >
        <v-flex>
          <h3 style="margin-left:50px;">스티커</h3> <br>
          <v-card class="contentCard">
            <input v-if="!url" style="box-shadow: none !important;"id ="inputbox" type="file" class="form-control" @change="upload">
            <div v-else id="inputbox" style="box-shadow: none !important;">
              <v-img v-if="url"
                height="250px"
                width="268px"
                :src="url"
              ></v-img>
              <v-btn fab
                icon
                top
                right
                absolute
                small
                color="white"
                style="width:10%; height:5%; margin-top:25px;"
                @click="removeImg(selected)">
                <v-icon>delete</v-icon>
              </v-btn>
            </div>

            <v-flex id ="textinput"  class="black-text" style="height:250px;" >
              <v-textarea
                box
                rows="12"
                label="Input Text"
                background-color="white"
                color="black"
                theme--light
                v-model="text"
                @keyup="bindText"
              ></v-textarea>
            </v-flex>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout><v-flex>
        <v-btn flat icon color="black" theme--dark backgroud-color="black" @click="navigation(selected, 'next')">
          <v-icon>arrow_right</v-icon>
        </v-btn>
      </v-flex></v-layout>

      <!-- sidebar -->
      <v-layout align-end class="toolbar" justify-space-between column fill-height
        style="  margin-top: 0px; margin-bottom: 0px;"
      >
        <v-flex class="py-2">
          <br><br><br>
          <!-- toolbar -->
          <div>
            <h3>도구</h3>
            <v-expansion-panel>
              <v-expansion-panel-content>
               <div slot="header">레이아웃</div>
               <v-card>
                 <v-btn-toggle v-model="toggle_exclusive">
                   <v-btn flat>
                     <v-icon>format_align_left</v-icon>
                   </v-btn>
                   <v-btn flat>
                     <v-icon>format_align_center</v-icon>
                   </v-btn>
                   <v-btn flat>
                     <v-icon>format_align_right</v-icon>
                   </v-btn>
                   <v-btn flat>
                     <v-icon>format_align_justify</v-icon>
                   </v-btn>
                 </v-btn-toggle>
              </v-card>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <br><br><br>
          </div>
          <!-- tag section -->
          <div>
            <h3>태그</h3>
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

          <h3>보상 설정</h3>
          <v-select
            :items="rewards"
            v-model="reward"
            label="보상"
            solo
          ></v-select>
        </v-flex>
      </v-layout>
      <br>
    </v-layout>
  </v-container>
</template>

<script>
  /* eslint-disable */
  import api from '@/api/posts'
  import steem from '@/services/steem'
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
      width: 300,
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
    navigation: function(i, arrow) {
      if (arrow=='back'&& this.selected!=0) {
        this.selected = i - 1;
        this.url = this.contents[this.selected].url
        this.text = this.contents[this.selected].text
      }
      if (arrow=='next' && this.selected < this.contents.length-1) {
        this.selected = i + 1;
        this.url = this.contents[this.selected].url
        this.text = this.contents[this.selected].text
      }
    },
    removeImg: function(i) {
      this.url = null;
      this.contents[i].url = null;
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
      this.contents.push({url: null, text: ''})
      // this.selected = this.contents.length - 1
    },
    // callObj: function () {
    //   this.axios.get('http://localhost:4000/posts').then((response) => {
    //     let contents = response.data[0].contents.content
    //     for (let item in contents) {
    //       this.contents.push(contents[item])
    //     }
    //     this.contentlen = this.contents.length
    //   })
    // },
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
    submitBtn: function () { // create the contents
      this.contents.forEach((item, i) => {
        if (!item.url && !item.text) {  // remove empty card
          this.contents.splice(i, 1)
        }
      })
      if (!this.contents.length) {
        alert('내용을 작성해주세요')
        return
      }

      let vm = this
      let data = {
        category: this.category,
        author: this.$store.state.me.account.name,
        title: this.title,
        contents: this.contents,
        json_metadata: {
          tags: this.tags,
          format: 'html'
        }
      }
      let steemContentsBody = '<html>'
      for (let i in this.contents) {
        let img = this.contents[i].url ? '<p><img src="' + this.contents[i].url + '"></p>' : ''
        let text = this.contents[i].text ? '<p>' + this.contents[i].text + '</p>' : ''
        steemContentsBody += img + text + '<br>'
      }
      steemContentsBody += '</html>'

      api.create(data)
        .then(res => {
          data.permlink = res.data.permlink

          steemconnect.comment('', 'steeck', data.author, data.permlink, data.title, steemContentsBody, data.json_metadata)
            .then(res => {
              console.log('works')
              console.log(res)

              let commentOptionsConfig = {
                author: data.author,
                permlink: data.permlink,
                allow_votes: true,
                allow_curation_rewards: true,
                max_accepted_payout: '1000000.000 SBD',
                percent_steem_dollars: 10000,
                extensions: [[0, { beneficiaries: [{ account: 'steeck', weight: 1500 }] }]]
              };

              if (vm.reward === 'all') {
                commentOptionsConfig.percent_steem_dollars = 0;
              } else if (vm.reward === 'none') {
                commentOptionsConfig.max_accepted_payout = '0.000 SBD';
              }
              steemconnect.broadcast([['comment_options', commentOptionsConfig]])
                .then(res => {
                  console.log(res)
                })
                .catch(error => {
                  console.log('err', error)
                })
            })
            .catch(err => {
              api.delete(permlink)
                .then(res2 => {
                  console.log(permlink, 'deleted')
                  console.log('del res',res2)
                })
                .catch(error => {
                  console.log('api del error', error)
                })
            })
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
#inputbox {
  height:250px;
  width:270px;
  box-shadow: none !important;
  background-color:rgb(224, 224, 224,0.3);
}


<style lang="scss" scoped>
@import 'main.scss'

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
  .contentCard {
    height: 507.5px;
    width: 270px;
    /* margin-left: 50px; */
    border-style: solid;
    border-width: 0.5px;
    border-color: rgba(0,0,0,0.3);
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
