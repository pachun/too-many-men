import type { RefreshableRequest } from "types/RefreshableRequest"
import type { Player } from "types/Player"

export interface RefreshablePlayersContext {
  refreshablePlayers: RefreshableRequest<Player[]>
  setRefreshablePlayers: (
    refreshablePlayers: RefreshableRequest<Player[]>,
  ) => void
}
