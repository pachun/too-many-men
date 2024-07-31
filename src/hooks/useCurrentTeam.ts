import * as ExpoRouter from "expo-router"
import useTheCachedResourceFirstOrGetTheResourceFromTheApi from "hooks/useTheCachedResourceFirstOrGetTheResourceFromTheApi"
import useRefreshableTeams from "hooks/useRefreshableTeams"
import { unstable_settings } from "app/teams/[teamId]/players/_layout"
import type { Team } from "types/Team"

const useCurrentTeam = (): Team | undefined => {
  const { teamId } = ExpoRouter.useLocalSearchParams()
  const { refreshableTeams, setRefreshableTeams } = useRefreshableTeams()
  const team = useTheCachedResourceFirstOrGetTheResourceFromTheApi({
    resourceId: Number(teamId),
    resourceApiPath: `/teams/${teamId}`,
    refreshableResources: refreshableTeams,
    setRefreshableResources: setRefreshableTeams,
    unstable_settings: unstable_settings,
  })

  return team
}

export default useCurrentTeam
