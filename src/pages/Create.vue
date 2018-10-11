<template>
  <v-container grid-list-xl style="padding-top: 0px;">


    <v-layout class="topToolbar" justify-end>
        <v-btn class="submitBtn" v-on:click="submitBtn" style="background-color:blue; color:white;">Submit</v-btn>
    </v-layout>

    <v-layout row justify-space-between>

      <v-flex xs12 sm6 md4>
        <div class="thumbnail">
          <v-layout flex align-center justify-center>
            <v-flex id="thubnailCard" xs5 style="padding-left:0px;">
              <!-- <div justify-center  v-for="item in contents"> -->
                <v-card-title class="black--text">표지 </v-card-title>
                <v-card style="width:140px; border-style:solid; border-width:0.5px; border-color: rgba(0,0,0,0.3);">
                  <v-img v-if="file.length>0"
                    class="black--text"
                    height="130px"
                    v-bind:src="file">
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
                    > </v-img>
                  </div>
                  <v-card-title>
                    <div style="height:100px;">
                      <span v-if="onchangetext.length==0" class="grey--text">Input text</span>
                      <span>{{this.onchangetext}}</span><br>
                    </div>
                  </v-card-title>
                </v-card>

              <!-- </div> -->
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
      <v-layout flex align-center justify-center >
        <v-flex>
          <h3 style="margin-left:50px;">스티커</h3> </br>
          <v-card class="contentCard" >
            <input v-if="inputbox==false" style="box-shadow: none !important;"id ="inputbox" type="file" class="form-control" v-on:change="upload"/>
            <div v-else id="inputbox" style="box-shadow: none !important;"><v-img height="250px"v-bind:src="file" @click="inputbox=false"></v-img></div>

            <v-flex id ="textinput" style="height:250px;" >
              <v-textarea
                box
                rows="11"
                background-color="white"
                v-model="onchangetext"
                v-on:change="objOnChange"></v-textarea>
            </v-flex>
          </v-card>
        </v-flex>
    </v-layout>

    <!-- sidebar -->
      <v-layout align-end class="toolbar" justify-space-between column fill-height
        style="  margin-top: 0px; margin-bottom: 0px;">
       <v-flex class="py-2">
         </br></br></br>
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
           </br></br></br>
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
                          <v-btn v-for="thing in tagarray"
                          class="black--text"
                          depressed small
                          round
                          style="width:35%;font-size:65%;"
                          outline color="indigo">{{thing}}</v-btn>
                  </v-layout>
                  </br>
                  </v-flex>
               </v-card>
         </div>
       </v-flex>
      </v-layout>

    </br>

    </v-layout>

  </v-container>
</template>

<style scoped>
</style>

<script>
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import Card from '@/components/post/Card'

export default {
  data () {
    return {
      tagtext: '#', //tag inputed
      tagarray: [],
      onchangetext: '',
      inputbox: false,
      contents : [], //array of each page content ex. [0] = title page [1]
      contentlen: '',
      toggle_exclusive: 2,
      toggle_multiple: [0, 1, 2],
      submit: false,
      file: '',
      text: '',
      width: 300,
    items: [
      { icon: 'inbox', title: 'Inbox' },
      { icon: 'star', title: 'Starred' },
      { icon: 'send', title: 'Sent mail' },
      { divider: true },
      { icon: 'mail', title: 'All mail' },
      { icon: 'delete', title: 'Trash' },
      { icon: 'error', title: 'Spam' }
    ],
    dropzoneOptions: {
          // url: (file) => this.saveImages(file),
          url: "https://httpbin.org/post",
          // thumbnailWidth: 150,
          // headers: { "My-Awesome-Header": "header value" },
          params: () => {
           return ({id: "testingid"})
         },
      }
    }
  },
  components: {
    vueDropzone: vue2Dropzone,
  },
  mounted() {
    this.callObj()
  },
  methods: {
    hashtag: function() {
      this.tagarray = [];
      console.log("tag", this.tagtext);
      let split = this.tagtext.split(' ')
      let arr = [] //array to send to db
      for (let item in split)  {
        if (split[item].length>1) {
          this.tagarray.push(split[item])
          //send to db
        }
      }
      console.log("arr", arr);
      //send info to db
    },
    addCard: function () {
      console.log("cadd");
      //add card in thumbnailCard
      //increase contents array
      //increase contentlen length

    },
    callObj: function() {
      this.axios.get('http://localhost:4000/get/posts').then((response) => {
        let contents = response.data[0].contents.content
        for (let item in contents) {
          this.contents.push(contents[item]);
        }
        this.contentlen = this.contents.length;
      })

    },
    objOnChange: function() {
      console.log("this.textchange", this.onchangetext);
      let obj =  {
        url: this.file,
        text: this.onchangetext
      }
      this.contents[this.contentlen] = obj; //update current card's content
      this.$store.commit('setCardContents', this.contents);
      console.log('getter ',this.$store.getters.cardContents);
    },
    async upload(event) {
      let file = event.target.files
      let formData = new FormData()
      formData.append('file',file[0]);
      for (var key of formData.entries()) {
        console.log("hihi",key[1]);
      }
      let uri = 'http://localhost:4000/create';
      this.axios.post(uri, formData).then((response) => {
        this.file = response.data.Location;
        console.log("file location", this.file);
        this.objOnChange();
        this.inputbox=true; //show img
      })
    },
    submitBtn: function() { //create the contents
      this.axios.post('http://localhost:4000/insert', this.$store.getters.cardContents).then((response) =>{
        console.log("res", response.data);
      })
    },

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
  padding: 11px 0px 0px 3px;
  height:261px;
  width:303px;
}
#inputbox {
  height:250px;
  width:300px;
  box-shadow: none !important;
  background-color:rgb(224, 224, 224,0.3);
}

<style lang="scss" scoped>
@import 'main.scss'

  .background: {
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
    background-color: white;
    height: 600px;
    width: 100%;
    overflow: auto;
  }
  .contentCard {
    height: 500px;
    width: 300px;
    margin-left: 50px;
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
