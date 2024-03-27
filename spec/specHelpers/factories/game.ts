import type { DeepPartial } from "types/DeepPartial"
import type { Game } from "types/Game"
import playerFactory from "./player"

let numberOfGames = 1

const gameFactory = (partialGame: DeepPartial<Game>): Game => {
  const game: Game = {
    id: partialGame.id || numberOfGames,
    played_at: partialGame.played_at || new Date().toISOString(),
    is_home_team: partialGame.is_home_team || false,
    rink: partialGame.rink,
    opposing_teams_name: partialGame.opposing_teams_name,
    goals_for: partialGame.goals_for,
    goals_against: partialGame.goals_against,
    players: partialGame.players
      ? partialGame.players.map(p => playerFactory(p))
      : [],
    ids_of_players_who_responded_yes_to_attending:
      (partialGame.ids_of_players_who_responded_yes_to_attending as number[]) ||
      [],
    ids_of_players_who_responded_no_to_attending:
      (partialGame.ids_of_players_who_responded_no_to_attending as number[]) ||
      [],
    ids_of_players_who_responded_maybe_to_attending:
      (partialGame.ids_of_players_who_responded_maybe_to_attending as number[]) ||
      [],
  }

  numberOfGames += 1

  return game
}

export default gameFactory
