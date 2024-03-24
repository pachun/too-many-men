import React from "react"
import * as ReactNative from "react-native"
import * as ExpoVectorIcons from "@expo/vector-icons"
import useTheme from "hooks/useTheme"
import type { Game } from "types/Game"
import GameAttendanceListItem from "./GameAttendanceListItem"

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
  const theme = useTheme()

  const players = React.useMemo(() => game.players, [game.players])

  const isLastPlayer = (index: number): boolean => index === players.length - 1

  return (
    <ReactNative.View style={{ width: "100%", alignItems: "center" }}>
      <ReactNative.View
        style={{
          width: "96%",
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 20,
          paddingBottom: 20,
          borderRadius: 5,
          backgroundColor: ReactNative.PlatformColor(
            "tertiarySystemBackground",
          ),
        }}
      >
        <ReactNative.Text
          style={{
            fontSize: 20,
            textAlign: "right",
            color: theme.colors.text,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          Attendance
        </ReactNative.Text>
        {players.map((player, index) => (
          <ReactNative.View key={player.id}>
            <GameAttendanceListItem player={player} game={game} />
            {isLastPlayer(index) ? null : <ListSeparator />}
          </ReactNative.View>
        ))}
      </ReactNative.View>
    </ReactNative.View>
  )
}

export default GameAttendanceList
