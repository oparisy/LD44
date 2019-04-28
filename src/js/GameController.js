/* eslint-disable no-console */

const initCredits = 10000
const initToPlant = 'pine'

class GameController {
  constructor () {
    this.credits = initCredits
    this.toPlant = initToPlant
    this.elapsedTime = 0
    this.hour = 12
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
    while (this.elapsedTime > 1000) {
      this.hour = (this.hour + 1) % 24
      this.elapsedTime -= 1000
    }
  }
}

export { GameController }
