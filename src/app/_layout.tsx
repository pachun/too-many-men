import React from "react"
import * as ExpoRouter from "expo-router"
import * as ExpoStatusBar from "expo-status-bar"
import * as ExpoVectorIcons from "@expo/vector-icons"
import * as ReactNavigationNative from "@react-navigation/native"
import NavigationHeaderToastNotification from "components/NavigationHeaderToastNotification"
import useOverTheAirUpdates from "hooks/useOverTheAirUpdates"
import useTheme from "hooks/useTheme"
import { initializeAptabase, trackAptabaseEvent } from "aptabase"

initializeAptabase()

const Layout = (): React.ReactElement => {
  React.useEffect(() => {
    trackAptabaseEvent("App Launched")
  }, [])

  useOverTheAirUpdates()

  const theme = useTheme()

  return (
    <>
      <ExpoStatusBar.StatusBar style="auto" />
      <ReactNavigationNative.ThemeProvider value={theme}>
        <NavigationHeaderToastNotification.Provider>
          <ExpoRouter.Tabs>
            <ExpoRouter.Tabs.Screen
              name="index"
              options={{
                title: "Team",
                tabBarIcon: ({ color }) => (
                  <ExpoVectorIcons.FontAwesome6
                    name="people-group"
                    color={color}
                    size={20}
                  />
                ),
              }}
            />
            <ExpoRouter.Tabs.Screen
              name="games"
              options={{
                title: "Games",
                tabBarIcon: ({ color }) => (
                  <ExpoVectorIcons.FontAwesome
                    name="calendar"
                    color={color}
                    size={20}
                  />
                ),
              }}
            />
          </ExpoRouter.Tabs>
        </NavigationHeaderToastNotification.Provider>
      </ReactNavigationNative.ThemeProvider>
    </>
  )
}

export default Layout
