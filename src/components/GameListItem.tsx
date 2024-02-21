import React from "react"
import * as ReactNative from "react-native"
import * as DateFNS from "date-fns"
import useTheme from "hooks/useTheme"
import useGameOutcome from "hooks/useGameOutcome"
import useGameScoreColor from "hooks/useGameScoreColor"
import type { Game } from "types/Game"

const sideColumnWidth = 120

export const paddingLeft = 10

interface GameListItemProps {
  game: Game
}

const GameListItem = ({ game }: GameListItemProps): React.ReactElement => {
  const dateLabel = React.useMemo((): string => {
    return DateFNS.format(DateFNS.parseISO(game.played_at), "MMM d")
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
        <ReactNative.View
          style={{ flexDirection: "row", width: sideColumnWidth }}
        >
          <ReactNative.View>
            <ReactNative.Text
              style={{
                color: theme.colors.text,
              }}
            >
              {timeLabel}
            </ReactNative.Text>
            <ReactNative.Text
              style={{
                color: theme.colors.secondaryLabel,
                fontSize: 10,
                marginTop: 3,
              }}
            >
              {dateLabel}
            </ReactNative.Text>
          </ReactNative.View>
        </ReactNative.View>

        <ReactNative.View style={{ justifyContent: "center" }}>
          <ReactNative.Text
            style={{
              color: theme.colors.text,
              textAlign: "center",
            }}
          >
            {game.rink}
          </ReactNative.Text>
          <ReactNative.Text
            style={{
              color: theme.colors.secondaryLabel,
              textAlign: "center",
              fontSize: 10,
              marginTop: 3,
            }}
          >
            {game.is_home_team ? "Home" : "Away"}
          </ReactNative.Text>
        </ReactNative.View>

        <ReactNative.View style={{ width: sideColumnWidth }}>
          <ReactNative.Text
            style={{
              textAlign: "right",
              fontSize: 16,
              color: gameScoreColor,
            }}
            numberOfLines={1}
          >
            {scoreLabel}
          </ReactNative.Text>
          <ReactNative.Text
            style={{
              color: theme.colors.secondaryLabel,
              fontSize: 10,
              marginTop: 3,
              textAlign: "right",
            }}
          >
            {game.opposing_teams_name ? `v ${game.opposing_teams_name}` : ""}
          </ReactNative.Text>
        </ReactNative.View>
      </ReactNative.View>
    </ReactNative.View>
  )
}

export default GameListItem
