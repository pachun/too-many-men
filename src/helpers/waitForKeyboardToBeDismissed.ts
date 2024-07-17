const waitForKeyboardToBeDismissed = async (
  then: () => void,
): Promise<void> => {
  const millisecondsRequiredToDismissKeyboard = 500
  setTimeout(() => {
    /* c8 ignore start */
    // This is required for physical iOS devices, but we're unsure how to test it
    then()
    /* c8 ignore end */
  }, millisecondsRequiredToDismissKeyboard)
}

export default waitForKeyboardToBeDismissed
