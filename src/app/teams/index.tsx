import React from "react"
import * as ExpoRouter from "expo-router"
import type { Team } from "types/Team"
import TeamList from "components/TeamList"
import RefreshableResourceList from "components/RefreshableResourceList"
import useRefreshableTeams from "hooks/useRefreshableTeams"
import useApiToken from "hooks/useApiToken"
import useUserId from "hooks/useUserId"
import SignOutButton from "components/SignOutButton"

const Teams = (): React.ReactElement => {
  const router = ExpoRouter.useRouter()
  const { setUserId } = useUserId()
  const { setApiToken } = useApiToken()
  const { refreshableTeams, setRefreshableTeams } = useRefreshableTeams()

  const signout = React.useCallback(() => {
    setApiToken(null)
    setUserId(null)
    router.navigate("/login")
  }, [setApiToken, setUserId, router])

  return (
    <>
      <ExpoRouter.Stack.Screen
        options={{
          headerShown: true,
          title: "Teams",
          headerLeft: () => <SignOutButton onPress={signout} />,
        }}
      />
      <RefreshableResourceList<Team>
        resourceApiPath="/teams"
        refreshableResources={refreshableTeams}
        setRefreshableResources={setRefreshableTeams}
        ListComponent={TeamList}
      />
    </>
  )
}

export default Teams
