import React from "react"
import type { Player } from "types/Player"
import PlayerList from "components/PlayerList"
import RefreshableResourceList from "components/RefreshableResourceList"

const Team = (): React.ReactElement => (
  <RefreshableResourceList<Player>
    resourceApiPath="/players"
    ListComponent={PlayerList}
  />
)

export default Team
