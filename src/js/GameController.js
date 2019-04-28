/* eslint-disable no-console */
/* eslint-disable no-unused-vars */

import { SoundPlayer } from '../js/SoundPlayer.js'

const initCredits = 10000
const initToPlant = 'pine'
const initHour = 12

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
    this.credits = initCredits
    this.toPlant = initToPlant
    this.elapsedTime = 0
    this.hour = initHour
    this.soundPlayer = new SoundPlayer()
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
