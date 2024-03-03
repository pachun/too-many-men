import React from "react"
import * as ExpoRouter from "expo-router"
import GameList from "components/GameList"
import type { Game } from "types/Game"
import RefreshableResourceList from "components/RefreshableResourceList"

const Games = (): React.ReactElement => {
  return (
    <>
      <ExpoRouter.Stack.Screen options={{ title: "Games" }} />
      <RefreshableResourceList<Game>
        resourceApiPath="/games"
        ListComponent={GameList}
      />
    </>
  )
}

export default Games
