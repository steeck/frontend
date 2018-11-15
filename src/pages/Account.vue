<template>
    <v-container>
      <v-layout row wrap>
        <!--설정영역-->
        <v-flex xs12 :tag="'h2'" pa-2>프로필 설정</v-flex>
        <v-flex xs12 class="area-config">
          <v-flex xs12 :tag="'h3'" pa-2 mb-3>공개 프로파일 설정</v-flex>

          <!--프로파일 사진 경로-->
          <v-layout row wrap pa-2 class="block-input">
            <v-flex class="" xs12 text-xs-left pa-1>프로파일 사진 경로</v-flex>
            <v-flex xs12 sm6 >
              <input type="text" title="" class="in-input" v-model="jsonMetaData.profile.profile_image">
              <span class="btn-upload" @click="openUpload('profile')">upload an image</span>
            </v-flex>
          </v-layout>

          <!--커버이미지 사진 경로-->
          <v-layout row wrap pa-2 class="block-input">
            <v-flex class="" xs12 text-xs-left pa-1>커버이미지 사진 경로</v-flex>
            <v-flex xs12 sm6 >
              <input type="text" title="" class="in-input" v-model="jsonMetaData.profile.cover_image">
              <span class="btn-upload" @click="openUpload('cover')">upload an image</span>
            </v-flex>
          </v-layout>

          <!--닉네임-->
          <v-layout row wrap pa-2 class="block-input">
            <v-flex class="" xs12 text-xs-left pa-1>닉네임</v-flex>
            <v-flex xs12 sm6 >
              <input type="text" title="" class="in-input" v-model="jsonMetaData.profile.name">
            </v-flex>
          </v-layout>

          <!--한줄소개 -->
          <v-layout row wrap pa-2 class="block-input">
            <v-flex class="" xs12 text-xs-left pa-1>한줄소개</v-flex>
            <v-flex xs12 sm6 >
              <input type="text" title="" class="in-input" v-model="jsonMetaData.profile.about">
            </v-flex>
          </v-layout>

          <!--지역-->
          <v-layout row wrap pa-2 class="block-input">
            <v-flex class="" xs12 text-xs-left pa-1>지역</v-flex>
            <v-flex xs12 sm6 >
              <input type="text" title="" class="in-input" v-model="jsonMetaData.profile.location">
            </v-flex>
          </v-layout>

          <!--웹싸이트-->
          <v-layout row wrap pa-2 class="block-input">
            <v-flex class="" xs12 text-xs-left pa-1>웹싸이트</v-flex>
            <v-flex xs12 sm6 >
              <input type="text" title="" class="in-input" v-model="jsonMetaData.profile.website">
            </v-flex>
          </v-layout>

          <v-flex xs12 text-xs-left pt-3>
            <v-btn outline style="    border-color: #999999;" @click="unit.saveDialog = true">저장</v-btn>
          </v-flex>

        </v-flex>

      </v-layout>

      <!--이미지 업로드 다이얼로그-->
      <v-dialog
        v-model="unit.uploadDialog"
        width="500"
      >
        <div  style="background-color: white;padding: 1rem; border: 1px solid #e5e5e5; border-radius: 4px;">
          <h4 class="mb-3">이미지 파일을 첨부해주세요.</h4>
          <input type="file" class="file-upload" @change="upload">
        </div>
      </v-dialog>

      <!--저장 다이얼로그-->
      <v-dialog
        v-model="unit.saveDialog"
        width="500"
      >
        <div  style="background-color: white;padding: 1rem; border: 1px solid #e5e5e5; border-radius: 4px;">
          <h4 class="mb-3">비밀번호를 입력해주세요.</h4>
          <input type="password" v-model="unit.pwd" class="in-input pwd-input">
          <div class="text-xs-right">
            <v-btn outline @click="updateMetaData" :loading="unit.processDoing">변경하기</v-btn>
          </div>
        </div>
      </v-dialog>

      <!-- 성공 모달 -->
      <v-dialog v-model="unit.successDialog" width="300">
        <div style="background-color: white;padding: 1rem; border: 1px solid #e5e5e5; border-radius: 4px;">
          <div class="confirmModal">{{ unit.successText }}</div>
          <div class="text-xs-right">
            <v-btn outline @click="unit.successDialog = false" :loading="unit.processDoing">확인</v-btn>
          </div>
        </div>
      </v-dialog>

    </v-container>
</template>

<script>
  import steem from '@/services/steem'
  import api from '@/api/posts'

  export default {
    name: 'Account',
    data: function () {
      return {
        msg: 'test',
        unit: {
          pwd: '',
          saveDialog: false,
          uploadDialog: false,
          uploadKey: null,
          successText: '',
          successDialog: false,
          processDoing: false
        }
      }
    },
    computed: {
      account: function () {
        return this.$store.state.me.account
      },
      follow: function () {
        return this.$store.state.me.follow
      },
      created () {
        return this.account.created ? this.account.created.substr(0, 10).replace(/-/g, '/') : ''
      },
      jsonMetaData: function () {
        let tmp = {
          profile: {
            profile_image: '',
            cover_image: '',
            name: '',
            about: '',
            location: '',
            website: ''
          }
        }
        return Object.assign(tmp, JSON.parse(this.$store.state.me.account.json_metadata))
      }
    },
    methods: {
      openUpload: function (target) {
        this.unit.uploadKey = target
        this.unit.uploadDialog = true
      },
      setFileUrl: function (url) {
        switch (this.unit.uploadKey) {
          case 'cover':
            this.jsonMetaData.profile.cover_image = url
            break
          case 'profile':
            this.jsonMetaData.profile.profile_image = url
            break
        }
      },
      upload: function (event) {
        let vm = this
        let file = event.target.files
        let formData = new FormData()
        formData.append('file', file[0])
        api.upload(formData).then(res => {
          vm.setFileUrl(res.data.Location)
          vm.unit.uploadDialog = false
        }).catch(function (xhr) {
          console.log('error', xhr)
        })
      },
      updateMetaData: function () {
        let vm = this
        let privKeys = steem.auth.getPrivateKeys(this.account.name, this.unit.pwd)
        this.unit.processDoing = true
        steem.broadcast.accountUpdateAsync(
          privKeys.owner,
          this.account.name,
          undefined,
          undefined,
          undefined,
          this.account.memo_key,
          JSON.stringify(this.jsonMetaData),
          function (err, result) {
            if (err) {
              vm.unit.successText = '공개 프로필정보변경에 실패했습니다.'
              vm.unit.successDialog = true
            }
            if (result) {
              vm.$store.commit('me/setJsonMetaData', JSON.stringify(vm.jsonMetaData))
              vm.unit.saveDialog = false
              vm.unit.successText = '공개 프로필정보를 변경했습니다.'
              vm.unit.successDialog = true
            }
            vm.unit.processDoing = false
          }
        )
      }
    }
  }
</script>

<style lang="scss" scoped>

  .area-config {
    border: 1px solid #e5e5e5; padding: 1rem;
  }
  .confirmModal {
    text-align: center;
    padding: 1rem;
    font-weight: bold;
  }
  input.in-input {
    border: 1px solid #e5e5e5;
    width: 100%;
    line-height: 2rem;
    font-size: 1rem;
    padding: .5rem;
    border-radius: 4px;
  }

  .btn-upload {
    color: rgb(102, 51, 255);
    cursor: pointer;
  }

</style>
