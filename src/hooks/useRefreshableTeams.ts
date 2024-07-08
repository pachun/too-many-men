import React from "react"
import { RefreshableTeamsContext } from "components/RefreshableTeamsProvider"
import type { RefreshableTeamsContextType } from "components/RefreshableTeamsProvider"

const useRefreshableTeams = (): RefreshableTeamsContextType => {
  const { refreshableTeams, setRefreshableTeams } = React.useContext(
    RefreshableTeamsContext,
  )

  return { refreshableTeams, setRefreshableTeams }
}

export default useRefreshableTeams
