import React from "react"
import * as ReactNative from "react-native"
import * as ExpoRouter from "expo-router"
import * as ExpoStatusBar from "expo-status-bar"
import useOverTheAirUpdates from "hooks/useOverTheAirUpdates"
import { initializeAptabase, trackAptabaseEvent } from "helpers/aptabase"
import RefreshablePlayersProvider from "components/RefreshablePlayersProvider"
import RefreshableGamesProvider from "components/RefreshableGamesProvider"
import NavigationHeaderToastNotification from "components/NavigationHeaderToastNotification"
import ThemeProvider from "components/ThemeProvider"
import ComposedProviders from "components/ComposedProviders"
import ApiTokenProvider from "components/ApiTokenProvider"
import UserIdProvider from "components/UserIdProvider"
import RefreshableTeamsProvider from "components/RefreshableTeamsProvider"
// import AsyncStorage from "@react-native-async-storage/async-storage"
//
// const resetAuthenticationForDevelopment = (): void => {
//   AsyncStorage.setItem("API Token", "")
//   AsyncStorage.setItem("User ID", "")
// }

initializeAptabase()

const Layout = (): React.ReactElement => {
  React.useEffect(() => {
    trackAptabaseEvent("App Launched")
  }, [])

  // React.useEffect(() => {
  //   resetAuthenticationForDevelopment()
  // }, [])

  useOverTheAirUpdates()

  return (
    <>
      <ExpoStatusBar.StatusBar style="auto" />
      <ComposedProviders
        providers={[
          ThemeProvider,
          ApiTokenProvider,
          UserIdProvider,
          RefreshableTeamsProvider,
          RefreshableGamesProvider,
          RefreshablePlayersProvider,
          NavigationHeaderToastNotification.Provider,
        ]}
      >
        <ReactNative.View style={{ flex: 1 }}>
          <ExpoRouter.Slot />
        </ReactNative.View>
      </ComposedProviders>
    </>
  )
}

export default Layout
