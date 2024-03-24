import React from "react"
import * as ExpoRouter from "expo-router"
import type { Game } from "types/Game"
import Config from "Config"
import useRefreshableGames from "./useRefreshableGames"

const useTheCachedGameFirstOrGetTheGameFromTheApi = (
  gameId: string | string[] | undefined,
): Game | undefined => {
  const [game, setGame] = React.useState<Game | undefined>()

  const { refreshableGames, setRefreshableGames } = useRefreshableGames()

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

        const getGameFromApi = async (): Promise<Game> => {
          return await (await fetch(Config.apiUrl + `/games/${gameId}`)).json()
        }

        const cachedGame = getGameFromCache()

        if (cachedGame) {
          setGame(cachedGame)
        } else {
          const gameFromApi = await getGameFromApi()
          setRefreshableGames({ status: "Success", data: [gameFromApi] })
          setGame(gameFromApi)
        }
      }

      getGame()
    }, [gameId, refreshableGames, setRefreshableGames]),
  )

  return game
}

export default useTheCachedGameFirstOrGetTheGameFromTheApi
