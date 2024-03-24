import React from "react"
import * as ReactNative from "react-native"
import * as ExpoVectorIcons from "@expo/vector-icons"
import useTheme from "hooks/useTheme"
import type { Game } from "types/Game"

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

  const isLastPlayer = React.useCallback(
    (index: number) => index === players.length - 1,
    [players],
  )

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
        {players.map((player, index) => {
          const playerIsAttending =
            game.ids_of_players_who_responded_yes_to_attending.includes(
              player.id,
            )

          return (
            <ReactNative.View
              key={index}
              testID={`Player ${player.id} Attendance`}
            >
              <ReactNative.View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <ReactNative.Text
                  style={{ fontSize: 20, color: theme.colors.text }}
                >
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
              {isLastPlayer(index) ? null : <ListSeparator />}
            </ReactNative.View>
          )
        })}
      </ReactNative.View>
    </ReactNative.View>
  )
}

export default GameAttendanceList
