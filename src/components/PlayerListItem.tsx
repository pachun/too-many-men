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
        justifyContent: "center",
      }}
    >
      <ReactNative.Text style={{ fontWeight: "bold" }}>
        {player.name}
      </ReactNative.Text>
    </ReactNative.View>
  </ReactNative.View>
)

export default PlayerListItem
