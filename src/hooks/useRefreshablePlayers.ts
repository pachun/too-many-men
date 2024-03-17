import React from "react"
import { RefreshablePlayersContext } from "components/RefreshablePlayersProvider"
import type { RefreshablePlayersContextType } from "components/RefreshablePlayersProvider"

const useRefreshablePlayers = (): RefreshablePlayersContextType => {
  const { refreshablePlayers, setRefreshablePlayers } = React.useContext(
    RefreshablePlayersContext,
  )

  return { refreshablePlayers, setRefreshablePlayers }
}

export default useRefreshablePlayers
