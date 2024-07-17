import useTheme from "hooks/useTheme"
import * as ReactNative from "react-native"
import AppText from "./AppText"

const AboveKeyboardButton = (props: {
  title: string
  isVisible: boolean
  onPress: () => void
}): React.ReactElement => {
  const theme = useTheme()

  return props.isVisible ? (
    <ReactNative.Pressable onPress={props.onPress}>
      <ReactNative.KeyboardAvoidingView
        style={{
          width: "100%",
          height: 50,
          marginTop: -50,
          backgroundColor: theme.colors.primary,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AppText bold style={{ color: "white" }}>
          {props.title}
        </AppText>
      </ReactNative.KeyboardAvoidingView>
    </ReactNative.Pressable>
  ) : (
    <></>
  )
}

export default AboveKeyboardButton
