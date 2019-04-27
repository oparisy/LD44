<template>
  <div id="container"></div>
</template>

<script>
/* eslint no-unused-vars: "off" */
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import * as chroma from 'chroma-js'

export default {
  name: 'MainCanvas',
  data () {
    return {
      renderer: null,
      scene: null,
      camera: null
    }
  },
  methods: {

    init: function () {
      this.createRenderer()
      this.scene = new THREE.Scene()

      // ISOMETRIC CAMERA
      let aspect = window.innerWidth / window.innerHeight
      let d = 60
      this.camera = new THREE.OrthographicCamera(
        -d * aspect,
        d * aspect,
        d,
        -d,
        1,
        2000
      )

      this.camera.position.set(10, 10, 10)
      this.camera.lookAt(this.scene.position)
      this.scene.add(this.camera)

      // display demo content
      this.createLights(this.scene)
      this.createHouse(0, 0, this.scene)
      this.createHouse(0, -1, this.scene)
      this.createHouse(0, 1 * 2, this.scene)
      this.createHouse(-1, 1 * 1, this.scene)
      this.createHouse(-1, -1 * 2, this.scene)
      this.createHouse(1, 1, this.scene)
    },
    createRenderer: function () {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true
      })
      this.renderer.setClearColor(0x222222)

      this.renderer.setSize(window.innerWidth, window.innerHeight)

      let container = document.getElementById('container')
      container.appendChild(this.renderer.domElement)
    },

    createHouse: function (x = 0, z = 0, scene) {
      let tileSize = 8
      x = x * tileSize
      z = z * tileSize
      let material = new THREE.MeshPhongMaterial({
        color: 0xefefef
      })
      let d = tileSize - 2

      let boxSizes = [
        d,
        d * 0.8333333333333,
        d * 0.6333333333333,
        d * 0.4333333333333
      ]
      let generalDelay = Math.random() * 1000
      boxSizes.forEach((size, key) => {
        let [width, height, depth] = [size, size, size] // w = h = d
        let geo = new THREE.BoxGeometry(width, height, depth)
        let mesh = new THREE.Mesh(geo, material)
        mesh.position.x = x
        mesh.position.z = z
        this.scene.add(mesh)

        var tween = new TWEEN.Tween(mesh.position)
          .to(
            {
              y: key * 2
            },
            Math.random() * 250 + key * 250 + 750
          )
          .delay(generalDelay + Math.random() * 1000)
          .yoyo(true)
          .easing(TWEEN.Easing.Elastic.Out)
          .repeat(Infinity)
          .start()
      })
    },

    createLights: function (scene) {
      // create a color scale (white to sth. not-really red)
      let scale = chroma.scale(['white', 0.1 * Math.random() * 0xffffff])

      var light = new THREE.DirectionalLight(scale(0.8).hex())
      light.position.set(10, 0, 0)
      this.scene.add(light)
      // scene.add(new THREE.DirectionalLightHelper(light))

      var light1 = new THREE.DirectionalLight(scale(0.8).hex())
      light1.position.set(0, 10, 0)
      this.scene.add(light1)
      // scene.add(new THREE.DirectionalLightHelper(light))

      var light2 = new THREE.DirectionalLight(scale(0.8).hex())
      light2.position.set(0, 0, 10)
      this.scene.add(light2)
      // scene.add(new THREE.DirectionalLightHelper(light))

      var light3 = new THREE.PointLight(scale(0.8).hex())
      light3.position.set(0, 25, 100)
      this.scene.add(light3)
      // scene.add(new THREE.PointLightHelper(light))
    },

    animate: function (time) {
      requestAnimationFrame(this.animate)
      TWEEN.update()
      this.render()
    },

    render: function () {
      this.renderer.render(this.scene, this.camera)
    }
  },

  mounted () {
    this.init()
    this.animate()
  }
}
</script>

<style scoped>
#container {
  overflow: hidden;
  padding: 0;
  margin: 0;

  color: #222;
  background-color: #bbb;
  font-family: arial;
  font-size: 100%;
}
</style>
