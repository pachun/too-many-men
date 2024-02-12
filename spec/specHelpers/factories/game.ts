import type { Game } from "types/Game"

let numberOfGames = 0

const gameFactory = (partialGame: Partial<Game>): Game => {
  const game: Game = {
    id: partialGame.id || numberOfGames,
    played_at: partialGame.played_at || new Date().toISOString(),
    is_home_team: partialGame.is_home_team || false,
    rink: partialGame.rink || `Factory Generated Rink ${numberOfGames}`,
  }

  numberOfGames += 1

  return game
}

export default gameFactory
