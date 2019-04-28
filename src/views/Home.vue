<template>
  <div id="home">
    <img id="render" src="../assets/render.png">
    <h1>Your (forest) life is currency!</h1>

    <div id="details"><span><p>Let's manage your woodlot.</p><p>Plant different species of trees, then sell their wood for money.</p><p>
      If you can earn enough, buy a bigger land!</p></span></div>

    <div id="nav">
      <router-link to="/game">Click to Play!</router-link>
    </div>
  </div>
</template>

<script>

export default {
  name: 'home',

  mounted () {
    window.addEventListener('resize', adjustSize)
    adjustSize()

    function adjustSize () {
    // If it worked once...
      let totalHeight = window.innerHeight

      const margin = 32

      let root = document.getElementById('home')
      root.style.height = (totalHeight - root.offsetTop - margin) + 'px'
    }
  }
}
</script>

<style scoped>
#home {
  margin-top: 10px;
    border-radius: 10px;
    background-color: darkgray;
    font-family: 'Zilla Slab', serif;
}

#render {
  margin-top: 20px;
  border-radius: 7px;
  box-shadow: 8px 8px 2px 1px rgba(0, 0, 255, .15);
}

#details {
  margin-top: 50px;
  font-size: 150%;
}

#nav {
  font-size: 200%;
}
</style>
