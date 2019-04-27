<template>
  <div class="about">
    <!-- h1>This is the game page</h1 -->
    <div id="nav">
      <router-link to="/">Home</router-link>
    </div>
    <div id="root">
      <MainCanvas />
    </div>
  </div>
</template>

<script>
import MainCanvas from '@/components/MainCanvas.vue'

export default {
  name: 'game',
  components: {
    MainCanvas
  }
}
</script>

<style scoped>
#root {
  display: flex;
  flex-direction: row;
}
</style>
