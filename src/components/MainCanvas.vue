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
  background-color: rgb(209, 32, 200);
  height: 100%;
}
</style>
