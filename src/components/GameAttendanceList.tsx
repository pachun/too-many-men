import React from "react"
import * as ReactNative from "react-native"
import useTheme from "hooks/useTheme"
import type { Game } from "types/Game"
import GameAttendanceListItem from "./GameAttendanceListItem"
import VerticalSpacing from "./VerticalSpacing"
import ForegroundItem from "./ForegroundItem"
import AppText from "./AppText"

const ListSeparator = (): React.ReactElement => {
  const theme = useTheme()

  return (
    <>
      <ReactNative.View style={{ height: 15 }} />
      <ReactNative.View
        style={{
          width: "100%",
          height: 1,
          borderWidth: 0.25,
          borderColor: theme.colors.background,
        }}
      />
      <ReactNative.View style={{ height: 15 }} />
    </>
  )
}

interface GameAttendanceListProps {
  game: Game
}

const GameAttendanceList = ({
  game,
}: GameAttendanceListProps): React.ReactElement => {
  const players = React.useMemo(() => game.players, [game.players])

  const isLastPlayer = (index: number): boolean => index === players.length - 1

  return (
    <ForegroundItem>
      <AppText bold style={{ textAlign: "right" }}>
        Attendance
      </AppText>
      <VerticalSpacing />
      <>
        {players.map(
          (player, index): React.ReactElement => (
            <ReactNative.View key={player.id}>
              <GameAttendanceListItem player={player} game={game} />
              {isLastPlayer(index) ? null : <ListSeparator />}
            </ReactNative.View>
          ),
        )}
      </>
    </ForegroundItem>
  )
}

export default GameAttendanceList
