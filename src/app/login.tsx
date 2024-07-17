import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import type * as Animatable from "react-native-animatable"
import useTheme from "hooks/useTheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import ConfirmationCodeInput from "components/ConfirmationCodeInput"
import PhoneNumberInput from "components/PhoneNumberInput"
import useApi from "hooks/useApi"
import waitForKeyboardToBeDismissed from "helpers/waitForKeyboardToBeDismissed"
import useUserId from "hooks/useUserId"
import useApiToken from "hooks/useApiToken"

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

  const focusThePhoneNumberField = React.useCallback(async () => {
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
      router.navigate("/teams")
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
      whenTheCodeIsIncorrectTheThirdTime: focusThePhoneNumberField,
    })
  }, [
    api,
    phoneNumber,
    confirmationCode,
    login,
    shakeAndEmptyTheConfirmationCodeField,
    focusThePhoneNumberField,
  ])

  return (
    <ReactNative.View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: insets.top,
      }}
    >
      <PhoneNumberInput
        ref={phoneNumberFieldRef}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        isVisible={inputType === "Phone Number"}
        onSubmit={sendTextMessageConfirmationCode}
      />
      <ConfirmationCodeInput
        ref={refForShakeAnimatingTheConfirmationCodeFieldAfterIncorrectEntries}
        confirmationCode={confirmationCode}
        setConfirmationCode={setConfirmationCode}
        isVisible={inputType === "Confirmation Code"}
        onSubmit={checkTextMessageConfirmationCode}
        onCancel={focusThePhoneNumberField}
      />
    </ReactNative.View>
  )
}

export default Login
