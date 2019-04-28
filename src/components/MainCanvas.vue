<template>
  <div id="container" v-on:mousemove="onMouseMove" v-on:click="onClick"></div>
</template>

<script>
import { GameRenderer } from '../js/GameRenderer.js'

export default {
  name: 'MainCanvas',
  props: {
    gameController: Object
  },
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
    },
    onClick (event) {
      if (this.gameRenderer) {
        this.gameRenderer.onClick(event)
      }
    },
    toNextLevel () {
      if (this.gameRenderer) {
        this.gameRenderer.halt()
        this.buildRenderer()
      }
    },
    buildRenderer () {
      let container = document.getElementById('container')
      this.gameRenderer = new GameRenderer(container, this.publicPath, this.gameController)
      this.gameRenderer.animate()
    }
  },
  mounted () {
    this.buildRenderer()
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
  border-radius: 10px;
}
</style>
