import * as ExpoRouter from "expo-router"
import useTheCachedResourceFirstOrGetTheResourceFromTheApi from "hooks/useTheCachedResourceFirstOrGetTheResourceFromTheApi"
import useRefreshablePlayers from "hooks/useRefreshablePlayers"
import type { Player, Player as PlayerType } from "types/Player"
import { unstable_settings } from "app/teams/[teamId]/players/_layout"

const useCurrentPlayer = (): Player | undefined => {
  const { teamId, playerId } = ExpoRouter.useLocalSearchParams()
  const { refreshablePlayers, setRefreshablePlayers } = useRefreshablePlayers()
  const player =
    useTheCachedResourceFirstOrGetTheResourceFromTheApi<PlayerType>({
      resourceId: Number(playerId),
      resourceApiPath: `/teams/${teamId}/players/${playerId}`,
      refreshableResources: refreshablePlayers,
      setRefreshableResources: setRefreshablePlayers,
      unstable_settings,
    })

  return player
}

export default useCurrentPlayer
