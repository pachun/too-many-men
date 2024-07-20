import React from "react"
import * as ExpoRouter from "expo-router"
import GameList from "components/GameList"
import type { Game } from "types/Game"
import RefreshableResourceList from "components/RefreshableResourceList"
import useRefreshableGames from "hooks/useRefreshableGames"
import BackButtonWithTestId from "components/BackButonWithTestId"

const Games = (): React.ReactElement => {
  const { teamId } = ExpoRouter.useGlobalSearchParams()
  const { refreshableGames, setRefreshableGames } = useRefreshableGames()

  return (
    <>
      <ExpoRouter.Stack.Screen
        options={{
          title: "Games",
          headerLeft: () => (
            <BackButtonWithTestId title="Teams" route="/teams" />
          ),
        }}
      />
      {teamId && (
        <RefreshableResourceList<Game>
          resourceApiPath={`/teams/${teamId}/games`}
          refreshableResources={refreshableGames}
          setRefreshableResources={setRefreshableGames}
          ListComponent={GameList}
        />
      )}
    </>
  )
}

export default Games
