<template>
  <div id="app">
    <div id="nav">
      <p>Woodlot Owner</p>
    </div>
    <router-view/>
  </div>
</template>

<style>
html {
    min-height:100%;
}
body {
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
</style>
