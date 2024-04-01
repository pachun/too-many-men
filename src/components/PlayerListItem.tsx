import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import useTheme from "hooks/useTheme"
import type { Player } from "types/Player"
import AppText from "components/AppText"

export const paddingLeft = 10

interface PlayerListItemProps {
  player: Player
}

const PlayerListItem = ({
  player,
}: PlayerListItemProps): React.ReactElement => {
  const theme = useTheme()

  const [isTappingPlayer, setIsTappingPlayer] = React.useState(false)

  return (
    <ExpoRouter.Link href={`/players/${player.id}`} asChild>
      <ReactNative.Pressable
        style={{
          paddingTop: 15,
          paddingBottom: 15,
          paddingLeft,
          width: "100%",
          ...(isTappingPlayer
            ? {
                backgroundColor: theme.colors.listItemTapHighlightColor,
              }
            : {}),
        }}
        onPressIn={() => setIsTappingPlayer(true)}
        onPressOut={() => setIsTappingPlayer(false)}
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
          <AppText>
            {player.first_name}
            <AppText bold> {player.last_name}</AppText>
          </AppText>
        </ReactNative.View>
      </ReactNative.Pressable>
    </ExpoRouter.Link>
  )
}

export default PlayerListItem
