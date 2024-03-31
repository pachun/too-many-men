// this probably should be unit tested and put in an npm package

//* c8 ignore start */

import React from "react"
import * as ReactNative from "react-native"
import * as ExpoUpdates from "expo-updates"
import useAppLifecycle from "hooks/useAppLifecycle"
import { trackAptabaseEvent } from "helpers/aptabase"

const ifThereIsAnOverTheAirUpdateDownloadItAndThenAskForPermissionToApplyItByRestartingTheApp =
  async (): Promise<void> => {
    const { isAvailable: remoteOverTheAirUpdateExists } =
      await ExpoUpdates.checkForUpdateAsync()
    if (remoteOverTheAirUpdateExists) {
      const { isNew: overTheAirUpdateHasBeenDownloadded } =
        await ExpoUpdates.fetchUpdateAsync()
      if (overTheAirUpdateHasBeenDownloadded) {
        ReactNative.Alert.alert(
          "Update Available",
          "A newer version of wolfpack app is available. Without it, some features may not work properly. May we restart the app to apply the update?",
          [
            {
              text: "No",
              style: "cancel",
              onPress: (): void => {
                trackAptabaseEvent("OTA Update Relaunch Rejected")
              },
            },
            {
              text: "Yes",
              onPress: async (): Promise<void> => {
                trackAptabaseEvent("OTA Update Relaunch Accepted")
                await ExpoUpdates.reloadAsync()
              },
            },
          ],
        )
      }
    }
  }

const useOverTheAirUpdates = (): void => {
  const [isUpdating, setIsUpdating] = React.useState(false)

  const shouldTryToUpdate = React.useMemo(() => !__DEV__, [])

  const update = React.useCallback(() => {
    if (shouldTryToUpdate && !isUpdating) {
      setIsUpdating(true)
      try {
        ifThereIsAnOverTheAirUpdateDownloadItAndThenAskForPermissionToApplyItByRestartingTheApp()
      } finally {
        setIsUpdating(false)
      }
    }
  }, [isUpdating, shouldTryToUpdate])

  useAppLifecycle({
    onLaunch: update,
    onForeground: update,
  })
}

export default useOverTheAirUpdates

//* c8 ignore end */
