import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import formatPhoneNumber from "helpers/formatPhoneNumber"
import useTheme from "hooks/useTheme"
import CenteredLoadingSpinner from "components/CenteredLoadingSpinner"
import useTheCachedPlayerFirstOrGetThePlayerFromTheApi from "hooks/useTheCachedPlayerFirstOrGetThePlayerFromTheApi"
import PlayerAuthenticationFlow from "components/PlayerAuthenticationFlow"

const Player = (): React.ReactElement => {
  const { id: playerId } = ExpoRouter.useLocalSearchParams()

  const player = useTheCachedPlayerFirstOrGetThePlayerFromTheApi(playerId)

  const navigationBarTitleLabel = React.useMemo(
    () => `${player?.first_name} ${player?.last_name}`,
    [player?.first_name, player?.last_name],
  )

  const formattedPhoneNumberLabel = React.useMemo(() => {
    return player?.phone_number ? formatPhoneNumber(player.phone_number) : ""
  }, [player?.phone_number])

  const formattedJerseyNumberLabel = React.useMemo(() => {
    return player?.jersey_number ? `#${player.jersey_number}` : ""
  }, [player?.jersey_number])

  const theme = useTheme()

  return player ? (
    <>
      <ExpoRouter.Stack.Screen options={{ title: navigationBarTitleLabel }} />
      <ReactNative.View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ReactNative.Text
          style={{ color: theme.colors.text, fontSize: 24, fontWeight: "bold" }}
        >
          {formattedJerseyNumberLabel}
        </ReactNative.Text>
        <ReactNative.View style={{ height: 8 }} />
        <ReactNative.Text style={{ color: theme.colors.text }}>
          {formattedPhoneNumberLabel}
        </ReactNative.Text>
        <ReactNative.View style={{ height: 8 }} />
        <PlayerAuthenticationFlow player={player} />
      </ReactNative.View>
    </>
  ) : (
    <>
      <ExpoRouter.Stack.Screen options={{ title: "" }} />
      <CenteredLoadingSpinner />
    </>
  )
}

export default Player
