import React from "react"
import * as ReactNative from "react-native"
import type { Player } from "types/Player"
import PlayerListItem from "./PlayerListItem"

interface PlayerListProps {
  players: Player[]
  isRefreshing: boolean
  onRefresh: () => Promise<void>
}

const PlayerList = ({
  players,
  isRefreshing,
  onRefresh,
}: PlayerListProps): React.ReactElement => {
  return (
    <ReactNative.FlatList
      style={{ flex: 1 }}
      testID="Player List"
      data={players}
      keyExtractor={player => player.id.toString()}
      renderItem={({ item: player }) => <PlayerListItem player={player} />}
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
