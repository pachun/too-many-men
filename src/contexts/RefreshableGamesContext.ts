import React from "react"
import type { RefreshableGamesContext as RefreshableGamesContextType } from "types/RefreshableGamesContext"

// this function is never used so it's not covered by tests;
// but it's required to initialize the context
//* c8 ignore start */
const noOp = (): void => {}
//* c8 ignore end */

const RefreshableGamesContext =
  React.createContext<RefreshableGamesContextType>({
    refreshableGames: { status: "Not Started" },
    setRefreshableGames: noOp,
  })

export default RefreshableGamesContext
