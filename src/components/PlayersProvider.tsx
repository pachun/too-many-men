import React from "react"
import type { RefreshableRequest } from "types/RefreshableRequest"
import type { Player } from "types/Player"

// this function is never used so it's not covered by tests;
// but it's required to initialize the context
//* c8 ignore start */
const noOp = (): void => {}
//* c8 ignore end */

const RefreshablePlayersContext = React.createContext<{
  refreshablePlayers: RefreshableRequest<Player[]>
  setRefreshablePlayers: (
    refreshablePlayers: RefreshableRequest<Player[]>,
  ) => void
}>({
  refreshablePlayers: { status: "Not Started" },
  setRefreshablePlayers: noOp,
})

export default RefreshablePlayersContext
