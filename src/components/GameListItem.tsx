import React from "react"
import * as ReactNative from "react-native"
import * as DateFNS from "date-fns"
import type { Game } from "types/Game"

export const paddingLeft = 10

interface GameListItemProps {
  game: Game
}

const GameListItem = ({ game }: GameListItemProps): React.ReactElement => {
  const formattedDate = React.useMemo(() => {
    return DateFNS.format(DateFNS.parseISO(game.played_at), "MMM d")
  }, [game.played_at])

  const formattedTime = React.useMemo(() => {
    return DateFNS.format(DateFNS.parseISO(game.played_at), "h:mm a")
  }, [game.played_at])

  return (
    <ReactNative.View
      style={{ height: 44, paddingLeft, width: "100%" }}
      testID="Game List Item"
    >
      <ReactNative.View
        style={{
          flex: 1,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingRight: 10,
        }}
      >
        <ReactNative.Text>{formattedDate}</ReactNative.Text>
        <ReactNative.Text>{formattedTime}</ReactNative.Text>
      </ReactNative.View>
    </ReactNative.View>
  )
}

export default GameListItem
