import React from "react"
import * as ReactNative from "react-native"
import * as DateFNS from "date-fns"
import useTheme from "hooks/useTheme"
import type { Game } from "types/Game"
import AppText from "./AppText"

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
      <AppText>{monthLabel}</AppText>
      <AppText
        style={{
          fontWeight: "bold",
          fontSize: 32,
        }}
      >
        {dayOfMonthLabel}
      </AppText>
    </ReactNative.View>
  )
}

export default GameListItemDate
