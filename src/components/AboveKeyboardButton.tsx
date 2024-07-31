import useTheme from "hooks/useTheme"
import * as ReactNative from "react-native"
import AppText from "./AppText"
import useKeyboardHeight from "hooks/useKeyboardHeight"
import React from "react"

const AboveKeyboardButton = (props: {
  title: string
  testID?: string
  onPress: () => void
}): React.ReactElement => {
  const theme = useTheme()

  const keyboardHeight = useKeyboardHeight()

  return (
    <ReactNative.Pressable
      testID={props.testID}
      style={{
        position: "absolute",
        left: 0,
        bottom: keyboardHeight,
        width: "100%",
        height: 50,
      }}
      onPress={props.onPress}
    >
      <ReactNative.View
        style={{
          flex: 1,
          backgroundColor: theme.colors.primary,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AppText bold style={{ color: "white" }}>
          {props.title}
        </AppText>
      </ReactNative.View>
    </ReactNative.Pressable>
  )
}

export default AboveKeyboardButton
