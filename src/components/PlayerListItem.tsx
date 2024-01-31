import * as ReactNative from "react-native"
import type { Player } from "types/Player"

interface PlayerListItemProps {
  player: Player
}

const PlayerListItem = ({
  player,
}: PlayerListItemProps): React.ReactElement => (
  <ReactNative.View style={{ height: 44, paddingLeft: 10, width: "100%" }}>
    <ReactNative.View
      style={{
        flex: 1,
        borderBottomWidth: 0.25,
        borderBottomColor: "gray",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingRight: 10,
      }}
    >
      <ReactNative.Text style={{ fontWeight: "bold" }}>
        {player.name}
      </ReactNative.Text>
      {player.jersey_number !== undefined && (
        <ReactNative.Text style={{ color: "gray" }}>
          #{player.jersey_number}
        </ReactNative.Text>
      )}
    </ReactNative.View>
  </ReactNative.View>
)

export default PlayerListItem
