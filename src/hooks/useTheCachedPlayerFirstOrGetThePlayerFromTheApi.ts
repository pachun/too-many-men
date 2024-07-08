import React from "react"
import * as ExpoRouter from "expo-router"
import type { Player } from "types/Player"
import Config from "Config"
import useRefreshablePlayers from "hooks/useRefreshablePlayers"
import useApiToken from "./useApiToken"

type UseLocalSearchParamsReturnType = string | string[] | undefined
interface Arguments {
  teamId: UseLocalSearchParamsReturnType
  playerId: UseLocalSearchParamsReturnType
}

const useTheCachedPlayerFirstOrGetThePlayerFromTheApi = ({
  teamId,
  playerId,
}: Arguments): Player | undefined => {
  const [player, setPlayer] = React.useState<Player | undefined>()

  const { refreshablePlayers } = useRefreshablePlayers()

  const { apiToken } = useApiToken()

  ExpoRouter.useFocusEffect(
    React.useCallback(() => {
      const getPlayer = async (): Promise<void> => {
        const getPlayerFromCache = (): Player | undefined => {
          if (
            refreshablePlayers.status === "Success" ||
            refreshablePlayers.status === "Refreshing" ||
            refreshablePlayers.status === "Refresh Error"
          ) {
            return refreshablePlayers.data.find(
              refreshablePlayer => refreshablePlayer.id === Number(playerId),
            )
          }
        }

        const getPlayerFromApi = async (): Promise<Player | undefined> => {
          if (apiToken) {
            return await (
              await fetch(
                Config.apiUrl + `/teams/${teamId}/players/${playerId}`,
                {
                  headers: {
                    "Content-Type": "Application/JSON",
                    "ApiToken": apiToken,
                  },
                },
              )
            ).json()
          }
        }

        const cachedPlayer = getPlayerFromCache()

        setPlayer(cachedPlayer ? cachedPlayer : await getPlayerFromApi())
      }

      getPlayer()
    }, [teamId, playerId, refreshablePlayers, apiToken]),
  )

  return player
}

export default useTheCachedPlayerFirstOrGetThePlayerFromTheApi
