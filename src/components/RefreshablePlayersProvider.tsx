import React from "react"
import emptyFunctionForInitializingContexts from "helpers/emptyFunctionForInitializingContexts"
import type { Provider as ProviderType } from "types/Provider"
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
    refreshablePlayers: { type: "Without Data", status: "Not Started" },
    setRefreshablePlayers: emptyFunctionForInitializingContexts,
  })

const RefreshablePlayersProvider: ProviderType = ({ children }) => {
  const [refreshablePlayers, setRefreshablePlayers] = React.useState<
    RefreshableRequest<Player[]>
  >({
    type: "Without Data",
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
