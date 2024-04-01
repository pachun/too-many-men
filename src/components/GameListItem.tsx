import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import useTheme from "hooks/useTheme"
import type { Game } from "types/Game"
import GameListItemDate from "./GameListItemDate"
import GameListItemDescription from "./GameListItemDescription"
import GameListItemOutcome from "./GameListItemOutcome"

export const paddingLeft = 10

interface GameListItemProps {
  game: Game
}

const GameListItem = ({ game }: GameListItemProps): React.ReactElement => {
  const theme = useTheme()

  const [isTappingGame, setIsTappingGame] = React.useState(false)

  return (
    <ExpoRouter.Link href={`/games/${game.id}`} asChild>
      <ReactNative.Pressable
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft,
          width: "100%",
          ...(isTappingGame
            ? {
                backgroundColor: theme.colors.listItemTapHighlightColor,
              }
            : {}),
        }}
        onPressIn={() => setIsTappingGame(true)}
        onPressOut={() => setIsTappingGame(false)}
        testID="Game List Item"
      >
        <ReactNative.View style={{ flexDirection: "row" }}>
          <GameListItemDate game={game} />
          <ReactNative.View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingLeft: 20,
              paddingRight: 20,
              flex: 1,
            }}
          >
            <GameListItemDescription game={game} />
            <GameListItemOutcome game={game} />
          </ReactNative.View>
        </ReactNative.View>
      </ReactNative.Pressable>
    </ExpoRouter.Link>
  )
}

export default GameListItem
