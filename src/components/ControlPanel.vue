<template>
  <div id="controlroot">
    <div id="level"><span class="label">Level: </span><span class="value">{{gameController.level}}</span></div>
    <div id="currency"><span class="label">Currency: </span><span class="value">{{gameController.credits}}</span></div>
    <div id="clock"><span class="label">Clock: </span><span class="value">{{Math.floor(gameController.hour)}}h00</span></div>
    <div id="actions">
      <span class="label">Planted on click:</span><br/>
      <input type="radio" id="oak" value="oak" v-model="gameController.toPlant"><label for="oak">Oak</label><br/>
      <input type="radio" id="pine" value="pine" v-model="gameController.toPlant"><label for="pine">Pine</label><br/>
      <input type="radio" id="poplar" value="poplar" v-model="gameController.toPlant"><label for="poplar">Poplar</label><br/>
    </div>
    <div id="nextlevel"><button type="button" v-on:click="onNextLevel">Buy Bigger Land</button></div>
    <div id="navbox">
      <router-link to="/">Back to Home</router-link>
    </div>

  </div>
</template>

<script>
export default {
  name: 'ControlPanel',
  props: {
    gameController: Object
  },
  methods: {
    onNextLevel: function () {
      this.$emit('next-level')
    }
  }
}
</script>

<style scoped>
  #controlroot {
    min-height: 100%;
    margin-left: -10px;

    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    background-color: lightslategrey;

    border-radius: 10px;
  }

  #level {
    margin-top: 15px;
  }

  #actions {
    margin-top: 30px;
    flex: 1 1 auto;
  }
  #nextlevel {
    margin-top: 15px;
    flex: 5 5 auto;
  }
  #navbox {
     margin-top:auto;
     margin-bottom:15px;
  }
</style>
