import React from "react"
import * as ExpoRouter from "expo-router"
import type { Game } from "types/Game"
import Config from "Config"
import useRefreshableGames from "hooks/useRefreshableGames"
import useApiToken from "./useApiToken"

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

  const { apiToken } = useApiToken()

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

        const getGameFromApi = async (): Promise<Game | undefined> => {
          if (apiToken) {
            return await (
              await fetch(Config.apiUrl + `/teams/${teamId}/games/${gameId}`, {
                headers: {
                  "Content-Type": "Application/JSON",
                  "ApiToken": apiToken,
                },
              })
            ).json()
          }
        }

        const cachedGame = getGameFromCache()

        if (cachedGame) {
          setGame(cachedGame)
        } else {
          const gameFromApi = await getGameFromApi()
          if (gameFromApi) {
            setRefreshableGames({ status: "Success", data: [gameFromApi] })
          }
          setGame(gameFromApi)
        }
      }

      getGame()
    }, [teamId, gameId, refreshableGames, setRefreshableGames, apiToken]),
  )

  return game
}

export default useTheCachedGameFirstOrGetTheGameFromTheApi
