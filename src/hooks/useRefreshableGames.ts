import React from "react"
import { RefreshableGamesContext } from "components/RefreshableGamesProvider"
import type { RefreshableGamesContextType } from "components/RefreshableGamesProvider"

const useRefreshableGames = (): RefreshableGamesContextType => {
  const { refreshableGames, setRefreshableGames } = React.useContext(
    RefreshableGamesContext,
  )

  return { refreshableGames, setRefreshableGames }
}

export default useRefreshableGames
