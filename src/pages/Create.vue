<template>
  <v-container grid-list-xl style="padding-top: 0px; margin-left:0px;">
    <v-layout class="topToolbar" justify-end>
      <v-btn class="submitBtn" v-on:click="submitBtn" style="background-color:blue; color:white;">Submit</v-btn>
    </v-layout>

    <v-layout row justify-space-between>
      <v-flex xs12 sm6 md4>
        <div class="thumbnail">
          <v-layout flex align-center justify-center>
            <v-flex id="thubnailCard" xs5 style="padding-left:0px;">
              <div justify-center v-for="(item, i) in contents" :key="i" @click="selectCard(i)">
                <v-card-title v-if="i == 0" class="black--text" >표지</v-card-title>
                <v-card-title v-if="i > 0" class="black--text" >{{i}}</v-card-title>
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
              <v-expansion-panel-content>
                <div slot="header">글쓰기 도구</div>
                <v-card>
                  <v-btn-toggle v-model="toggle_multiple" multiple>
                    <v-btn flat>
                      <v-icon>format_bold</v-icon>
                    </v-btn>
                    <v-btn flat>
                      <v-icon>format_italic</v-icon>
                    </v-btn>
                    <v-btn flat>
                      <v-icon>format_underlined</v-icon>
                    </v-btn>
                    <v-btn flat>
                      <v-icon>format_color_fill</v-icon>
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
                <v-text-field v-model="tagtext"
                  label="태그단어"
                  single-line
                  v-on:keyup.space="tagtext += '#'"
                  v-on:change="hashtag"
                ></v-text-field>
                <v-layout row wrap align-center >
                  <v-btn v-for="(thing, i) in tagarray" :key="i"
                    class="black--text"
                    depressed small
                    round
                    style="width:35%;font-size:65%;"
                    outline color="indigo"
                  >{{ thing }}</v-btn>
                </v-layout>
                <br>
              </v-flex>
            </v-card>
          </div>
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
// import vue2Dropzone from 'vue2-dropzone'
// import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  data () {
    return {
      selected: 0,
      url: '',
      text: '',
      contents: [{url: null, text: ''}],  // array of each page content ex. [0] = title page [1]
      tagtext: '#',  // tag inputed
      tagarray: [],
      username: '', //username of steem user
      permlink: '',
      wif: '', //steem posting permission

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
    steem.config.set('websocket','wss://testnet.steem.vc')
    steem.config.set('address_prefix', 'STX')
    steem.config.set('chain_id', '79276aea5d4877d9a25892eaa01b0adf019d3e5cb12a97478df3298ccdd01673')
    // this.callObj()
    this.username = this.$store.state.me.account.name
    this.wif = this.$store.state.me.account.posting.key_auths[0][0]

    // steem.api.getAccounts(['dhdmstjs', 'smtion'], function(err, response){
    //   console.log('testaa', response[0].posting.key_auths[0][0]);
    //   console.log(err, response);
    //
    // })
    steem.config.set('testing', 'hellod')
    steem.config.get('testing')
    console.log('sttem', steem.config.get('testing'));
  },
  methods: {
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
    hashtag: function () {
      this.tagarray = []
      console.log('tag', this.tagtext)
      let split = this.tagtext.split(' ')
      let arr = [] // array to send to db
      for (let item in split) {
        if (split[item].length > 1) {
          this.tagarray.push(split[item])
          // send to db
        }
      }
      console.log('arr', arr)
      // send info to db
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
      let jsonObj = {tags:this.tagarray}
      let formData = {
        author: this.username,
        contents: this.contents,
        json_metadata: jsonObj //to be included in jsonMetadata
      }
      let empty = false;
      let steembody = '';
      for (let item in formData.contents) {
        if (formData.contents[item].text == "") {
          empty = true
          alert('Text content is empty')
        }
        if (formData.contents[item].url == null) {
          empty = true
          alert('Img/Video is empty')
        }
        steembody += formData.contents[item].url + formData.contents[item].text + ','
      }
      console.log('sb', steembody);
      console.log('form', formData);
      if (empty == false) {
        api.create(formData).then(res => {
          console.log('createRES', res)
          this.permlink = res.data.permlink
          console.log('perm', this.permlink)
          steem.broadcast.comment(this.wif,'', '', this.username, res.data.permlink, 'test-title', formData.contents, formData.json_metadata, function(err, result) {
            console.log('comment',err, result);
            if (err) {
              console.log('iferr',err);
              api.delete(res.data.permlink).then(res2=>{
                console.log(this.permlink, 'deleted');
                console.log('del res',res2);
              }).catch(function(error) {
                console.log('api del error', error);
              })
            }
          });
        }).catch(function(error) {
          console.log('err',error);
        })
        // steem.config.set('cardupload', 'formData+this.username')
        // steem.config.get('cardupload')
        // console.log('get', steem.config.get('cardupload'));
        // console.log('testerr', this.permlink);
      }
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
