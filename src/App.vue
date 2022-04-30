<!-- npm run serve -- --port 8999 -->
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import navigation from '@/components/navigation.vue'
import createGame from '@/views/create-game'

export default {
  name: 'navigation',
  components: {
    navigation,
    createGame
  }
}
</script>


<style lang="scss">
$textColor: rgba(255, 255, 190, 0.8);

@font-face {
  font-family: "imposs";
  src: local("imposs"),
   url(./fonts/imposs_accents.ttf) format("truetype");
}

html {
    font-family: imposs, Courier New, Courier, monospace !important;
    background-color: rgb(28, 35, 68);
    background-image: url("../src/assets/misc/gameboard2.jpg");
    color: $textColor;
    object-fit: cover;
}
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

body {
  margin: 0 !important;

}
</style>
