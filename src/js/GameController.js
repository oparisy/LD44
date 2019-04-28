/* eslint-disable no-console */

const initCredits = 10000
const initToPlant = 'pine'

class GameController {
  constructor () {
    this.credits = initCredits
    this.toPlant = initToPlant
  }

  onTreeCut (tree) {
    console.log('Tree was cut, crediting:', tree.kind)
    this.credits += 500
  }

  onTreePlanted (tree) {
    console.log('Tree was planted, debiting:', tree.kind)
    this.credits -= 500
  }
}

export { GameController }
