import React from "react"
import * as ReactNative from "react-native"
import ForegroundItem from "components/ForegroundItem"
import AppText from "components/AppText"
import VerticalSpacing from "components/VerticalSpacing"
import useNavigationHeaderToastNotification from "hooks/useNavigationHeaderToastNotification"
import Config from "Config"
import AboveKeyboardButton from "components/AboveKeyboardButton"
import hiddenTextInputStyle from "helpers/hiddenTextInputStyle"

const formatCompleteOrPartialPhoneNumber = (phoneNumber: string): string => {
  if (phoneNumber.length < 4) {
    return phoneNumber
  } else if (phoneNumber.length < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`
}

const NUMBER_OF_DIGITS_IN_PHONE_NUMBERS = 10

const isCompletePhoneNumber = (phoneNumber: string): boolean =>
  phoneNumber.length === NUMBER_OF_DIGITS_IN_PHONE_NUMBERS

const isPartialOrFullPhoneNumber = (phoneNumber: string): boolean =>
  phoneNumber.length <= NUMBER_OF_DIGITS_IN_PHONE_NUMBERS

interface PhoneNumberInputProps {
  isVisible: boolean
  phoneNumber: string
  setPhoneNumber: (phoneNumber: string) => void
  setConfirmationCodeInputPopupIsVisible: (
    confirmationCodePopupIsVisible: boolean,
  ) => void
}

const PhoneNumberInput = React.forwardRef(
  (
    {
      isVisible,
      phoneNumber,
      setPhoneNumber,
      setConfirmationCodeInputPopupIsVisible,
    }: PhoneNumberInputProps,
    phoneNumberFieldRef: React.ForwardedRef<ReactNative.TextInput>,
  ): React.ReactElement => {
    const hasCompletePhoneNumber = React.useMemo(
      () => isCompletePhoneNumber(phoneNumber),
      [phoneNumber],
    )

    const formattedPhoneNumber = React.useMemo(() => {
      return formatCompleteOrPartialPhoneNumber(phoneNumber)
    }, [phoneNumber])

    const { showNotification } = useNavigationHeaderToastNotification()

    const sendTextMessageConfirmationCode = React.useCallback(async () => {
      try {
        setConfirmationCodeInputPopupIsVisible(true)
        await fetch(
          `${Config.apiUrl}/text_message_confirmation_codes/deliver`,
          {
            method: "POST",
            headers: { "Content-Type": "Application/JSON" },
            body: JSON.stringify({ phone_number: phoneNumber }),
          },
        )
      } catch {
        showNotification({
          type: "warning",
          message: "Trouble Connecting to the Internet",
          dismissAfter: 3,
        })
      }
    }, [phoneNumber, showNotification, setConfirmationCodeInputPopupIsVisible])

    const safeSetPhoneNumber = React.useCallback(
      (newPhoneNumber: string) => {
        if (isPartialOrFullPhoneNumber(newPhoneNumber)) {
          const removingNonDigitCharacters = (thing: string): string =>
            thing.replace(/\D/g, "")
          setPhoneNumber(removingNonDigitCharacters(newPhoneNumber))
        } else {
          const phoneNumberWithoutWhitespace = newPhoneNumber.replace(
            /\s+/g,
            "",
          )
          const isCompletePhoneNumberFromSuggestionBarAboveKeyboard =
            isCompletePhoneNumber(phoneNumberWithoutWhitespace)

          if (isCompletePhoneNumberFromSuggestionBarAboveKeyboard) {
            setPhoneNumber(phoneNumberWithoutWhitespace)
          }
        }
      },
      [setPhoneNumber],
    )

    return isVisible ? (
      <>
        <ReactNative.KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
          <ForegroundItem style={{ alignItems: "center", marginTop: 100 }}>
            <AppText>What's your phone number?</AppText>
            <VerticalSpacing />
            <ReactNative.TextInput
              ref={phoneNumberFieldRef}
              testID="Phone Number Field"
              textContentType="telephoneNumber"
              autoFocus
              keyboardType="number-pad"
              value={phoneNumber}
              onChangeText={safeSetPhoneNumber}
              style={hiddenTextInputStyle}
            />
            <AppText bold>{formattedPhoneNumber || " "}</AppText>
          </ForegroundItem>
        </ReactNative.KeyboardAvoidingView>
        <AboveKeyboardButton
          title="Continue"
          isVisible={hasCompletePhoneNumber}
          onPress={sendTextMessageConfirmationCode}
        />
      </>
    ) : (
      <></>
    )
  },
)

export default PhoneNumberInput
