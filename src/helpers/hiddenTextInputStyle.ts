import * as ReactNative from "react-native"

// onChangeText doesn't fire on TextInput components on physical android
// devices when the size of the TextInput is 0x0
//
// if that changes, you can remove this kludge

const hiddenTextInputStyle: ReactNative.StyleProp<ReactNative.TextStyle> = {
  width: ReactNative.Platform.OS === "android" ? 1 : 0,
  height: ReactNative.Platform.OS === "android" ? 1 : 0,
}

export default hiddenTextInputStyle
