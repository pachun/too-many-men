import React from "react"
import emptyFunctionForInitializingContexts from "helpers/emptyFunctionForInitializingContexts"
import type { Children } from "types/Children"
import type { Game } from "types/Game"
import type { RefreshableRequest } from "types/RefreshableRequest"

export interface RefreshableGamesContextType {
  refreshableGames: RefreshableRequest<Game[]>
  setRefreshableGames: (refreshableGames: RefreshableRequest<Game[]>) => void
}

export const RefreshableGamesContext =
  React.createContext<RefreshableGamesContextType>({
    refreshableGames: { status: "Not Started" },
    setRefreshableGames: emptyFunctionForInitializingContexts,
  })

const RefreshableGamesProvider = ({
  children,
}: {
  children: Children
}): React.ReactElement => {
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
