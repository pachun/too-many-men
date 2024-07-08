import useTheme from "hooks/useTheme"
import * as ReactNative from "react-native"
import AppText from "./AppText"

interface AboveKeyboardContinueButtonProps {
  isVisible: boolean
  onPress: () => void
}

const AboveKeyboardContinueButton = ({
  isVisible,
  onPress,
}: AboveKeyboardContinueButtonProps): React.ReactElement => {
  const theme = useTheme()

  return isVisible ? (
    <ReactNative.Pressable onPress={onPress}>
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
          Continue
        </AppText>
      </ReactNative.KeyboardAvoidingView>
    </ReactNative.Pressable>
  ) : (
    <></>
  )
}

export default AboveKeyboardContinueButton
