import React from "react"
import type { Game } from "types/Game"
import type { GameOutcome } from "types/GameOutcome"

const useGameOutcome = (game: Game): GameOutcome => {
  const gameOutcome = React.useMemo((): GameOutcome => {
    if (game.goals_for !== undefined && game.goals_against !== undefined) {
      if (game.goals_for > game.goals_against) {
        return "Win"
      } else if (game.goals_for < game.goals_against) {
        return "Loss"
      }
      return "Tie"
    }
    return "Unplayed"
  }, [game.goals_for, game.goals_against])

  return gameOutcome
}

export default useGameOutcome
