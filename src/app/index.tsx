import React from "react"
import * as ExpoRouter from "expo-router"
import NavigationHeaderToastNotification from "components/NavigationHeaderToastNotification"
import CenteredLoadingSpinner from "components/CenteredLoadingSpinner"
import CenteredReloadButton from "components/CenteredReloadButton"
import PlayerList from "components/PlayerList"
import useRefreshablePlayers from "hooks/useRefreshablePlayers"

const App = (): React.ReactElement => {
  const { dismissNotification } = React.useContext(
    NavigationHeaderToastNotification.Context,
  )

  const { refreshablePlayers, loadPlayers, refreshPlayers } =
    useRefreshablePlayers()

  React.useEffect(() => {
    loadPlayers()
  }, [loadPlayers])

  return (
    <>
      <ExpoRouter.Stack.Screen options={{ title: "Teammates" }} />

      {(refreshablePlayers.status === "Not Started" ||
        refreshablePlayers.status === "Loading") && <CenteredLoadingSpinner />}

      {(refreshablePlayers.status === "Success" ||
        refreshablePlayers.status === "Refreshing" ||
        refreshablePlayers.status === "Refresh Error") && (
        <PlayerList
          players={refreshablePlayers.data}
          isRefreshing={refreshablePlayers.status === "Refreshing"}
          onRefresh={() => refreshPlayers(refreshablePlayers.data)}
        />
      )}

      {refreshablePlayers.status === "Load Error" && (
        <CenteredReloadButton
          onPress={() => {
            dismissNotification()
            loadPlayers()
          }}
        />
      )}
    </>
  )
}

export default App
