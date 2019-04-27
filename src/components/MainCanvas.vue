<template>
  <div id="container"></div>
</template>

<script>
import { Game } from '../js/game.js'

export default {
  name: 'MainCanvas',
  data () {
    return {
      game: null,
      publicPath: process.env.BASE_URL
    }
  },
  methods: {
  },
  mounted () {
    let container = document.getElementById('container')
    this.game = new Game(container, this.publicPath)
    this.game.animate()
  }
}
</script>

<style scoped>
#container {
  overflow: hidden;
  padding: 0;
  margin: 0;

  color: #222;
  background-color: #bbb;
  font-family: arial;
  font-size: 100%;

  height:600px;
  width:500px;
  flex:1;
}
</style>
