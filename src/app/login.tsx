import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import * as Animatable from "react-native-animatable"
import useTheme from "hooks/useTheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import useApi from "hooks/useApi"
import waitForKeyboardToBeDismissed from "helpers/waitForKeyboardToBeDismissed"
import useUserId from "hooks/useUserId"
import useApiToken from "hooks/useApiToken"
import ForegroundItem from "components/ForegroundItem"
import PhoneNumberField, {
  numberOfDigitsInFullPhoneNumber,
} from "components/PhoneNumberField"
import AppText from "components/AppText"
import VerticalSpacing from "components/VerticalSpacing"
import AboveKeyboardButton from "components/AboveKeyboardButton"

const numberOfDigitsInConfirmationCodes = 6

type InputType = "Phone Number" | "Confirmation Code"

const Login = (): React.ReactElement => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  const api = useApi()
  const router = ExpoRouter.useRouter()
  const { setUserId } = useUserId()
  const { setApiToken } = useApiToken()
  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [confirmationCode, setConfirmationCode] = React.useState("")
  const [inputType, setInputType] = React.useState<InputType>("Phone Number")
  const phoneNumberFieldRef = React.useRef<ReactNative.TextInput>(null)
  const refForShakeAnimatingTheConfirmationCodeFieldAfterIncorrectEntries =
    React.useRef<Animatable.View>(null)

  const sendTextMessageConfirmationCode = React.useCallback(async () => {
    setInputType("Confirmation Code")
    await api.sendTextMessageConfirmationCode({ phoneNumber })
  }, [api, phoneNumber])

  const resetLoginState = React.useCallback(() => {
    setInputType("Phone Number")
    setConfirmationCode("")
  }, [])

  const showPhoneNumberInput = React.useCallback(async () => {
    resetLoginState()
    /* c8 ignore start */
    // This is required for physical iOS devices, but we're unsure how to test it
    await waitForKeyboardToBeDismissed(() =>
      phoneNumberFieldRef.current!.focus(),
    )
    /* c8 ignore end */
  }, [resetLoginState])

  const login = React.useCallback(
    async ({ apiToken, userId }: { apiToken: string; userId: number }) => {
      await setApiToken(apiToken)
      await setUserId(userId)
      router.push("/teams")
      resetLoginState()
    },
    [resetLoginState, router, setApiToken, setUserId],
  )

  const shakeAndEmptyTheConfirmationCodeField = React.useCallback(async () => {
    const millisecondDurationOfConfirmationCodeShakeAnimation = 300
    // @ts-ignore
    refForShakeAnimatingTheConfirmationCodeFieldAfterIncorrectEntries
      .current!.shake(millisecondDurationOfConfirmationCodeShakeAnimation)
      .then(({ finished }) => {
        if (finished) {
          setConfirmationCode("")
        }
      })
  }, [])

  const checkTextMessageConfirmationCode = React.useCallback(async () => {
    api.checkTextMessageConfirmationCode({
      phoneNumber,
      confirmationCode,
      whenTheCodeIsCorrect: login,
      whenTheCodeIsIncorrectTheFirstOrSecondTime:
        shakeAndEmptyTheConfirmationCodeField,
      whenTheCodeIsIncorrectTheThirdTime: showPhoneNumberInput,
    })
  }, [
    api,
    phoneNumber,
    confirmationCode,
    login,
    shakeAndEmptyTheConfirmationCodeField,
    showPhoneNumberInput,
  ])

  const focusPhoneNumberField = (): void => phoneNumberFieldRef.current?.focus()

  const confirmationCodeLabelStyle: ReactNative.StyleProp<ReactNative.TextStyle> =
    React.useMemo(() => {
      const isShowingConfirmationCodePlaceholderText =
        confirmationCode.length === 0
      return isShowingConfirmationCodePlaceholderText
        ? {
            color: theme.colors.secondaryLabel,
            fontSize: theme.fontSize,
          }
        : {
            color: theme.colors.text,
            fontSize: theme.fontSize,
            fontWeight: "bold",
          }
    }, [confirmationCode, theme])

  return (
    <ReactNative.View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: insets.top + 100,
      }}
    >
      {inputType === "Phone Number" && (
        <>
          <ReactNative.Pressable onPress={focusPhoneNumberField}>
            <ForegroundItem style={{ alignItems: "center" }}>
              <AppText>What's your phone number?</AppText>
              <VerticalSpacing />
              <PhoneNumberField
                autoFocus
                ref={phoneNumberFieldRef}
                phoneNumber={phoneNumber}
                onChangePhoneNumber={setPhoneNumber}
                testID="Phone Number Field"
                style={{
                  color: theme.colors.text,
                  fontSize: theme.fontSize,
                  fontWeight: "bold",
                }}
              />
            </ForegroundItem>
          </ReactNative.Pressable>
          {phoneNumber.length === numberOfDigitsInFullPhoneNumber && (
            <AboveKeyboardButton
              title="Continue"
              onPress={sendTextMessageConfirmationCode}
            />
          )}
        </>
      )}
      {inputType === "Confirmation Code" && (
        <>
          <ForegroundItem style={{ alignItems: "center" }}>
            <AppText>We texted you some numbers</AppText>
            <VerticalSpacing />
            <Animatable.View
              ref={
                refForShakeAnimatingTheConfirmationCodeFieldAfterIncorrectEntries
              }
            >
              <ReactNative.TextInput
                style={confirmationCodeLabelStyle}
                maxLength={numberOfDigitsInConfirmationCodes}
                placeholder="Enter those here"
                testID="Confirmation Code Input"
                textContentType="oneTimeCode"
                autoFocus
                keyboardType="number-pad"
                value={confirmationCode}
                onChangeText={setConfirmationCode}
              />
            </Animatable.View>
          </ForegroundItem>
          <VerticalSpacing />
          <ReactNative.Button
            testID="Cancel Button"
            title="Cancel"
            onPress={showPhoneNumberInput}
          />
          {confirmationCode.length === numberOfDigitsInConfirmationCodes && (
            <AboveKeyboardButton
              title="Confirm"
              onPress={checkTextMessageConfirmationCode}
            />
          )}
        </>
      )}
    </ReactNative.View>
  )
}

export default Login
