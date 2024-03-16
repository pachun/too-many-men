import React from "react"
import type { RefreshablePlayersContext as RefreshablePlayersContextType } from "types/RefreshablePlayersContext"

// this function is never used so it's not covered by tests;
// but it's required to initialize the context
//* c8 ignore start */
const noOp = (): void => {}
//* c8 ignore end */

const RefreshablePlayersContext =
  React.createContext<RefreshablePlayersContextType>({
    refreshablePlayers: { status: "Not Started" },
    setRefreshablePlayers: noOp,
  })

export default RefreshablePlayersContext
