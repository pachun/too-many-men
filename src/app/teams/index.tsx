import React from "react"
import * as ReactNative from "react-native"
import type { Team } from "types/Team"
import TeamList from "components/TeamList"
import RefreshableResourceList from "components/RefreshableResourceList"
import useRefreshableTeams from "hooks/useRefreshableTeams"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useTheme from "hooks/useTheme"

const Teams = (): React.ReactElement => {
  const theme = useTheme()

  const { refreshableTeams, setRefreshableTeams } = useRefreshableTeams()

  const { top } = useSafeAreaInsets()

  return (
    <ReactNative.View
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ReactNative.View style={{ height: top }} />
      <RefreshableResourceList<Team>
        resourceApiPath="/teams"
        refreshableResources={refreshableTeams}
        setRefreshableResources={setRefreshableTeams}
        ListComponent={TeamList}
      />
    </ReactNative.View>
  )
}

export default Teams
