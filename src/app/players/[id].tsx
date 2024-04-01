import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import formatPhoneNumber from "helpers/formatPhoneNumber"
import CenteredLoadingSpinner from "components/CenteredLoadingSpinner"
import useTheCachedPlayerFirstOrGetThePlayerFromTheApi from "hooks/useTheCachedPlayerFirstOrGetThePlayerFromTheApi"
import PlayerAuthenticationFlow from "components/PlayerAuthenticationFlow"
import LabeledValue from "components/LabeledValue"
import BackButtonWithTestId from "components/BackButonWithTestId"

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
    return player?.jersey_number !== undefined ? `#${player.jersey_number}` : ""
  }, [player?.jersey_number])

  return player ? (
    <>
      <ExpoRouter.Stack.Screen
        options={{
          title: navigationBarTitleLabel,
          headerLeft: () => <BackButtonWithTestId title="Team" />,
        }}
      />
      <ReactNative.View style={{ flex: 1 }}>
        {player.phone_number && (
          <LabeledValue label="Phone" value={formattedPhoneNumberLabel} />
        )}
        {player.jersey_number !== undefined && (
          <LabeledValue label="Jersey" value={formattedJerseyNumberLabel} />
        )}
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
