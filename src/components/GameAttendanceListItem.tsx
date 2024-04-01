import React from "react"
import * as ReactNative from "react-native"
import * as ExpoVectorIcons from "@expo/vector-icons"
import useTheme from "hooks/useTheme"
import type { Game } from "types/Game"
import type { Player } from "types/Player"
import AppText from "./AppText"

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

  const playerIsNotAttending = React.useMemo(
    () => game.ids_of_players_who_responded_no_to_attending.includes(player.id),
    [game.ids_of_players_who_responded_no_to_attending, player.id],
  )

  const playerMightAttend = React.useMemo(
    () =>
      game.ids_of_players_who_responded_maybe_to_attending.includes(player.id),
    [game.ids_of_players_who_responded_maybe_to_attending, player.id],
  )

  return (
    <ReactNative.View testID={`Player Attendance List Item`}>
      <ReactNative.View
        testID={`Player ${player.id} Attendance List Item`}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <AppText>
          {player.first_name} {player.last_name}
        </AppText>
        {playerIsAttending && (
          <ExpoVectorIcons.FontAwesome
            name="check"
            size={24}
            color={theme.colors.gameAttendanceButtonBackgroundColor.going}
            testID="Checkmark Icon"
          />
        )}
        {playerIsNotAttending && (
          <ExpoVectorIcons.FontAwesome
            name="close"
            size={24}
            color={theme.colors.gameAttendanceButtonBackgroundColor.notGoing}
            testID="X Icon"
          />
        )}
        {playerMightAttend && (
          <ExpoVectorIcons.FontAwesome
            name="question"
            size={24}
            color={theme.colors.gameAttendanceButtonBackgroundColor.maybeGoing}
            testID="? Icon"
          />
        )}
      </ReactNative.View>
    </ReactNative.View>
  )
}

export default GameAttendanceListItem
