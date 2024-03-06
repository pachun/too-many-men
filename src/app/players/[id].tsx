import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import Config from "Config"
import type { Player as PlayerType } from "types/Player"
import formatPhoneNumber from "helpers/formatPhoneNumber"

const Player = (): React.ReactElement => {
  const { id: playerId } = ExpoRouter.useLocalSearchParams()

  const [player, setPlayer] = React.useState<PlayerType>()

  ExpoRouter.useFocusEffect(
    React.useCallback(() => {
      const getPlayer = async (): Promise<void> => {
        setPlayer(
          await (await fetch(Config.apiUrl + `/players/${playerId}`)).json(),
        )
      }

      getPlayer()
    }, [playerId]),
  )

  const navigationBarTitleLabel = React.useMemo(
    () => `${player?.first_name} ${player?.last_name}`,
    [player],
  )

  const formattedPhoneNumberLabel = React.useMemo(() => {
    return player?.phone_number ? formatPhoneNumber(player?.phone_number) : ""
  }, [player?.phone_number])

  const formattedJerseyNumberLabel = React.useMemo(() => {
    return player?.jersey_number ? `#${player.jersey_number}` : ""
  }, [player?.jersey_number])

  return (
    <ReactNative.View>
      <ExpoRouter.Stack.Screen options={{ title: navigationBarTitleLabel }} />
      <ReactNative.Text>{formattedPhoneNumberLabel}</ReactNative.Text>
      <ReactNative.Text>{formattedJerseyNumberLabel}</ReactNative.Text>
    </ReactNative.View>
  )
}

export default Player
