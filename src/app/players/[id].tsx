import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import Config from "Config"
import type { Player as PlayerType } from "types/Player"

const Player = (): React.ReactElement => {
  const { id: playerId } = ExpoRouter.useLocalSearchParams()

  const [player, setPlayer] = React.useState<PlayerType>()

  ExpoRouter.useFocusEffect(() => {
    const getPlayer = async (): Promise<void> => {
      setPlayer(
        await (await fetch(Config.apiUrl + `/players/${playerId}`)).json(),
      )
    }

    getPlayer()
  })

  const title = React.useMemo(
    () => `${player?.first_name} ${player?.last_name}`,
    [player],
  )

  return (
    <ReactNative.View>
      <ExpoRouter.Stack.Screen options={{ title }} />
      <ReactNative.Text>Creed Bratton</ReactNative.Text>
      <ReactNative.Text>55</ReactNative.Text>
      <ReactNative.Text>(012) 345 6789</ReactNative.Text>
    </ReactNative.View>
  )
}

export default Player
