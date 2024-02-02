// this probably should be unit tested and put in an npm package

//* c8 ignore start */

import React from "react"
import * as ReactNative from "react-native"
import type { AppStateStatus } from "react-native"

interface Props {
  onForeground?: () => void
  onLaunch?: () => void
}

const appIsBeingForegrounded = (
  nextAppState: AppStateStatus,
  currentAppState: AppStateStatus,
): boolean =>
  Boolean(
    currentAppState.match(/inactive|background/) && nextAppState === "active",
  )

const noOperation = (): void => {}

const useAppLifecycle = ({
  onForeground = noOperation,
  onLaunch = noOperation,
}: Props): void => {
  const appState = React.useRef(ReactNative.AppState.currentState)
  const respondToLifecycleUpdates = React.useCallback((): (() => void) => {
    const _handleAppStateChange = (nextAppState: AppStateStatus): void => {
      if (appIsBeingForegrounded(nextAppState, appState.current)) onForeground()
      appState.current = nextAppState
    }

    const eventListener = ReactNative.AppState.addEventListener(
      "change",
      _handleAppStateChange,
    )
    return (): void => {
      eventListener.remove()
    }
  }, [onForeground])

  React.useEffect(() => {
    respondToLifecycleUpdates()
  }, [respondToLifecycleUpdates])

  React.useEffect(() => {
    onLaunch()
  }, [onLaunch])
}

export default useAppLifecycle

//* c8 ignore end */
