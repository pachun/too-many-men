import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"

const Player = (): React.ReactElement => {
  return (
    <ReactNative.View>
      <ExpoRouter.Stack.Screen options={{ title: "Creed Bratton" }} />
      <ReactNative.Text>Creed Bratton</ReactNative.Text>
      <ReactNative.Text>55</ReactNative.Text>
      <ReactNative.Text>(012) 345 6789</ReactNative.Text>
    </ReactNative.View>
  )
}

export default Player
