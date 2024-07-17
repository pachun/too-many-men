import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import * as ExpoVectorIcons from "@expo/vector-icons"
import type { Team } from "types/Team"
import TeamList from "components/TeamList"
import RefreshableResourceList from "components/RefreshableResourceList"
import useRefreshableTeams from "hooks/useRefreshableTeams"
import useApiToken from "hooks/useApiToken"
import useUserId from "hooks/useUserId"
import useTheme from "hooks/useTheme"

const Teams = (): React.ReactElement => {
  const router = ExpoRouter.useRouter()
  const theme = useTheme()
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
          headerLeft: () => (
            <ReactNative.Pressable
              testID="Signout Button"
              hitSlop={50}
              onPress={signout}
            >
              <ExpoVectorIcons.SimpleLineIcons
                name="logout"
                size={20}
                color={theme.colors.primary}
              />
            </ReactNative.Pressable>
          ),
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
