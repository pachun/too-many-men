import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import * as Animatable from "react-native-animatable"
import Config from "Config"
import useUserId from "hooks/useUserId"
import useApiToken from "hooks/useApiToken"
import useNavigationHeaderToastNotification from "hooks/useNavigationHeaderToastNotification"
import AppText from "./AppText"
import VerticalSpacing from "./VerticalSpacing"
import ForegroundItem from "./ForegroundItem"
import AboveKeyboardButton from "./AboveKeyboardButton"
import useTheme from "hooks/useTheme"
import hiddenTextInputStyle from "helpers/hiddenTextInputStyle"

export type CheckTextMessageConfirmationCodeRequestResponse =
  | { correct_confirmation_code: true; api_token: string; player_id: number }
  | { correct_confirmation_code: false; confirmation_code_was_unset: boolean }

const numberOfDigitsInConfirmationCodes = 6
const millisecondDurationOfShakingConfirmationCodeAnimation = 300

const ConfirmationCodeInputPopup = (props: {
  phoneNumber: string
  confirmationCode: string
  setConfirmationCode: (confirmationCode: string) => void
  isVisible: boolean
  onDismiss: () => void
}): React.ReactElement => {
  const {
    phoneNumber,
    confirmationCode,
    setConfirmationCode,
    isVisible,
    onDismiss,
  } = props

  const viewRefThatAnimatesTheConfirmationCodeInputWhenIncorrectCodesAreEntered =
    React.useRef<Animatable.View>(null)

  const { setUserId } = useUserId()
  const { setApiToken } = useApiToken()

  const router = ExpoRouter.useRouter()

  const { showNotification } = useNavigationHeaderToastNotification()

  const shakeConfirmationCodeInputField = (
    animationDurationInMilliseconds: number,
  ): void => {
    if (
      viewRefThatAnimatesTheConfirmationCodeInputWhenIncorrectCodesAreEntered.current
    ) {
      // @ts-ignore
      viewRefThatAnimatesTheConfirmationCodeInputWhenIncorrectCodesAreEntered.current.shake(
        animationDurationInMilliseconds,
      )
    }
  }

  const checkTextMessageConfirmationCode = React.useCallback(async () => {
    try {
      const response = await fetch(
        `${Config.apiUrl}/text_message_confirmation_codes/check`,
        {
          method: "POST",
          headers: { "Content-Type": "Application/JSON" },
          body: JSON.stringify({
            phone_number: phoneNumber,
            confirmation_code: confirmationCode,
          }),
        },
      )
      const responseJson =
        (await response.json()) as CheckTextMessageConfirmationCodeRequestResponse
      if (responseJson.correct_confirmation_code) {
        const apiToken = responseJson.api_token
        const userId = responseJson.player_id
        await setApiToken(apiToken)
        await setUserId(userId)
        router.navigate("/teams")
      } else if (
        !responseJson.correct_confirmation_code &&
        !responseJson.confirmation_code_was_unset
      ) {
        shakeConfirmationCodeInputField(
          millisecondDurationOfShakingConfirmationCodeAnimation,
        )
        setTimeout(
          () => setConfirmationCode(""),
          millisecondDurationOfShakingConfirmationCodeAnimation,
        )
      } else {
        onDismiss()
      }
    } catch {
      showNotification({
        type: "warning",
        message: "Trouble Connecting to the Internet",
        dismissAfter: 3,
      })
    }
  }, [
    phoneNumber,
    confirmationCode,
    setConfirmationCode,
    router,
    setApiToken,
    setUserId,
    showNotification,
    onDismiss,
  ])

  const theme = useTheme()
  const isShowingConfirmationCodePlaceholderText = confirmationCode.length === 0
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
              viewRefThatAnimatesTheConfirmationCodeInputWhenIncorrectCodesAreEntered
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
          onPress={onDismiss}
        />
      </ReactNative.KeyboardAvoidingView>
      <AboveKeyboardButton
        title="Confirm"
        isVisible={
          confirmationCode.length === numberOfDigitsInConfirmationCodes
        }
        onPress={checkTextMessageConfirmationCode}
      />
    </>
  ) : (
    <></>
  )
}

export default ConfirmationCodeInputPopup
