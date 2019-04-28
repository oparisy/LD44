<template>
  <div id="root">
    <div id="leftpane"><ControlPanel v-bind:gameController="gameController" @next-level="onNextLevel"/></div>
    <div id="canvas"><MainCanvas v-bind:gameController="gameController" ref="mainCanvas"/></div>
  </div>
</template>

<script>
/* eslint-disable no-console */

import MainCanvas from '@/components/MainCanvas.vue'
import ControlPanel from '@/components/ControlPanel.vue'
import { GameController } from '../js/GameController.js'

export default {
  name: 'game',
  components: {
    MainCanvas, ControlPanel
  },
  data () {
    return {
      gameController: new GameController()
    }
  },
  mounted () {
    window.addEventListener('resize', adjustSize)
    adjustSize()

    function adjustSize () {
    // I'm not proud! But I can't seem to be able to fix canvas size otherwise
    // (excepted with a fixed size in CSS)
      let totalHeight = window.innerHeight
      console.log('totalHeight', totalHeight)

      const margin = 17

      let root = document.getElementById('root')
      root.style.height = (totalHeight - root.offsetTop - margin) + 'px'

      let canvas = document.getElementById('canvas')
      canvas.style.height = (totalHeight - canvas.offsetTop - margin) + 'px'
    }
  },
  methods: {
    onNextLevel: function () {
      if (this.gameController.onBuyNextLevel()) {
        console.log('Reset game state to next level')
        this.$refs.mainCanvas.toNextLevel()
      }
    }
  }
}
</script>

<style scoped>
#root {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  margin-top:7px;
}
#leftpane {
  flex:1;
  margin-left: 10px;
  margin-right: 7px;
}
#canvas {
  flex:3;
}
</style>
