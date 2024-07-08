import type { Team } from "types/Team"

let numberOfTeams = 1

const teamFactory = (partialTeam?: Partial<Team>): Team => {
  const team: Team = {
    id: partialTeam?.id || numberOfTeams,
    name: partialTeam?.name || `Team ${numberOfTeams}`,
  }

  numberOfTeams += 1

  return team
}

export default teamFactory
