/* eslint-disable no-console */

const initCredits = 10000
const initToPlant = 'pine'
const initHour = 12

class GameController {
  constructor () {
    this.credits = initCredits
    this.toPlant = initToPlant
    this.elapsedTime = 0
    this.hour = initHour
  }

  onTreeCut (tree) {
    console.log('Tree was cut, crediting:', tree.kind)
    this.credits += 500
  }

  onTreePlanted (tree) {
    console.log('Tree was planted, debiting:', tree.kind)
    this.credits -= 500
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
