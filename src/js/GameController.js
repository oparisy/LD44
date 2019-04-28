/* eslint-disable no-console */

const initCredits = 10000

class GameController {
  constructor () {
    this.credits = initCredits
  }

  onTreeCut (tree) {
    console.log('Tree was cut, crediting:', tree.type)
    this.credits += 500
  }
}

export { GameController }
