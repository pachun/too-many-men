import type { RefreshableRequest } from "types/RefreshableRequest"
import type { Game } from "types/Game"

export interface RefreshableGamesContext {
  refreshableGames: RefreshableRequest<Game[]>
  setRefreshableGames: (refreshableGames: RefreshableRequest<Game[]>) => void
}
