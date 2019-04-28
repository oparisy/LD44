
/* eslint no-unused-vars: "off" */
/* eslint-disable no-console */
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import * as chroma from 'chroma-js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const tileSize = 8 // In world units
const gridSize = 10 // In cells (per column or line)

class GameRenderer {
  constructor (container, publicPath) {
    this.container = container
    this.publicPath = publicPath
    this.width = container.clientWidth
    this.height = container.clientHeight
    console.log('container init size:', this.width, this.height)

    // Three objects which can react to a mouse over
    this.mouseReactive = []

    this.mouse = new THREE.Vector2()

    this.setupGroundData()

    this.createRenderer()
    this.scene = new THREE.Scene()

    this.setupCamera()

    this.createGround()

    this.createLights(this.scene)

    this.loadTreeModels()
  }

  createRenderer () {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true
    })
    this.renderer.setClearColor(0x222222)

    this.renderer.setSize(this.width, this.height)

    this.container.appendChild(this.renderer.domElement)
  }

  setupCamera () {
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
  }

  createGround () {
    // Add a temporary ground plane
    let groundColor = 0x465b15
    let groundGeo = new THREE.PlaneGeometry(gridSize * tileSize, gridSize * tileSize)
    let groundMat = new THREE.MeshPhongMaterial({
      color: groundColor, side: THREE.DoubleSide
    })
    let groundMesh = new THREE.Mesh(groundGeo, groundMat)
    groundMesh.rotation.x = Math.PI / 2
    this.scene.add(groundMesh)
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

  setupGroundData () {
    // Each groundData[x][y] is either undefined or a tree instance
    this.groundData = []
    for (let i = 0; i < gridSize; i++) {
      let arr = []
      this.groundData.push(arr)
      for (let j = 0; j < gridSize; j++) {
        arr.push(undefined)
      }
    }
  }

  loadTreeModels () {
    var loader = new GLTFLoader().setPath(this.publicPath)
    loader.load('trees.glb', gltf => {
      gltf.scene.traverse(child => {
        // Collect empties (Object3D) owning respective tree models
        if (child.name === 'Oak') {
          this.oak = child
        } else if (child.name === 'Pine') {
          this.pine = child
        } else if (child.name === 'Poplar') {
          this.poplar = child
        }
      })

      // Scale models to their adult size
      this.oak.scale.set(3, 3, 3)
      this.pine.scale.set(3, 3, 3)
      this.poplar.scale.set(3, 3, 3)

      this.modelsLoaded = true
    })
  }

  createTree (obj3D, gx, gy, data) {
    let x = gx * tileSize
    let z = gy * tileSize
    // let d = tileSize - 2
    let instance = obj3D.clone()
    instance.position.x = x
    instance.position.z = z
    instance.scale.x = instance.scale.y = instance.scale.z = 0.2
    this.scene.add(instance)

    // We cannot detect the object3D itself, only its children meshes
    instance.children.forEach(c => { c.data = data; this.mouseReactive.push(c) })

    // Animate tree growth
    let maxGrowth = 2 + Math.random()
    var tween = new TWEEN.Tween(instance.scale)
      .to(
        {
          x: maxGrowth,
          y: maxGrowth,
          z: maxGrowth
        },
        500 + Math.random() * 1000
      )
      .delay(500 + Math.random() * 500)
      .easing(TWEEN.Easing.Elastic.Out)
      .onUpdate(scale => {}) // Can be used to keep track of tree growth (pricing purpose?)
      .start()

    return instance
  }

  addRandomTree () {
    // Pick a random, unused location
    let gx = Math.trunc(Math.random() * gridSize)
    let gy = Math.trunc(Math.random() * gridSize)
    if (this.groundData[gx][gy] !== undefined) {
      // Will slow over time, but this is just for testing purpose
      return
    }

    // Pick a tree at random
    let val = Math.random()
    let kind = val < 0.33 ? this.oak : val < 0.66 ? this.pine : this.poplar

    let treeData = { type: kind.name, x: gx, y: gy }
    this.groundData[gx][gy] = treeData

    this.createTree(kind, gx - gridSize / 2, gy - gridSize / 2, treeData)
  }

  animate (time) {
    // For the "bind" rationale, see https://stackoverflow.com/a/6065221/38096
    requestAnimationFrame(this.animate.bind(this))
    TWEEN.update()
    this.render()

    if (this.modelsLoaded) {
      if (Math.random() > 0.9) {
        this.addRandomTree()
      }
    }

    this.checkForResize()
  }

  // TODO This does not work actually (container does not change size)
  checkForResize () {
    // Since there is no resize event for <div>,
    // try to detect size change by comparison with previous values
    if ((this.width !== this.container.clientWidth) ||
      (this.height !== this.container.clientHeight)) {
      this.width = this.container.clientWidth
      this.height = this.container.clientHeight
      console.log('container resized:', this.width, this.height)
      // Update renderer and camera accordingly
      this.renderer.setSize(this.width, this.height)
      this.scene.remove(this.camera)
      this.setupCamera()

      // Avoid strange infinite resizings
      this.width = this.container.clientWidth
      this.height = this.container.clientHeight
    }
  }

  render () {
    this.checkOvered()
    this.renderer.render(this.scene, this.camera)
  }

  onMouseMove (event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    // Adjusted since canvas does not use full window, see https://stackoverflow.com/q/34892328/38096
    this.mouse.x = (event.offsetX / this.width) * 2 - 1
    this.mouse.y = -(event.offsetY / this.height) * 2 + 1
  }

  checkOvered () {
    let raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = raycaster.intersectObjects(this.mouseReactive)
    intersects.forEach(obj => console.log('Mouse is over ', obj.object.data))
  }
}

export { GameRenderer }
