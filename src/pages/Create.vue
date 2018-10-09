<template>
  <v-container grid-list-xl>
    <v-layout row justify-space-around>

      <v-flex xs12 sm6 md4>
        <div class="thumbnail">
          <v-layout flex align-center justify-center>
            <v-flex xs5 >
              <div v-for="(item,i) in items":key="i" >
                <v-card-title class="black--text">title </v-card-title>
                <v-card color ="white" dark class="black--text">hi</br></br></br></br></br>hi </v-card></br>
              </div>
            </v-flex>
          </v-layout>
        </div>
      </v-flex>

      <v-layout flex align-center justify-center >
        <v-flex>
          <h3 style="margin-left:50px;">스티커</h3> </br>
          <v-card class="contentCard" ></br>
            <input type="file" class="form-control" v-on:change="upload"/>

            <!-- <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone> -->
            <!-- <vue-dropzone id="myVueDropzone" v-on:vdropzone-success="success" :options="dropzoneOptions"></vue-dropzone> -->
            <v-textarea v-model="onchangetext" auto-grow box label="text" rows="1" v-on:change="objOnChange"></v-textarea>
            <v-btn color="submit" v-on:click="submitBtn">Submit</v-btn>
            <h1>{{this.onchangetext}}</h1>
          </v-card>
        </v-flex>
    </v-layout>

      <!-- toolbar -->
      <v-layout row wrap class="toolbar">
         <v-flex class="py-2">
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

      <!-- tag section -->
      <h3>태그</h3>
         <v-card>
           <v-flex>
              <v-text-field v-model="tagtext"
                label="태그단어"
                single-line
              ></v-text-field>
              <h3 v-if="this.tagtext.length > 0">#{{this.tagtext}}</h3>
            </br>
            </v-flex>
         </v-card>
       </v-flex>

     </v-layout>


    </break>




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

// import PostsService from '@/services/PostsService'

export default {
  data () {
    return {
      tagtext: '',
      onchangetext: '',
      contents : [], //array of each page content ex. [0] = title page [1]
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
  methods: {
    objOnChange: function() {
      const obj =  {
        url: this.file,
        text: this.onchangetext
      }
      this.$store.commit('setCardContents', obj);
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
      })
    },
    submitBtn() { //create the card
      let obj = {"file":this.file,
                  "text": this.text}
      let uri = 'http://localhost:4000/insert';
      this.axios.post(uri, obj).then((response) =>{
        console.log("done", response.data);
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

  .dropbox:hover {
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
  }

</style>
