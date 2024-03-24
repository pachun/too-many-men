import React from "react"
import * as ReactNative from "react-native"
import * as ExpoVectorIcons from "@expo/vector-icons"
import useTheme from "hooks/useTheme"
import type { Game } from "types/Game"
import type { Player } from "types/Player"

interface GameAttendanceListItemProps {
  game: Game
  player: Player
}

const GameAttendanceListItem = ({
  game,
  player,
}: GameAttendanceListItemProps): React.ReactElement => {
  const theme = useTheme()

  const playerIsAttending = React.useMemo(
    () =>
      game.ids_of_players_who_responded_yes_to_attending.includes(player.id),
    [game.ids_of_players_who_responded_yes_to_attending, player.id],
  )

  return (
    <ReactNative.View testID={`Player ${player.id} Attendance List Item`}>
      <ReactNative.View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ReactNative.Text style={{ fontSize: 20, color: theme.colors.text }}>
          {player.first_name} {player.last_name}
        </ReactNative.Text>
        {playerIsAttending && (
          <ExpoVectorIcons.FontAwesome
            name="check"
            size={24}
            color={ReactNative.PlatformColor("systemGreen")}
            testID="Checkmark"
          />
        )}
        {false && (
          <ExpoVectorIcons.FontAwesome
            name="close"
            size={24}
            color={ReactNative.PlatformColor("systemRed")}
          />
        )}
        {false && (
          <ExpoVectorIcons.FontAwesome
            name="question"
            size={24}
            color={ReactNative.PlatformColor("systemYellow")}
          />
        )}
      </ReactNative.View>
    </ReactNative.View>
  )
}

export default GameAttendanceListItem
