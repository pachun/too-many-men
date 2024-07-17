import React from "react"
import * as ExpoRouter from "expo-router"
import type { Game } from "types/Game"
import useRefreshableGames from "hooks/useRefreshableGames"
import useApi from "./useApi"

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
            refreshableGames.status === "Success" ||
            refreshableGames.status === "Refreshing" ||
            refreshableGames.status === "Refresh Error"
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
            // make these two get-from-cache-then-api hooks one hook
          })
        }
      }

      getGame()
    }, [getResource, teamId, gameId, refreshableGames, setRefreshableGames]),
  )

  return game
}

export default useTheCachedGameFirstOrGetTheGameFromTheApi
