const formatPhoneNumber = (phoneNumber: string): string => {
  return Array.from(phoneNumber).reduce(
    (formattedPhoneNumber, currentDigit, currentDigitPosition) => {
      if (currentDigitPosition === 0) {
        return `(${currentDigit}`
      } else if (currentDigitPosition === 2) {
        return `${formattedPhoneNumber}${currentDigit}) `
      } else if (currentDigitPosition === 5) {
        return `${formattedPhoneNumber}${currentDigit}-`
      } else {
        return `${formattedPhoneNumber}${currentDigit}`
      }
    },
    "",
  )
}

export default formatPhoneNumber
