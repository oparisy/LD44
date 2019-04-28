/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { SoundPlayer } from '../js/SoundPlayer.js'

const initToPlant = 'poplar'
const initHour = 12

const levelInfo = [
  { gridSize: 6, initCredits: 500, nextLevelCost: 3000 },
  { gridSize: 10, initCredits: 1000, nextLevelCost: 30000 },
  { gridSize: 14, initCredits: 10000 }
]

const treePrice = {
  'oak': { cost: 250, gain: 500 },
  'pine': { cost: 100, gain: 200 },
  'poplar': { cost: 500, gain: 1200 }
}

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
    this.nextLevelCost = info.nextLevelCost
  }

  gainFor (treeKind) {
    return treePrice[treeKind].gain
  }

  costFor (treeKind) {
    return treePrice[treeKind].cost
  }

  onTreeCut (tree) {
    this.credits += this.gainFor(tree.kind)
    this.soundPlayer.play(niceFall)
  }

  canPlantTree (treeKind) {
    if (this.credits >= this.costFor(treeKind)) {
      return true
    } else {
      this.soundPlayer.play(sadFrict)
      return false
    }
  }

  onTreePlanted (tree) {
    this.credits -= this.costFor(tree.kind)
    this.soundPlayer.play(subtleGrowth)
  }

  onBuyNextLevel () {
    if (this.level < 3 && this.credits >= this.nextLevelCost) {
      this.level++
      let endOfLevelCredits = this.credits
      this.setLevelRelatedData()
      this.credits = Math.max(this.credits, endOfLevelCredits) // More interesting this way
      this.soundPlayer.play(wooble)
      return true
    } else {
      this.soundPlayer.play(sadFrict)
      return false
    }
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
