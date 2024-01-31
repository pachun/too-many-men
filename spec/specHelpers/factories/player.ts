import type { Player } from "types/Player"

let numberOfPlayers = 0

const playerFactory = (partialPlayer: Partial<Player>): Player => {
  const player: Player = {
    id: partialPlayer.id || numberOfPlayers,
    name:
      partialPlayer.name || `Factory Generated Player Name ${numberOfPlayers}`,
  }

  numberOfPlayers += 1

  return player
}

export default playerFactory
