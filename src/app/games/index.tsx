import React from "react"
import * as ExpoRouter from "expo-router"
import GameList from "components/GameList"
import type { Game } from "types/Game"
import RefreshableResourceList from "components/RefreshableResourceList"
import RefreshableGamesContext from "components/GamesProvider"

const Games = (): React.ReactElement => {
  const { refreshableGames, setRefreshableGames } = React.useContext(
    RefreshableGamesContext,
  )

  return (
    <>
      <ExpoRouter.Stack.Screen options={{ title: "Games" }} />
      <RefreshableResourceList<Game>
        resourceApiPath="/games"
        refreshableResources={refreshableGames}
        setRefreshableResources={setRefreshableGames}
        ListComponent={GameList}
      />
    </>
  )
}

export default Games
