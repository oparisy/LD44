<template>
  <div id="container" v-on:mousemove="onMouseMove"></div>
</template>

<script>
import { GameRenderer } from '../js/GameRenderer.js'

export default {
  name: 'MainCanvas',
  data () {
    return {
      gameRenderer: null,
      publicPath: process.env.BASE_URL
    }
  },
  methods: {
    onMouseMove (event) {
      if (this.gameRenderer) {
        this.gameRenderer.onMouseMove(event)
      }
    }
  },
  mounted () {
    let container = document.getElementById('container')
    this.gameRenderer = new GameRenderer(container, this.publicPath)
    this.gameRenderer.animate()
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
