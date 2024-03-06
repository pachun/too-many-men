import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import useTheme from "hooks/useTheme"
import type { Player } from "types/Player"
import formatPhoneNumber from "helpers/formatPhoneNumber"

export const paddingLeft = 10

interface PlayerListItemProps {
  player: Player
}

const PlayerListItem = ({
  player,
}: PlayerListItemProps): React.ReactElement => {
  const formattedPhoneNumber = React.useMemo(
    () => (player.phone_number ? formatPhoneNumber(player.phone_number) : ""),
    [player.phone_number],
  )

  const theme = useTheme()

  return (
    <ExpoRouter.Link href={`/players/${player.id}`} asChild>
      <ReactNative.Pressable
        style={{ height: 44, paddingLeft, width: "100%" }}
        testID="Player List Item"
      >
        <ReactNative.View
          style={{
            flex: 1,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingRight: 10,
          }}
        >
          <ReactNative.View>
            <ReactNative.Text style={{ color: theme.colors.text }}>
              {player.first_name}
              <ReactNative.Text style={{ fontWeight: "bold" }}>
                {" "}
                {player.last_name}
              </ReactNative.Text>
            </ReactNative.Text>
            {formattedPhoneNumber && (
              <ReactNative.Text
                style={{
                  color: theme.colors.secondaryLabel,
                  fontSize: 10,
                  marginTop: 3,
                }}
              >
                {formattedPhoneNumber}
              </ReactNative.Text>
            )}
          </ReactNative.View>
          {player.jersey_number !== undefined && (
            <ReactNative.Text
              style={{
                color: theme.colors.secondaryLabel,
                fontSize: 16,
              }}
            >
              #{player.jersey_number}
            </ReactNative.Text>
          )}
        </ReactNative.View>
      </ReactNative.Pressable>
    </ExpoRouter.Link>
  )
}

export default PlayerListItem
