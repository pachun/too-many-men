const getThePlayerFromTheContextCacheFirstOrTheApiSecond = ({
  playerId,
}: {
  playerId: string | string[] | undefined
}) => {
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
      return await (await fetch(Config.apiUrl + `/players/${playerId}`)).json()
    }

    const cachedPlayer = getPlayerFromCache()

    setPlayer(cachedPlayer ? cachedPlayer : await getPlayerFromApi())
  }
}

export default getThePlayerFromTheContextCacheFirstOrTheApiSecond
