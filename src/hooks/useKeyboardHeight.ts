import React from "react"
import { KeyboardHeightContext } from "components/KeyboardHeightProvider"

const useKeyboardHeight = (): number => {
  const keyboardHeight = React.useContext(KeyboardHeightContext)
  return keyboardHeight
}

export default useKeyboardHeight
