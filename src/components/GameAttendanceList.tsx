import useTheme from "hooks/useTheme"
import * as ReactNative from "react-native"
import type { Player } from "types/Player"

interface GameAttendanceListProps {
  players: Player[]
}

const GameAttendanceList = ({
  players,
}: GameAttendanceListProps): React.ReactElement => {
  const theme = useTheme()

  return (
    <ReactNative.View style={{ width: "100%", alignItems: "center" }}>
      <ReactNative.FlatList
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
        data={players}
        ListHeaderComponent={() => (
          <ReactNative.Text
            style={{
              fontSize: 20,
              color: theme.colors.text,
              fontWeight: "bold",
              marginBottom: 20,
            }}
          >
            Attendance
          </ReactNative.Text>
        )}
        ItemSeparatorComponent={() => (
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
        )}
        renderItem={({ item: player }) => (
          <ReactNative.Text style={{ fontSize: 20, color: theme.colors.text }}>
            {player.first_name} {player.last_name}
          </ReactNative.Text>
        )}
      />
    </ReactNative.View>
  )
}

export default GameAttendanceList
