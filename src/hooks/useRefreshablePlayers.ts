import React from "react"
import type { Player } from "types/Player"
import type { RefreshableRequest } from "types/RefreshableRequest"
import NavigationHeaderToastNotification from "components/NavigationHeaderToastNotification"
import Config from "Config"

interface UseRefreshablePlayersReturnType {
  refreshablePlayers: RefreshableRequest<Player[]>
  loadPlayers: () => Promise<void>
  refreshPlayers: (playersBeforeRefresh: Player[]) => Promise<void>
}

const useRefreshablePlayers = (): UseRefreshablePlayersReturnType => {
  const [refreshablePlayers, setRefreshablePlayers] = React.useState<
    RefreshableRequest<Player[]>
  >({
    status: "Not Started",
  })

  const { showNotification } = React.useContext(
    NavigationHeaderToastNotification.Context,
  )

  const loadPlayers = React.useCallback(async (): Promise<void> => {
    setRefreshablePlayers({ status: "Loading" })
    try {
      setRefreshablePlayers({
        status: "Success",
        data: await (await fetch(`${Config.apiUrl}/players`)).json(),
      })
    } catch {
      showNotification({
        type: "warning",
        message: "Trouble Connecting to the Internet",
      })
      setRefreshablePlayers({ status: "Load Error" })
    }
  }, [showNotification])

  const refreshPlayers = React.useCallback(
    async (playersBeforeRefresh: Player[]): Promise<void> => {
      setRefreshablePlayers({
        status: "Refreshing",
        data: playersBeforeRefresh,
      })
      try {
        setRefreshablePlayers({
          status: "Success",
          data: await (await fetch(`${Config.apiUrl}/players`)).json(),
        })
      } catch {
        showNotification({
          type: "warning",
          message: "Trouble Connecting to the Internet",
        })
        setRefreshablePlayers({
          status: "Refresh Error",
          data: playersBeforeRefresh,
        })
      }
    },
    [showNotification],
  )

  return { refreshablePlayers, loadPlayers, refreshPlayers }
}

export default useRefreshablePlayers
