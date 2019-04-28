<template>
  <div class="about">
    <!-- h1>This is the game page</h1 -->
    <div id="nav">
      <router-link to="/">Home</router-link>
    </div>
    <div id="root">
      <div id="leftpane"><ControlPanel v-bind:credits="gameController.credits"/></div>
      <div id="canvas"><MainCanvas v-bind:gameController="gameController"/></div>
    </div>
  </div>
</template>

<script>
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
      gameController: null }
  },
  mounted () {
    this.gameController = new GameController()
  }
}
</script>

// Cannot get rid of the fixed height for #canvas below!
<style scoped>
#about {
  align-items: stretch;
  padding:0px;
  margin: 0px;
  background-color: maroon;
}
#root {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  background-color:crimson;
}
#leftpane {
  flex:1;
  background-color: cornflowerblue;
  margin-left: 10px;
}
#canvas {
  flex:3;
  background-color: green;
  height: 750px;
}
</style>
