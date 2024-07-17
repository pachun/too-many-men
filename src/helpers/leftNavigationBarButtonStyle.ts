import * as ReactNative from "react-native"

const leftNavigationBarButtonStyle: ReactNative.StyleProp<ReactNative.TextStyle> =
  {
    // the non-android values in here are for web, which we do not test
    /* c8 ignore start */
    marginRight: ReactNative.Platform.OS === "android" ? 40 : 15,
    ...(ReactNative.Platform.OS === "web" ? { marginLeft: 15 } : {}),
    /* c8 ignore end */
  }

export default leftNavigationBarButtonStyle
