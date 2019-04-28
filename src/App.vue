<template>
  <div id="app">
    <div class="toptitle">Woodlot Owner</div>
    <router-view/>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css?family=Holtwood+One+SC');
@import url('https://fonts.googleapis.com/css?family=Zilla+Slab');

html {
    min-height:100%;
}
body {
  margin-left:15px;
    position: relative;
    min-height:100hv;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 10px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.toptitle {
  font-family: 'Holtwood One SC', serif;
  font-size: 2em;
  border-radius: 10px;
  background-color: darkslategrey;
  color: cadetblue;
  padding:15px;
}
</style>
