<template>
  <div id="controlroot">
    <div id="level">
      <span class="label">Level {{gameController.level}}</span>
      <span class="value"> - </span>
      <span class="hour">{{Math.floor(gameController.hour)}}h00</span></div>
    <div id="currency"><span class="label">Currency: </span><span class="value">{{gameController.credits}}</span></div>
    <div id="actions">
      <span class="label">Planted on click:</span><br/>
      <div id="radios">
      <input type="radio" id="oak" value="oak" v-model="gameController.toPlant"><label for="oak">Oak</label><br/>
      <input type="radio" id="pine" value="pine" v-model="gameController.toPlant"><label for="pine">Pine</label><br/>
      <input type="radio" id="poplar" value="poplar" v-model="gameController.toPlant"><label for="poplar">Poplar</label><br/>
      </div>
      <div id="hint">(Click on a tree to cut it)</div>
    </div>
    <div id="nextlevel"><button type="button" v-on:click="onNextLevel">Buy Bigger Land</button></div>
    <div id="navbox">
      <div id="nav">
      <router-link to="/">Back to Home</router-link>
      </div>
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

    font-family: 'Zilla Slab', serif;
    font-size: 150%;
  }

  .label {
    font-size: 150%;
  }

  .hour {
    display: inline-block;
    width: 2.5em;
  }

  #actions {
    margin-top: 30px;
    flex: 1 1 auto;
  }

  #radios {
    display: flex;
    flex-direction: row;
    align-self: center;
    align-items: center;
    justify-content: center;
  }

  #hint {
    font-size: 75%;
  }

  #nextlevel {
    margin-top: 15px;
    flex: 5 5 auto;
  }

  #nextlevel > button {
    background-color: #2c3e50;
    color: cadetblue;
    border: none;
    border-radius: 5px;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
  }

  #navbox {
     margin-top:auto;
     margin-bottom:15px;
  }
</style>
