import React from "react"
import * as ReactNative from "react-native"
import * as Animatable from "react-native-animatable"
import AppText from "components/AppText"
import VerticalSpacing from "components/VerticalSpacing"
import ForegroundItem from "components/ForegroundItem"
import AboveKeyboardButton from "components/AboveKeyboardButton"
import useTheme from "hooks/useTheme"
import hiddenTextInputStyle from "helpers/hiddenTextInputStyle"

const numberOfDigitsInConfirmationCodes = 6

interface ConfirmationCodeInputProps {
  confirmationCode: string
  setConfirmationCode: (confirmationCode: string) => void
  isVisible: boolean
  onCancel: () => void
  onSubmit: () => Promise<void>
}

const ConfirmationCodeInput = React.forwardRef(
  (
    {
      confirmationCode,
      setConfirmationCode,
      isVisible,
      onCancel,
      onSubmit,
    }: ConfirmationCodeInputProps,
    refForShakeAnimatingTheConfirmationCodeFieldAfterIncorrectEntries: React.ForwardedRef<Animatable.View>,
  ): React.ReactElement => {
    const theme = useTheme()
    const isShowingConfirmationCodePlaceholderText =
      confirmationCode.length === 0
    const confirmationCodeLabelStyle: ReactNative.StyleProp<ReactNative.TextStyle> =
      isShowingConfirmationCodePlaceholderText
        ? {
            color: theme.colors.secondaryLabel,
          }
        : {
            color: theme.colors.text,
            fontWeight: "bold",
          }

    return isVisible ? (
      <>
        <ReactNative.KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
          <ForegroundItem style={{ alignItems: "center", marginTop: 100 }}>
            <AppText>We texted you some numbers</AppText>
            <VerticalSpacing />
            <ReactNative.TextInput
              maxLength={numberOfDigitsInConfirmationCodes}
              testID="Confirmation Code Input"
              textContentType="oneTimeCode"
              autoFocus
              keyboardType="number-pad"
              value={confirmationCode}
              onChangeText={setConfirmationCode}
              style={hiddenTextInputStyle}
            />
            <Animatable.View
              ref={
                refForShakeAnimatingTheConfirmationCodeFieldAfterIncorrectEntries
              }
            >
              <AppText
                style={[
                  {
                    textAlign: "center",
                  },
                  confirmationCodeLabelStyle,
                ]}
              >
                {confirmationCode || "Enter those here"}
              </AppText>
            </Animatable.View>
          </ForegroundItem>
          <VerticalSpacing />
          <ReactNative.Button
            testID="Cancel Button"
            title="Cancel"
            onPress={onCancel}
          />
        </ReactNative.KeyboardAvoidingView>
        <AboveKeyboardButton
          title="Confirm"
          isVisible={
            confirmationCode.length === numberOfDigitsInConfirmationCodes
          }
          onPress={onSubmit}
        />
      </>
    ) : (
      <></>
    )
  },
)

export default ConfirmationCodeInput
