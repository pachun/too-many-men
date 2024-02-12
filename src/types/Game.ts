export interface Game {
  id: number
  played_at: string
  is_home_team: boolean
  rink?: string
  opposing_teams_name?: string
}
