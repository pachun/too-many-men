import React from "react"
import emptyFunctionForInitializingContexts from "helpers/emptyFunctionForInitializingContexts"
import type { Children } from "types/Children"
import type { Player } from "types/Player"
import type { RefreshableRequest } from "types/RefreshableRequest"

export interface RefreshablePlayersContextType {
  refreshablePlayers: RefreshableRequest<Player[]>
  setRefreshablePlayers: (
    refreshablePlayers: RefreshableRequest<Player[]>,
  ) => void
}

export const RefreshablePlayersContext =
  React.createContext<RefreshablePlayersContextType>({
    refreshablePlayers: { status: "Not Started" },
    setRefreshablePlayers: emptyFunctionForInitializingContexts,
  })

const RefreshablePlayersProvider = ({
  children,
}: {
  children: Children
}): React.ReactElement => {
  const [refreshablePlayers, setRefreshablePlayers] = React.useState<
    RefreshableRequest<Player[]>
  >({
    status: "Not Started",
  })

  return (
    <RefreshablePlayersContext.Provider
      value={{ refreshablePlayers, setRefreshablePlayers }}
    >
      {children}
    </RefreshablePlayersContext.Provider>
  )
}

export default RefreshablePlayersProvider
