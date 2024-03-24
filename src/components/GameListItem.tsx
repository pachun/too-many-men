import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import * as DateFNS from "date-fns"
import useTheme from "hooks/useTheme"
import useGameOutcome from "hooks/useGameOutcome"
import useGameScoreColor from "hooks/useGameScoreColor"
import type { Game } from "types/Game"

export const paddingLeft = 10

interface GameListItemProps {
  game: Game
}

const GameListItem = ({ game }: GameListItemProps): React.ReactElement => {
  const monthLabel = React.useMemo((): string => {
    return DateFNS.format(DateFNS.parseISO(game.played_at), "MMM")
  }, [game.played_at])

  const dayOfMonthLabel = React.useMemo((): string => {
    return DateFNS.format(DateFNS.parseISO(game.played_at), "d")
  }, [game.played_at])

  const timeLabel = React.useMemo((): string => {
    return DateFNS.format(DateFNS.parseISO(game.played_at), "h:mm a")
  }, [game.played_at])

  const gameOutcome = useGameOutcome(game)

  const gameScoreColor = useGameScoreColor(gameOutcome)

  const scoreLabel = React.useMemo((): string => {
    if (gameOutcome !== "Unplayed") {
      return `${game.goals_for} - ${game.goals_against} ${gameOutcome.at(0)}`
    }
    return ""
  }, [game.goals_for, game.goals_against, gameOutcome])

  const theme = useTheme()

  const [isTappingGame, setIsTappingGame] = React.useState(false)

  return (
    <ExpoRouter.Link href={`/games/${game.id}`} asChild>
      <ReactNative.Pressable
        style={{
          height: 120,
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft,
          width: "100%",
          ...(isTappingGame
            ? {
                backgroundColor: ReactNative.PlatformColor(
                  "tertiarySystemBackground",
                ),
              }
            : {}),
        }}
        onPressIn={() => setIsTappingGame(true)}
        onPressOut={() => setIsTappingGame(false)}
        testID="Game List Item"
      >
        <ReactNative.View style={{ flexDirection: "row" }}>
          <ReactNative.View
            style={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              width: 80,
              borderRightColor: theme.colors.border,
              borderRightWidth: 1,
            }}
          >
            <ReactNative.Text
              style={{ fontSize: 20, color: theme.colors.text }}
            >
              {monthLabel}
            </ReactNative.Text>
            <ReactNative.Text
              style={{
                fontWeight: "bold",
                fontSize: 32,
                color: theme.colors.text,
              }}
            >
              {dayOfMonthLabel}
            </ReactNative.Text>
          </ReactNative.View>
          <ReactNative.View
            style={{ paddingLeft: 20, justifyContent: "space-between" }}
          >
            <ReactNative.Text
              style={{
                fontSize: 20,
                color: theme.colors.text,
                fontWeight: "bold",
              }}
            >
              {timeLabel}
            </ReactNative.Text>
            {game.opposing_teams_name && (
              <>
                <ReactNative.Text
                  style={{ fontSize: 20, color: theme.colors.secondaryLabel }}
                >
                  v {game.opposing_teams_name}
                </ReactNative.Text>
              </>
            )}
            <ReactNative.Text
              style={{ fontSize: 20, color: theme.colors.secondaryLabel }}
            >
              {game.rink ? `${game.rink} ` : ""}
              {game.is_home_team ? "Home" : "Away"}{" "}
            </ReactNative.Text>
          </ReactNative.View>
        </ReactNative.View>
      </ReactNative.Pressable>
    </ExpoRouter.Link>
  )
}

export default GameListItem
