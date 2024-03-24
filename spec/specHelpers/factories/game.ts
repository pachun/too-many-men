import type { Game } from "types/Game"

let numberOfGames = 0

const gameFactory = (partialGame: Partial<Game>): Game => {
  const game: Game = {
    id: partialGame.id || numberOfGames,
    played_at: partialGame.played_at || new Date().toISOString(),
    is_home_team: partialGame.is_home_team || false,
    rink: partialGame.rink,
    opposing_teams_name: partialGame.opposing_teams_name,
    goals_for: partialGame.goals_for,
    goals_against: partialGame.goals_against,
    players: partialGame.players || [],
    ids_of_players_who_responded_yes_to_attending:
      partialGame.ids_of_players_who_responded_yes_to_attending || [],
    ids_of_players_who_responded_no_to_attending:
      partialGame.ids_of_players_who_responded_no_to_attending || [],
    ids_of_players_who_responded_maybe_to_attending:
      partialGame.ids_of_players_who_responded_maybe_to_attending || [],
  }

  numberOfGames += 1

  return game
}

export default gameFactory
