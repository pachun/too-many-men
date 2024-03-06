import React from "react"
import * as ExpoRouter from "expo-router"
import type { Player } from "types/Player"
import PlayerList from "components/PlayerList"
import RefreshableResourceList from "components/RefreshableResourceList"
import RefreshablePlayersContext from "components/PlayersProvider"

const Players = (): React.ReactElement => {
  const { refreshablePlayers, setRefreshablePlayers } = React.useContext(
    RefreshablePlayersContext,
  )

  return (
    <>
      <ExpoRouter.Stack.Screen options={{ title: "Team" }} />
      <RefreshableResourceList<Player>
        resourceApiPath="/players"
        refreshableResources={refreshablePlayers}
        setRefreshableResources={setRefreshablePlayers}
        ListComponent={PlayerList}
      />
    </>
  )
}

export default Players
