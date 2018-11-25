<template>
  <v-card>
    <v-img
      :src="json_metadata.profile.cover_image"
      height="70"
    >
      <div class="avatar">
        <v-avatar
          slot="activator"
          :size="55"
          color="white"
        >
          <v-img :src="'https://steemitimages.com/u/' + editor.name + '/avatar'"></v-img>
        </v-avatar>
      </div>
    </v-img>
    <v-card-title>
      <div class="editor-profile">
        <div class="editor-name">
          {{ editor.name }}
        </div>
        <div class="editor-about">
          {{ json_metadata.profile.about }}
        </div>
      </div>
    </v-card-title>
  </v-card>
</template>

<style scoped>
.v-card {
  box-shadow: none;
  padding-bottom: 5px;
  border: 1px solid #ededed !important;
}
.v-card >>>.v-responsive {
  overflow: inherit;
}
.avatar {
  position: absolute;
  width: 100%;
  bottom: -27.5px;
  text-align: center;
}
.avatar .v-avatar {
  border-radius: 50%;
  overflow: hidden;
}
.editor-profile {
  margin-top: 30px;
  text-align: center;
  width: 100%;
}
.editor-name {
  color: #425363;
  padding-bottom: 3px;
  font-weight: 500;
}
.editor-about {
  /* display: -webkit-box; */
  font-size: 12px;
  color: #c1c1c1;
  line-height: 1.4;
  height: 34px;
  -webkit-box-align: start;
  -ms-flex-align: start;
  align-items: start;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
>>>.v-card__text {
  padding: 0;
  padding-top: 12px;
}
.link {
  text-decoration: none;
}
.hidden {
  display: none;
}
.col-rating {
  min-width: 60px;
  max-width: 60px;
  padding-right: 0;
  text-align: center;
}
.col-body {
  padding-left: 0!important;
}
.col-img {
  min-width: 132px;
  max-width: 132px;
}
.rating {
  font-size: 25px;
  font-weight: 500;
  color: #425363;
}
.category {
  font-size: 13px;
  font-weight: 500;
  color: #4321a9;
}
.author {
  font-size: 13px;
  font-weight: 500;
  color: #8e8e8e;
}
.author::before {
  content: '|';
  margin: 0 10px;
}
</style>

<script>
export default {
  props: ['editor'],
  data () {
    return {
      json_metadata: {
        profile: {
          cover_image: '', // 'https://via.placeholder.com/110x80',
          about: 'No about'
        }
      },
      defaultThumbnail: '' // 'https://via.placeholder.com/110x80'
    }
  },
  mounted () {
    if (this.editor.json_metadata) {
      this.json_metadata = JSON.parse(this.editor.json_metadata)
    }
    if (!this.json_metadata.profile) {
      this.json_metadata.profile = {
        cover_image: '', // 'https://via.placeholder.com/110x80',
        about: 'No about'
      }
    }
  },
  computed: {

  }
}
</script>
