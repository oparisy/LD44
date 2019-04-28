/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { SoundPlayer } from '../js/SoundPlayer.js'

const initToPlant = 'poplar'
const initHour = 12

const levelInfo = [
  { gridSize: 6, initCredits: 500 },
  { gridSize: 10, initCredits: 1000 },
  { gridSize: 14, initCredits: 10000 }
]

// Some seeds for the soundplayer
const sadFall = 5362
const sadFrict = 3204
const sad2 = 4051
const wooble = 1866
const fall = 7065
const niceFall = 8533
const wooble2 = 8206
const subtleGrowth = 4669

class GameController {
  constructor () {
    this.level = 1
    this.setLevelRelatedData()

    this.toPlant = initToPlant
    this.elapsedTime = 0
    this.hour = initHour
    this.soundPlayer = new SoundPlayer()
  }

  setLevelRelatedData () {
    let info = levelInfo[this.level - 1]
    this.credits = info.initCredits
    this.gridSize = info.gridSize
  }

  onTreeCut (tree) {
    console.log('Tree was cut, crediting:', tree.kind)
    this.credits += 500
    this.soundPlayer.play(niceFall)
  }

  onTreePlanted (tree) {
    console.log('Tree was planted, debiting:', tree.kind)
    this.credits -= 500
    this.soundPlayer.play(subtleGrowth)
  }

  onBuyNextLevel () {
    // TODO This should cost money...
    if (this.level < 3) {
      this.level++
      this.setLevelRelatedData()
      return true
    }
    return false
  }

  onTick (time) {
    let delta = this.lastTime ? time - this.lastTime : 0
    this.lastTime = time
    this.elapsedTime += delta

    // One game hour per browser second
    this.hour = (this.hour + (delta / 1000)) % 24

    // Avoid issues with hot reload
    if (isNaN(this.hour)) {
      this.hour = initHour
    }
  }
}

export { GameController }
