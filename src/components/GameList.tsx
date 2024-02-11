import React from "react"
import * as ReactNative from "react-native"
import type { Game } from "types/Game"
import GameListItem, { paddingLeft } from "./GameListItem"
import * as DateFNS from "date-fns"
import ListItemSeparator from "./ListItemSeparator"
import type { ListComponentProps } from "types/ListComponent"

type GameListProps = ListComponentProps<Game>

const GameList = ({
  data: games,
  isRefreshing,
  onRefresh,
}: GameListProps): React.ReactElement => {
  const gamesSortedChronologicallyFromPastToFuture = React.useMemo(
    () =>
      games.sort((game1, game2) =>
        DateFNS.isAfter(
          DateFNS.parseISO(game1.played_at),
          DateFNS.parseISO(game2.played_at),
        )
          ? 1
          : -1,
      ),
    [games],
  )

  return (
    <ReactNative.FlatList
      style={{ flex: 1 }}
      testID="Game List"
      data={gamesSortedChronologicallyFromPastToFuture}
      keyExtractor={game => game.id.toString()}
      renderItem={({ item: game }) => <GameListItem game={game} />}
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

export default GameList
