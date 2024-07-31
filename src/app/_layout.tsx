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
import KeyboardHeightProvider from "components/KeyboardHeightProvider"

initializeAptabase()

const Layout = (): React.ReactElement => {
  React.useEffect(() => {
    trackAptabaseEvent("App Launched")
  }, [])

  useOverTheAirUpdates()

  return (
    <>
      <ExpoStatusBar.StatusBar style="auto" />
      <ComposedProviders
        providers={[
          KeyboardHeightProvider,
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
          <ExpoRouter.Stack
            screenOptions={{
              headerShown: false,
              headerTitleStyle: { fontSize: 20, fontWeight: "bold" },
            }}
          />
        </ReactNative.View>
      </ComposedProviders>
    </>
  )
}

export default Layout
