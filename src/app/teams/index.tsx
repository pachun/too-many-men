import React from "react"
import type { Team } from "types/Team"
import TeamList from "components/TeamList"
import RefreshableResourceList from "components/RefreshableResourceList"
import useRefreshableTeams from "hooks/useRefreshableTeams"

const Teams = (): React.ReactElement => {
  const { refreshableTeams, setRefreshableTeams } = useRefreshableTeams()

  return (
    <RefreshableResourceList<Team>
      resourceApiPath="/teams"
      refreshableResources={refreshableTeams}
      setRefreshableResources={setRefreshableTeams}
      ListComponent={TeamList}
    />
  )
}

export default Teams
