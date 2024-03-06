import React from "react"
import type { RefreshableRequest } from "types/RefreshableRequest"
import type { Game } from "types/Game"

// this function is never used so it's not covered by tests;
// but it's required to initialize the context
//* c8 ignore start */
const noOp = (): void => {}
//* c8 ignore end */

const RefreshableGamesContext = React.createContext<{
  refreshableGames: RefreshableRequest<Game[]>
  setRefreshableGames: (refreshableGames: RefreshableRequest<Game[]>) => void
}>({
  refreshableGames: { status: "Not Started" },
  setRefreshableGames: noOp,
})

export default RefreshableGamesContext
