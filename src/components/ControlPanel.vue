<template>
  <div id="root">
    <div id="currency"><span class="label">Currency: </span><span class="value">{{gameController.credits}}</span></div>
    <div class="sep"></div>
    <div id="actions">
      <span class="label">Planted on click:</span><br/>
      <input type="radio" id="oak" value="oak" v-model="gameController.toPlant"><label for="oak">Oak</label><br/>
      <input type="radio" id="pine" value="pine" v-model="gameController.toPlant"><label for="pine">Pine</label><br/>
      <input type="radio" id="poplar" value="poplar" v-model="gameController.toPlant"><label for="poplar">Poplar</label><br/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ControlPanel',
  props: {
    gameController: Object
  }
}
</script>

<style scoped>
  #root {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  #currency {
    flex: 1 1 auto;
  }

  #actions {
    flex: 1 1 auto;
  }

  .sep {
    height: 15px;
  }
</style>
