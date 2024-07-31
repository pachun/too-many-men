import React from "react"
import * as ReactNative from "react-native"

const formatCompleteOrPartialPhoneNumber = (
  phoneNumberDigits: string,
): string => {
  if (phoneNumberDigits.length < 4) {
    return phoneNumberDigits
  } else if (phoneNumberDigits.length < 7) {
    return `(${phoneNumberDigits.slice(0, 3)}) ${phoneNumberDigits.slice(3)}`
  }
  return `(${phoneNumberDigits.slice(0, 3)}) ${phoneNumberDigits.slice(3, 6)}-${phoneNumberDigits.slice(6)}`
}

type PhoneNumberFieldProps = ReactNative.TextInputProps & {
  phoneNumber: string
  onChangePhoneNumber: (phoneNumber: string) => void
}

export const numberOfDigitsInFullPhoneNumber = 10
const fullPhoneNumber = "0".repeat(numberOfDigitsInFullPhoneNumber)

const PhoneNumberField = React.forwardRef(
  (
    props: PhoneNumberFieldProps,
    ref: React.ForwardedRef<ReactNative.TextInput>,
  ): React.ReactElement => {
    const [displayedPhoneNumber, setDisplayedPhoneNumber] =
      React.useState<string>(
        formatCompleteOrPartialPhoneNumber(props.phoneNumber),
      )

    const setDigits = React.useMemo(
      () => props.onChangePhoneNumber,
      [props.onChangePhoneNumber],
    )

    return (
      <ReactNative.TextInput
        ref={ref}
        keyboardType="number-pad"
        textContentType="telephoneNumber"
        {...props}
        value={displayedPhoneNumber}
        onChangeText={editedPhoneNumber => {
          const digits = editedPhoneNumber.replace(/\D/g, "")
          setDigits(digits)
          setDisplayedPhoneNumber(formatCompleteOrPartialPhoneNumber(digits))
        }}
        maxLength={formatCompleteOrPartialPhoneNumber(fullPhoneNumber).length}
      />
    )
  },
)

export default PhoneNumberField
