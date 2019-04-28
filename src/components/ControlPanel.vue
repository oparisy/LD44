<template>
  <div id="root">
    <div id="currency"><span class="label">Currency: </span><span class="value">{{credits}}</span></div>
  </div>
</template>

<script>
export default {
  name: 'ControlPanel',
  props: {
    credits: Number
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
</style>
