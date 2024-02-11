import React from "react"
import GameList from "components/GameList"
import type { Game } from "types/Game"
import RefreshableResourceList from "components/RefreshableResourceList"

const Games = (): React.ReactElement => (
  <RefreshableResourceList<Game>
    resourceApiPath="/games"
    ListComponent={GameList}
  />
)

export default Games
