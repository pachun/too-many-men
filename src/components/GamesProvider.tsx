import React from "react"
import type { RefreshableRequest } from "types/RefreshableRequest"
import type { Game } from "types/Game"

const RefreshableGamesContext = React.createContext<{
  refreshableGames: RefreshableRequest<Game[]>
  setRefreshableGames: (refreshableGames: RefreshableRequest<Game[]>) => void
}>({
  refreshableGames: { status: "Not Started" },
  setRefreshableGames: (): void => {},
})

export default RefreshableGamesContext
