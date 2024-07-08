import React from "react"
import * as ReactNative from "react-native"
import TeamListItem, { paddingLeft } from "components/TeamListItem"
import ListItemSeparator from "components/ListItemSeparator"
import type { Team } from "types/Team"
import type { ListComponentProps } from "types/ListComponent"

type TeamListProps = ListComponentProps<Team>

const TeamList = ({
  data: teams,
  isRefreshing,
  onRefresh,
}: TeamListProps): React.ReactElement => {
  const teamsSortedAlphabeticallyByName = React.useMemo(
    () =>
      teams.sort((team1, team2) =>
        team1.name[0].toUpperCase() > team2.name[0].toUpperCase() ? 1 : -1,
      ),
    [teams],
  )

  return (
    <ReactNative.FlatList
      style={{ flex: 1 }}
      testID="Team List"
      data={teamsSortedAlphabeticallyByName}
      keyExtractor={team => team.id.toString()}
      renderItem={({ item: team }) => <TeamListItem team={team} />}
      ItemSeparatorComponent={() => (
        <ListItemSeparator paddingLeft={paddingLeft} />
      )}
      refreshControl={
        <ReactNative.RefreshControl
          enabled={!isRefreshing}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      }
    />
  )
}

export default TeamList
