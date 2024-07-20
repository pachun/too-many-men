import React from "react"
import * as ExpoRouter from "expo-router"
import type { Player } from "types/Player"
import Config from "Config"
import useRefreshablePlayers from "hooks/useRefreshablePlayers"
import useApiToken from "./useApiToken"
import { unstable_settings } from "app/teams/[teamId]/players/_layout"
import previousScreenIsPrefetchingResourcesToKeepBackButtonsWorkingAfterDeepLink from "helpers/previousScreenIsPrefetchingResourcesToKeepBackButtonsWorkingAfterDeepLink"

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
            /* c8 ignore start */
            // This is only untested (and currently unused) because of the
            // preloading that's happening to keep back buttons working after
            // deep links are used. Git blame me.
            refreshablePlayers.status === "Success" ||
            refreshablePlayers.status === "Refreshing" ||
            refreshablePlayers.status === "Refresh Error"
            /* c8 ignore end */
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

      if (
        !previousScreenIsPrefetchingResourcesToKeepBackButtonsWorkingAfterDeepLink<
          Player[]
        >({
          unstable_settings,
          refreshableResources: refreshablePlayers,
        })
      ) {
        getPlayer()
      }
    }, [teamId, playerId, refreshablePlayers, apiToken]),
  )

  return player
}

export default useTheCachedPlayerFirstOrGetThePlayerFromTheApi
