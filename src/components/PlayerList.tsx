import React from "react"
import * as ReactNative from "react-native"
import PlayerListItem, { paddingLeft } from "components/PlayerListItem"
import ListItemSeparator from "components/ListItemSeparator"
import type { Player } from "types/Player"
import type { ListComponentProps } from "types/ListComponent"

type PlayerListProps = ListComponentProps<Player>

const PlayerList = ({
  data: players,
  isRefreshing,
  onRefresh,
}: PlayerListProps): React.ReactElement => {
  const playersSortedAlphabeticallyByLastName = React.useMemo(
    () =>
      players.sort((player1, player2) =>
        player1.last_name[0].toUpperCase() > player2.last_name[0].toUpperCase()
          ? 1
          : -1,
      ),
    [players],
  )

  return (
    <ReactNative.FlatList
      style={{ flex: 1 }}
      testID="Player List"
      data={playersSortedAlphabeticallyByLastName}
      keyExtractor={player => player.id.toString()}
      renderItem={({ item: player }) => <PlayerListItem player={player} />}
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

export default PlayerList
