import type { Player } from "types/Player"

export interface Game {
  id: number
  played_at: string
  is_home_team: boolean
  rink?: string
  opposing_teams_name?: string
  goals_for?: number
  goals_against?: number
  players: Player[]
  ids_of_players_who_responded_yes_to_attending: number[]
  ids_of_players_who_responded_no_to_attending: number[]
  ids_of_players_who_responded_maybe_to_attending: number[]
}
