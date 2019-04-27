
/* eslint no-unused-vars: "off" */
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import * as chroma from 'chroma-js'

class Game {
  constructor (container) {
    this.width = container.clientWidth
    this.height = container.clientHeight

    this.createRenderer(container)
    this.scene = new THREE.Scene()

    // ISOMETRIC CAMERA
    let aspect = this.width / this.height
    let d = 60
    this.camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      1,
      2000
    )

    // Increase this as necessary to avoid near plane clipping
    // Do not adjust near plane values!
    let cameraDist = 50
    this.camera.position.set(cameraDist, cameraDist, cameraDist)
    this.camera.lookAt(this.scene.position)
    this.scene.add(this.camera)

    // Add a temporary ground plane
    let groundColor = 0x465b15
    let groundGeo = new THREE.PlaneGeometry(80, 80)
    let groundMat = new THREE.MeshPhongMaterial({
      color: groundColor, side: THREE.DoubleSide
    })
    let groundMesh = new THREE.Mesh(groundGeo, groundMat)
    groundMesh.rotation.x = Math.PI / 2
    this.scene.add(groundMesh)

    // display demo content
    this.createLights(this.scene)
    this.createHouse(0, 0, this.scene)
    this.createHouse(0, -1, this.scene)
    this.createHouse(0, 1 * 2, this.scene)
    this.createHouse(-1, 1 * 1, this.scene)
    this.createHouse(-1, -1 * 2, this.scene)
    this.createHouse(1, 1, this.scene)
  }

  createRenderer (container) {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    this.renderer.setClearColor(0x222222)

    this.renderer.setSize(this.width, this.height)

    container.appendChild(this.renderer.domElement)
  }

  createHouse (x = 0, z = 0, scene) {
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
  }

  createLights (scene) {
    // create a color scale (white to sth. not-really red)
    // let scale = chroma.scale(['white', 0.1 * Math.random() * 0xffffff])
    // let color = scale(0.8).hex()
    let color = 0x7f7f7f

    var light = new THREE.DirectionalLight(color)
    light.position.set(10, 0, 0)
    this.scene.add(light)
    // scene.add(new THREE.DirectionalLightHelper(light))

    var light1 = new THREE.DirectionalLight(color)
    light1.position.set(0, 10, 0)
    this.scene.add(light1)
    // scene.add(new THREE.DirectionalLightHelper(light))

    var light2 = new THREE.DirectionalLight(color)
    light2.position.set(0, 0, 10)
    this.scene.add(light2)
    // scene.add(new THREE.DirectionalLightHelper(light))

    var light3 = new THREE.PointLight(color)
    light3.position.set(0, 25, 100)
    this.scene.add(light3)
    // scene.add(new THREE.PointLightHelper(light))
  }

  animate (time) {
    // For the "bind" rationale, see https://stackoverflow.com/a/6065221/38096
    requestAnimationFrame(this.animate.bind(this))
    TWEEN.update()
    this.render()
  }

  render () {
    this.renderer.render(this.scene, this.camera)
  }
}

export { Game }
