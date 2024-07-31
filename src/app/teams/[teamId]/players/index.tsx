import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import * as ExpoVectorIcons from "@expo/vector-icons"
import type { Player } from "types/Player"
import PlayerList from "components/PlayerList"
import RefreshableResourceList from "components/RefreshableResourceList"
import useRefreshablePlayers from "hooks/useRefreshablePlayers"
import BackButtonWithTestId from "components/BackButonWithTestId"
import useTheme from "hooks/useTheme"

const Players = (): React.ReactElement => {
  const theme = useTheme()
  const router = ExpoRouter.useRouter()
  const { teamId } = ExpoRouter.useGlobalSearchParams()
  const { refreshablePlayers, setRefreshablePlayers } = useRefreshablePlayers()

  return (
    <>
      <ExpoRouter.Stack.Screen
        options={{
          title: "Players",
          headerLeft: () => (
            <BackButtonWithTestId title="Teams" route="/teams" />
          ),
          headerRight: () => (
            <ReactNative.Pressable
              onPress={() => {
                router.navigate(`/teams/${teamId}/players/new`)
              }}
            >
              <ExpoVectorIcons.Ionicons
                name="add"
                size={30}
                color={theme.colors.primary}
                testID="Add Player"
              />
            </ReactNative.Pressable>
          ),
        }}
      />
      {teamId && (
        <RefreshableResourceList<Player>
          resourceApiPath={`/teams/${teamId}/players`}
          refreshableResources={refreshablePlayers}
          setRefreshableResources={setRefreshablePlayers}
          ListComponent={PlayerList}
        />
      )}
    </>
  )
}

export default Players
