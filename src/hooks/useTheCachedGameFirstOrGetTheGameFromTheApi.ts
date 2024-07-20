import React from "react"
import * as ExpoRouter from "expo-router"
import type { Game } from "types/Game"
import useRefreshableGames from "hooks/useRefreshableGames"
import useApi from "./useApi"
import { unstable_settings } from "app/teams/[teamId]/games/_layout"
import previousScreenIsPrefetchingResourcesToKeepBackButtonsWorkingAfterDeepLink from "helpers/previousScreenIsPrefetchingResourcesToKeepBackButtonsWorkingAfterDeepLink"

type UseLocalSearchParamsReturnType = string | string[] | undefined
interface Arguments {
  teamId: UseLocalSearchParamsReturnType
  gameId: UseLocalSearchParamsReturnType
}

const useTheCachedGameFirstOrGetTheGameFromTheApi = ({
  teamId,
  gameId,
}: Arguments): Game | undefined => {
  const [game, setGame] = React.useState<Game | undefined>()
  const { refreshableGames, setRefreshableGames } = useRefreshableGames()
  const { getResource } = useApi()

  ExpoRouter.useFocusEffect(
    React.useCallback(() => {
      const getGame = async (): Promise<void> => {
        const getGameFromCache = (): Game | undefined => {
          if (
            /* c8 ignore start */
            // This is only untested (and currently unused) because of the
            // preloading that's happening to keep back buttons working after
            // deep links are used. Git blame me.
            refreshableGames.status === "Success" ||
            refreshableGames.status === "Refreshing" ||
            refreshableGames.status === "Refresh Error"
            /* c8 ignore end */
          ) {
            return refreshableGames.data.find(
              refreshableGame => refreshableGame.id === Number(gameId),
            )
          }
        }

        const cachedGame = getGameFromCache()

        if (cachedGame) {
          setGame(cachedGame)
        } else {
          getResource<Game>({
            resourceApiPath: `/teams/${teamId}/games/${gameId}`,
            onSuccess: (gameFromApi: Game) => {
              if (gameFromApi) {
                setRefreshableGames({ status: "Success", data: [gameFromApi] })
                setGame(gameFromApi)
              }
            },
          })
        }
      }

      if (
        !previousScreenIsPrefetchingResourcesToKeepBackButtonsWorkingAfterDeepLink<
          Game[]
        >({ unstable_settings, refreshableResources: refreshableGames })
      ) {
        getGame()
      }
    }, [getResource, teamId, gameId, refreshableGames, setRefreshableGames]),
  )

  return game
}

export default useTheCachedGameFirstOrGetTheGameFromTheApi
