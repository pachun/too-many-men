import type { Player } from "types/Player"

let numberOfPlayers = 1

const playerFactory = (partialPlayer?: Partial<Player>): Player => {
  const player: Player = {
    id: partialPlayer?.id || numberOfPlayers,
    first_name:
      partialPlayer?.first_name ||
      `Factory Generated Player First Name ${numberOfPlayers}`,
    last_name:
      partialPlayer?.last_name ||
      `Factory Generated Player Last Name ${numberOfPlayers}`,
    jersey_number: partialPlayer?.jersey_number,
    phone_number: partialPlayer?.phone_number,
  }

  numberOfPlayers += 1

  return player
}

export default playerFactory
