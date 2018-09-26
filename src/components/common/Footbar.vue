<template>
  <v-footer
    height="auto"
    class="grey lighten-2"
  >
    <v-container grid-list-xl>
      <v-card
        flat
        tile
        class="grey lighten-2"
      >
        <v-card-text>
          <ul>
            <li><a href="https://about.steeck.io" target="about-steeck">스틱소개</a></li>
            <li><a href="mailto:support@steeck.io">고객센터</a></li>
            <li>공식채널</li>
            <li><a href="mailto:support@steeck.io">고객지원</a></li>
            <li><a href="mailto:support@steeck.io">제휴문의</a></li>
          </ul>
          <ul class="mt-2">
            <li>약관</li>
            <li>개인정보 처리방침</li>
          </ul>
          <div class="mt-2">
            &copy;2018 — <strong>STEECK</strong>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </v-footer>
</template>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
}
li + li:before {
  content: '|';
  width: 20px;
  display: inline-block;
  text-align: center;
}
li a {
  text-decoration: none;
  color: inherit;
}
</style>
