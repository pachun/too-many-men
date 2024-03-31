import React from "react"
import * as ReactNative from "react-native"
import * as DateFNS from "date-fns"
import useTheme from "hooks/useTheme"
import type { Game } from "types/Game"

interface GameListItemDateProps {
  game: Game
}

const GameListItemDate = ({
  game,
}: GameListItemDateProps): React.ReactElement => {
  const theme = useTheme()

  const monthLabel = React.useMemo((): string => {
    return DateFNS.format(DateFNS.parseISO(game.played_at), "MMM")
  }, [game.played_at])

  const dayOfMonthLabel = React.useMemo((): string => {
    return DateFNS.format(DateFNS.parseISO(game.played_at), "d")
  }, [game.played_at])

  return (
    <ReactNative.View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: 80,
        borderRightColor: theme.colors.border,
        borderRightWidth: 1,
      }}
    >
      <ReactNative.Text style={{ fontSize: 20, color: theme.colors.text }}>
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
  )
}

export default GameListItemDate
