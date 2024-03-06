import React from "react"
import type { RefreshableRequest } from "types/RefreshableRequest"
import type { Player } from "types/Player"

const RefreshablePlayersContext = React.createContext<{
  refreshablePlayers: RefreshableRequest<Player[]>
  setRefreshablePlayers: (
    refreshablePlayers: RefreshableRequest<Player[]>,
  ) => void
}>({
  refreshablePlayers: { status: "Not Started" },
  setRefreshablePlayers: (): void => {},
})

export default RefreshablePlayersContext
