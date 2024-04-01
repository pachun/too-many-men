import React from "react"
import * as ExpoRouter from "expo-router"
import type { Player } from "types/Player"
import Config from "Config"
import useRefreshablePlayers from "hooks/useRefreshablePlayers"

const useTheCachedPlayerFirstOrGetThePlayerFromTheApi = (
  playerId: string | string[] | undefined,
): Player | undefined => {
  const [player, setPlayer] = React.useState<Player | undefined>()

  const { refreshablePlayers } = useRefreshablePlayers()

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

        const getPlayerFromApi = async (): Promise<Player> => {
          return await (
            await fetch(Config.apiUrl + `/players/${playerId}`)
          ).json()
        }

        const cachedPlayer = getPlayerFromCache()

        setPlayer(cachedPlayer ? cachedPlayer : await getPlayerFromApi())
      }

      getPlayer()
    }, [playerId, refreshablePlayers]),
  )

  return player
}

export default useTheCachedPlayerFirstOrGetThePlayerFromTheApi
