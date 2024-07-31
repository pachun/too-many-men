import React from "react"
import ReactNative from "react-native"
import type { Provider as ProviderType } from "types/Provider"

export type KeyboardHeightContextType = number

export const KeyboardHeightContext =
  React.createContext<KeyboardHeightContextType>(0)

const KeyboardHeightProvider: ProviderType = ({ children }) => {
  const [keyboardHeight, setKeyboardHeight] = React.useState<number>(0)

  React.useEffect(() => {
    /* c8 ignore start */
    // The jest tests do not receive keyboard events; So these aren't run in
    // the tests but they are necessary on physical devices.
    const keyboardDidShowListener = ReactNative.Keyboard.addListener(
      "keyboardDidShow",
      event => {
        setKeyboardHeight(event.endCoordinates.height)
      },
    )
    const keyboardWillHideListener = ReactNative.Keyboard.addListener(
      "keyboardWillHide",
      () => {
        setKeyboardHeight(0)
      },
    )
    /* c8 ignore end */

    return () => {
      keyboardDidShowListener.remove()
      keyboardWillHideListener.remove()
    }
  }, [])

  return (
    <KeyboardHeightContext.Provider value={keyboardHeight}>
      {children}
    </KeyboardHeightContext.Provider>
  )
}

export default KeyboardHeightProvider
