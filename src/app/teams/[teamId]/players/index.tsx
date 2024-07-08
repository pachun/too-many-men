import React from "react"
import * as ExpoRouter from "expo-router"
import type { Player } from "types/Player"
import PlayerList from "components/PlayerList"
import RefreshableResourceList from "components/RefreshableResourceList"
import useRefreshablePlayers from "hooks/useRefreshablePlayers"

const Players = (): React.ReactElement => {
  const { teamId } = ExpoRouter.useGlobalSearchParams()
  const { refreshablePlayers, setRefreshablePlayers } = useRefreshablePlayers()

  return (
    <>
      <ExpoRouter.Stack.Screen options={{ title: "Team" }} />
      <RefreshableResourceList<Player>
        resourceApiPath={`/teams/${teamId}/players`}
        refreshableResources={refreshablePlayers}
        setRefreshableResources={setRefreshablePlayers}
        ListComponent={PlayerList}
      />
    </>
  )
}

export default Players
