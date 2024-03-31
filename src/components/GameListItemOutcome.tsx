import React from "react"
import * as ReactNative from "react-native"
import useTheme from "hooks/useTheme"
import type { Game } from "types/Game"
import type { GameOutcome } from "types/GameOutcome"

interface GameListItemOutcomeProps {
  game: Game
}

const GameListItemOutcome = ({
  game,
}: GameListItemOutcomeProps): React.ReactElement => {
  const theme = useTheme()

  const gameOutcome = React.useMemo((): GameOutcome => {
    if (game.goals_for !== undefined && game.goals_against !== undefined) {
      if (game.goals_for > game.goals_against) {
        return "Win"
      } else if (game.goals_for < game.goals_against) {
        return "Loss"
      }
      return "Tie"
    }
    return "Unplayed"
  }, [game.goals_for, game.goals_against])

  const gameScoreColor = theme.colors.gameScoreBackgroundColor[gameOutcome]

  const gameOutcomeLabel = React.useMemo(() => gameOutcome.at(0), [gameOutcome])

  const scoreLabel = React.useMemo((): string => {
    if (gameOutcome !== "Unplayed") {
      return `${game.goals_for}-${game.goals_against}`
    }
    return ""
  }, [game.goals_for, game.goals_against, gameOutcome])

  if (gameOutcome !== "Unplayed") {
    return (
      <ReactNative.View
        style={{
          backgroundColor: gameScoreColor,
          width: 66,
          borderRadius: 5,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ReactNative.Text
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
          }}
        >
          {gameOutcomeLabel}
        </ReactNative.Text>
        <ReactNative.Text style={{ color: "white", fontSize: 18 }}>
          {scoreLabel}
        </ReactNative.Text>
      </ReactNative.View>
    )
  } else {
    return <></>
  }
}

export default GameListItemOutcome
