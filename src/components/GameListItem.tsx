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
        <ReactNative.View style={{ flexDirection: "row", width: 80 }}>
          <ReactNative.View>
            <ReactNative.Text>{formattedTime}</ReactNative.Text>
            <ReactNative.Text
              style={{ color: "gray", fontSize: 10, marginTop: 3 }}
            >
              {formattedDate}
            </ReactNative.Text>
          </ReactNative.View>
        </ReactNative.View>

        <ReactNative.View style={{ justifyContent: "center" }}>
          <ReactNative.Text style={{ textAlign: "center" }}>
            {/* Rink C */}
          </ReactNative.Text>
          <ReactNative.Text
            style={{
              textAlign: "center",
              color: "gray",
              fontSize: 10,
              marginTop: 3,
            }}
          >
            {game.is_home_team ? "Home" : "Away"}
          </ReactNative.Text>
        </ReactNative.View>

        <ReactNative.View style={{ width: 80 }}>
          <ReactNative.Text
            style={{
              textAlign: "right",
              color: ReactNative.PlatformColor("systemRed"),
              fontSize: 16,
            }}
          >
            {/* 0 - 4 L */}
          </ReactNative.Text>
          <ReactNative.Text
            style={{
              color: "gray",
              fontSize: 10,
              marginTop: 3,
              textAlign: "right",
            }}
          >
            {/* v Chicaronnes */}
          </ReactNative.Text>
        </ReactNative.View>
      </ReactNative.View>
    </ReactNative.View>
  )
}

export default GameListItem
