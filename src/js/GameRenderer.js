
/* eslint no-unused-vars: "off" */
/* eslint-disable no-console */
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import * as chroma from 'chroma-js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Noise } from 'noisejs'

const tileSize = 8 // In world units

class GameRenderer {
  constructor (container, publicPath, gameController) {
    this.container = container
    this.publicPath = publicPath
    this.gameController = gameController
    this.gridSize = gameController.gridSize
    this.width = container.clientWidth
    this.height = container.clientHeight

    // Three objects which can react to a mouse over
    this.mouseReactive = []

    // The currently overed tree
    this.overed = null

    // Deliberately out of canvas normalized coordinates (avoid spurious hits on start)
    this.mouse = new THREE.Vector2(42, 42)

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

    this.renderer.shadowMap.enabled = true

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
    let groundColor = 0x465b15
    this.groundGeo = new THREE.PlaneGeometry(this.gridSize * tileSize, this.gridSize * tileSize, this.gridSize, this.gridSize)

    // Okay maybe I adapted this from https://codepen.io/ptc24/pen/BpXbOW
    let noise = new Noise(Math.random())
    let sz = this.gridSize + 1
    for (var i = 0; i < sz; i++) {
      for (var j = 0; j < sz; j++) {
        var ex = 0.5
        let term1 = noise.simplex2(i / sz, j / sz)
        let term2 = noise.simplex2((i + 2 * sz) / (sz / 2), j / (sz / 2)) * Math.pow(ex, 1)
        let term3 = 0// noise.simplex2((i + 4 * sz) / (sz / 4), j / (sz / 4)) * Math.pow(ex, 2)
        let term4 = 0// noise.simplex2((i + 6 * sz) / (sz / 8), j / (sz / 8)) * Math.pow(ex, 3)
        let term5 = 0// noise.simplex2((i + 8 * sz) / (sz / 16), j / (sz / 16)) * Math.pow(ex, 4)
        let height = (term1 + term2 + term3 + term4 + term5) / 2
        this.groundGeo.vertices[i + j * sz].z = -height * 6 // +z is down
        // this.groundGeo.vertices[i + j * sz].z = 0
      }
    }

    // Debugging purpose
    // let groundMat = new THREE.MeshBasicMaterial({ wireframe: true, side: THREE.DoubleSide })

    // Shiny but pretty!
    let groundMat = new THREE.MeshPhongMaterial({
      color: groundColor, side: THREE.DoubleSide/*, flatShading: true */
    })

    // No phong since we do not want highlights on ground
    // But shadows are ugly on this (too dark!) => I keep MeshPhong
    // let groundMat = new THREE.MeshLambertMaterial({
    //  color: groundColor, side: THREE.DoubleSide, flatShading: true
    // })

    let groundMesh = new THREE.Mesh(this.groundGeo, groundMat)
    groundMesh.rotation.x = Math.PI / 2
    groundMesh.receiveShadow = true

    this.scene.add(groundMesh)

    // Keep track of this for collision purpose
    this.groundMesh = groundMesh
  }

  createLights (scene) {
    // create a color scale (white to sth. not-really red)
    // let scale = chroma.scale(['white', 0.1 * Math.random() * 0xffffff])
    // let color = scale(0.8).hex()
    let color = 0x7f7f7f

    this.envLights = []

    var light = new THREE.DirectionalLight(color)
    light.position.set(10, 0, 0)
    // light.castShadow = true
    this.scene.add(light)
    // scene.add(new THREE.DirectionalLightHelper(light))
    this.envLights.push(light)

    var light1 = new THREE.DirectionalLight(color)
    light1.position.set(0, 10, 0)
    // light1.castShadow = true
    this.scene.add(light1)
    // scene.add(new THREE.DirectionalLightHelper(light1))
    this.envLights.push(light1)

    var light2 = new THREE.DirectionalLight(color)
    light2.position.set(0, 0, 10)
    // light2.castShadow = true
    this.scene.add(light2)
    // scene.add(new THREE.DirectionalLightHelper(light2))
    this.envLights.push(light2)

    var light3 = new THREE.PointLight(color)
    light3.position.set(0, 25, 100)
    // light3.castShadow = true
    this.scene.add(light3)
    // scene.add(new THREE.PointLightHelper(light3))
    this.envLights.push(light3)

    // The sun
    // let sphere = new THREE.SphereGeometry(0.5, 16, 8)

    this.sunLight = new THREE.PointLight(0xFFFFFF, 1, 1000, 2)
    // this.sunlightMesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffffff }))
    // this.sunLight.add(this.sunlightMesh)
    // this.sunLight.hasMesh = true

    this.sunLight.position.set(-10, 10, 0)
    this.sunLight.castShadow = true
    this.scene.add(this.sunLight)
  }

  setupGroundData () {
    // Each groundData[x][y] is either null/undefined or a tree instance
    this.groundData = []
    for (let i = 0; i < this.gridSize; i++) {
      let arr = []
      this.groundData.push(arr)
      for (let j = 0; j < this.gridSize; j++) {
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

        // We want tree parts to cast shadows
        if (child.type === 'Mesh') {
          child.castShadow = true
          child.receiveShadow = true
        }
      })

      // Scale models to their adult size
      this.oak.scale.set(3, 3, 3)
      this.pine.scale.set(3, 3, 3)
      this.poplar.scale.set(3, 3, 3)

      this.modelsLoaded = true
    })
  }

  createTree3D (data) {
    let kindName = data.kind
    let gx = data.gx
    let gy = data.gy

    // "tileSize / 2" offset to be in the middle of cells
    let x = (gx - this.gridSize / 2) * tileSize + tileSize / 2
    let z = (gy - this.gridSize / 2) * tileSize + tileSize / 2

    // Extract an height from the grid
    // Sweat on the wireframe to get those indexes...
    let idx1 = gx + 1 + (this.gridSize + 1) * ((this.gridSize - 1) - gy)
    let idx2 = gx + (this.gridSize + 1) * (((this.gridSize - 1) - gy) + 1)
    let vert1 = this.groundGeo.vertices[idx1]
    let vert2 = this.groundGeo.vertices[idx2]
    let height = (-vert1.z + -vert2.z) / 2 // Neg because +z is up and many tests below...

    // Debugging purpose
    /*
    let sphere = new THREE.SphereGeometry(0.5, 16, 8)
    let dot1 = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffff00 }))
    let dot2 = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: 0xffff00 }))
    dot1.position.set(vert1.x, -vert1.z, vert1.y)
    dot2.position.set(vert2.x, -vert2.z, vert2.y)
    this.scene.add(dot1)
    this.scene.add(dot2)
    */

    let obj3D = kindName === 'oak' ? this.oak : (kindName === 'pine' ? this.pine : this.poplar)

    let instance = obj3D.clone()
    instance.position.x = x
    instance.position.z = z
    instance.position.y = height
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
    let gx = Math.trunc(Math.random() * this.gridSize)
    let gy = Math.trunc(Math.random() * this.gridSize)
    if (this.groundData[gx][gy]) {
      // Will slow over time, but this is just for testing purpose
      return
    }

    // Pick a tree at random
    let val = Math.random()
    let kindName = val < 0.33 ? 'oak' : val < 0.66 ? 'pine' : 'poplar'

    this.createTree3DAndUpdateModel(kindName, gx, gy)
  }

  createTree3DAndUpdateModel (kindName, gx, gy) {
    let treeData = { kind: kindName, gx: gx, gy: gy }
    this.groundData[gx][gy] = treeData
    let instance = this.createTree3D(treeData)
    treeData.instance = instance
    return treeData
  }

  animate (time) {
    if (this.halted) {
      return
    }

    // For the "bind" rationale, see https://stackoverflow.com/a/6065221/38096
    requestAnimationFrame(this.animate.bind(this))
    TWEEN.update()
    this.render()

    if (this.modelsLoaded) {
      if (Math.random() > 0.99) {
        this.addRandomTree()
      }
    }

    this.checkForResize()

    this.gameController.onTick(time)

    // compute lights intensity
    // Max intensity at 13h, 0 intensity before 7h and after 19h
    let hour = this.gameController.hour
    let intensity = Math.max(0, Math.cos(Math.PI / 2 * (hour - 13) / 6))

    // Dim support light at night, but always keep some
    this.envLights.forEach(l => { l.intensity = 0.75 + intensity / 4 })

    // No sun at night => directly use intensity
    this.sunLight.intensity = intensity
    // if (this.intensity < 0 && this.sunLight.hasMesh) {
    //   this.sunLight.remove(this.sunlightMesh)
    //   this.sunLight.hasMesh = false
    // } else if (this.intensity > 0 && !this.sunLight.hasMesh) {
    //   this.sunLight.add(this.sunlightMesh)
    //   this.sunLight.hasMesh = true
    // }

    // Let's rotate the sun
    const radius = 60
    let angle = Math.PI * (hour - 7) / 12
    this.sunLight.position.set(radius * Math.cos(angle), radius * Math.sin(angle), 0)
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

  // TODO Only call this in onClick if no visual feedbacks when overed?
  checkOvered () {
    let raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = raycaster.intersectObjects(this.mouseReactive)
    this.overed = intersects.length > 0 ? intersects[0].object.data : null

    // If not a tree, try the ground
    this.overedGround = null
    if (!this.overed) {
      let groundIntersects = raycaster.intersectObject(this.groundMesh)
      if (groundIntersects.length > 0) {
        let groundHit = groundIntersects[0]
        let faceIndex = groundHit.faceIndex

        // Compute coordinates from the faceIndex (take advantage of PlaneGeometry regular structure)
        let squareIndex = (faceIndex - (faceIndex % 2)) / 2
        let gx = squareIndex % this.gridSize
        let gy = this.gridSize - 1 - (squareIndex - gx) / this.gridSize
        this.overedGround = new THREE.Vector2(gx, gy)
      }
    }
  }

  onMouseMove (event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    // Adjusted since canvas does not use full window, see https://stackoverflow.com/q/34892328/38096
    this.mouse.x = (event.offsetX / this.width) * 2 - 1
    this.mouse.y = -(event.offsetY / this.height) * 2 + 1
  }

  onClick (event) {
    if (this.overed) {
      // Cut that tree!
      let tree = this.overed

      // Remove model (TODO animate)
      this.scene.remove(tree.instance)

      // Remove meshes from raycaster
      let toRemove = new Set(tree.instance.children)
      this.mouseReactive = this.mouseReactive.filter(c => !toRemove.has(toRemove))

      // Update game model
      this.groundData[tree.gx][tree.gy] = null
      this.gameController.onTreeCut(tree)
    }

    let cell = this.overedGround
    if (cell && !this.groundData[cell.x][cell.y]) {
      // Update game model
      if (this.gameController.canPlantTree(this.gameController.toPlant)) {
        // Plant a tree!
        let tree = this.createTree3DAndUpdateModel(this.gameController.toPlant, cell.x, cell.y)
        this.gameController.onTreePlanted(tree)
      }
    }
  }

  halt () {
    this.renderer.domElement.remove()
    this.halted = true
  }
}

export { GameRenderer }
