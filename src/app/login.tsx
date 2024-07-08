import React from "react"
import * as ReactNative from "react-native"
import useTheme from "hooks/useTheme"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import ConfirmationCodeInputPopup from "components/ConfirmationCodeInputPopup"
import PhoneNumberInput from "components/PhoneNumberInput"

const Login = (): React.ReactElement => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()

  const [phoneNumber, setPhoneNumber] = React.useState("")
  const [confirmationCode, setConfirmationCode] = React.useState("")

  const [
    confirmationCodeInputPopupIsVisible,
    setConfirmationCodeInputPopupIsVisible,
  ] = React.useState(false)

  const phoneNumberFieldRef = React.useRef<ReactNative.TextInput>(null)
  const focusPhoneNumberField = React.useCallback(() => {
    setConfirmationCodeInputPopupIsVisible(false)
    setConfirmationCode("")

    /* c8 ignore start */
    // RNTL does not support testing field focus.
    // https://stackoverflow.com/questions/65890013/react-native-how-to-test-if-element-is-focused?rq=3
    const waitForConfirmationCodeInputPopupToDismissTheKeyboard = (
      then: () => void,
    ): void => {
      const millisecondsRequiredToDismissKeyboard = 500
      setTimeout(() => {
        then()
      }, millisecondsRequiredToDismissKeyboard)
    }

    waitForConfirmationCodeInputPopupToDismissTheKeyboard(() => {
      if (phoneNumberFieldRef.current) {
        phoneNumberFieldRef.current.focus()
      }
    })
    /* c8 ignore end */
  }, [])

  return (
    <ReactNative.View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: insets.top,
      }}
    >
      <ConfirmationCodeInputPopup
        phoneNumber={phoneNumber}
        confirmationCode={confirmationCode}
        setConfirmationCode={setConfirmationCode}
        isVisible={confirmationCodeInputPopupIsVisible}
        onDismiss={focusPhoneNumberField}
      />
      <PhoneNumberInput
        ref={phoneNumberFieldRef}
        isVisible={!confirmationCodeInputPopupIsVisible}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        setConfirmationCodeInputPopupIsVisible={
          setConfirmationCodeInputPopupIsVisible
        }
      />
    </ReactNative.View>
  )
}

export default Login
