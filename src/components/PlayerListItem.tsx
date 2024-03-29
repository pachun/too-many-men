import useTheme from "hooks/useTheme"
import React from "react"
import * as ReactNative from "react-native"
import type { Player } from "types/Player"

export const paddingLeft = 10

const formatPhoneNumber = (phoneNumber: string): string => {
  return Array.from(phoneNumber).reduce(
    (formattedPhoneNumber, currentDigit, currentDigitPosition) => {
      if (currentDigitPosition === 0) {
        return `(${currentDigit}`
      } else if (currentDigitPosition === 2) {
        return `${formattedPhoneNumber}${currentDigit}) `
      } else if (currentDigitPosition === 5) {
        return `${formattedPhoneNumber}${currentDigit} `
      } else {
        return `${formattedPhoneNumber}${currentDigit}`
      }
    },
    "",
  )
}

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
    <ReactNative.View
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
    </ReactNative.View>
  )
}

export default PlayerListItem
