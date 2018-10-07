<template>
  <v-container grid-list-xl>
    <v-layout row wrap>
      <v-flex>
        <v-navigation-drawer
        :width="width"
        :value="true"
        stateless
      >
        <v-img :aspect-ratio="16/9" src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
          <v-layout pa-2 column fill-height class="lightbox white--text">
            <v-spacer></v-spacer>
            <v-flex shrink>
              <div class="subheading">Jonathan Lee</div>
              <div class="body-1">heyfromjonathan@gmail.com</div>
            </v-flex>
          </v-layout>
        </v-img>

        <v-list>
          <template v-for="(item, i) in items">
            <v-divider v-if="item.divider" :key="i"></v-divider>
            <v-list-tile v-else :key="item.title" @click>
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile>
          </template>
        </v-list>
      </v-navigation-drawer>
    </v-flex>

      <v-flex>
        <v-card>
          <input type="file" class="form-control" v-on:change="upload"/>
          <!-- <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone> -->
          <!-- <vue-dropzone id="myVueDropzone" v-on:vdropzone-success="success" :options="dropzoneOptions"></vue-dropzone> -->
            <v-textarea v-model="text" auto-grow box label="text" rows="1"></v-textarea>
          <v-btn color="submit" v-on:click="submitBtn">Submit</v-btn>

        </v-card>
      </v-flex>

       <v-flex xs12 sm3 class="py-2">
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
      </v-flex>



    </v-layout>





  </v-container>
</template>

<style scoped>
</style>

<script>
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
// import PostsService from '@/services/PostsService'

export default {
  data () {
    return {
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
    vueDropzone: vue2Dropzone

  },
  mounted () {

  },
  methods: {
    // 'success': function(file) {
    //   console.log("pls", file);
    //   let uri = 'http://localhost:4000/create';
    //    this.axios.post(uri, file).then((response) => {
    //      this.file = response.data.Location;
    //      console.log("file location", this.file);
    //    })
    //
    // },
    // 'sending': function (file,xhr,formData) {
    //    console.log("hijson",formData);
    //    console.log("tes1t",file)
    //    console.log("f-9", file[0]);
    //    formData.append('file',file[0])
    //
    //    // const formData = new FormData()
    //    // formData.append('name', file);
    //    for (var key of formData.entries()) {
    //      console.log("cries",key[1]);
    //    }
    //    let uri = 'http://localhost:4000/create';
    //      // this.axios.post(uri, formData).then((response) => {
    //      //   this.file = response.data.Location;
    //      //   console.log("file location", this.file);
    //      // })
    //  },
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
        console.log("done");
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
</style>
