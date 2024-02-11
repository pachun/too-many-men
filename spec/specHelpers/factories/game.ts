import type { Game } from "types/Game"

let numberOfGames = 0

const gameFactory = (partialGame: Partial<Game>): Game => {
  const game: Game = {
    id: partialGame.id || numberOfGames,
    played_at: partialGame.played_at || new Date().toISOString(),
  }

  numberOfGames += 1

  return game
}

export default gameFactory
