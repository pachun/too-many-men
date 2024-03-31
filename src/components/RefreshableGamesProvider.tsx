import React from "react"
import emptyFunctionForInitializingContexts from "helpers/emptyFunctionForInitializingContexts"
import type { Provider as ProviderType } from "types/Provider"
import type { Game } from "types/Game"
import type { RefreshableRequest } from "types/RefreshableRequest"

export interface RefreshableGamesContextType {
  refreshableGames: RefreshableRequest<Game[]>
  setRefreshableGames: React.Dispatch<
    React.SetStateAction<RefreshableRequest<Game[]>>
  >
}

export const RefreshableGamesContext =
  React.createContext<RefreshableGamesContextType>({
    refreshableGames: { status: "Not Started" },
    setRefreshableGames: emptyFunctionForInitializingContexts,
  })

const RefreshableGamesProvider: ProviderType = ({ children }) => {
  const [refreshableGames, setRefreshableGames] = React.useState<
    RefreshableRequest<Game[]>
  >({
    status: "Not Started",
  })

  return (
    <RefreshableGamesContext.Provider
      value={{ refreshableGames, setRefreshableGames }}
    >
      {children}
    </RefreshableGamesContext.Provider>
  )
}

export default RefreshableGamesProvider
