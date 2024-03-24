import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import useTheme from "hooks/useTheme"
import type { Player } from "types/Player"

export const paddingLeft = 10

interface PlayerListItemProps {
  player: Player
}

const PlayerListItem = ({
  player,
}: PlayerListItemProps): React.ReactElement => {
  const theme = useTheme()

  return (
    <ExpoRouter.Link href={`/players/${player.id}`} asChild>
      <ReactNative.Pressable
        style={{
          paddingTop: 15,
          paddingBottom: 15,
          paddingLeft,
          width: "100%",
        }}
        testID="Player List Item"
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
          <ReactNative.Text style={{ color: theme.colors.text, fontSize: 20 }}>
            {player.first_name}
            <ReactNative.Text style={{ fontWeight: "bold" }}>
              {" "}
              {player.last_name}
            </ReactNative.Text>
          </ReactNative.Text>
        </ReactNative.View>
      </ReactNative.Pressable>
    </ExpoRouter.Link>
  )
}

export default PlayerListItem
