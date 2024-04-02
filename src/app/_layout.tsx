import React from "react"
import * as ExpoRouter from "expo-router"
import * as ExpoStatusBar from "expo-status-bar"
import * as ExpoVectorIcons from "@expo/vector-icons"
import useOverTheAirUpdates from "hooks/useOverTheAirUpdates"
import { initializeAptabase, trackAptabaseEvent } from "helpers/aptabase"
import RefreshablePlayersProvider from "components/RefreshablePlayersProvider"
import RefreshableGamesProvider from "components/RefreshableGamesProvider"
import NavigationHeaderToastNotification from "components/NavigationHeaderToastNotification"
import ThemeProvider from "components/ThemeProvider"
import ComposedProviders from "components/ComposedProviders"
import ApiTokenProvider from "components/ApiTokenProvider"
import UserIdProvider from "components/UserIdProvider"
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
          RefreshableGamesProvider,
          RefreshablePlayersProvider,
          NavigationHeaderToastNotification.Provider,
        ]}
      >
        <ExpoRouter.Tabs screenOptions={{ headerShown: false }}>
          <ExpoRouter.Tabs.Screen
            name="players"
            options={{
              title: "Team",
              tabBarLabelStyle: { fontSize: 12 },
              tabBarIcon: ({ color }) => (
                <ExpoVectorIcons.FontAwesome6
                  name="people-group"
                  color={color}
                  size={23}
                />
              ),
            }}
          />
          <ExpoRouter.Tabs.Screen
            name="games"
            options={{
              title: "Games",
              tabBarLabelStyle: { fontSize: 12 },
              tabBarIcon: ({ color }) => (
                <ExpoVectorIcons.FontAwesome
                  name="calendar"
                  color={color}
                  size={23}
                />
              ),
            }}
          />
          <ExpoRouter.Tabs.Screen
            name="index"
            options={{
              href: null,
            }}
          />
        </ExpoRouter.Tabs>
      </ComposedProviders>
    </>
  )
}

export default Layout
