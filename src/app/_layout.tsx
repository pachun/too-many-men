import React from "react"
import * as ExpoRouter from "expo-router"
import * as ExpoStatusBar from "expo-status-bar"
import * as ExpoVectorIcons from "@expo/vector-icons"
import useOverTheAirUpdates from "hooks/useOverTheAirUpdates"
import { initializeAptabase, trackAptabaseEvent } from "helpers/aptabase"
import Providers from "components/Providers"

initializeAptabase()

const Layout = (): React.ReactElement => {
  React.useEffect(() => {
    trackAptabaseEvent("App Launched")
  }, [])

  useOverTheAirUpdates()

  return (
    <>
      <ExpoStatusBar.StatusBar style="auto" />
      <Providers>
        <ExpoRouter.Tabs screenOptions={{ headerShown: false }}>
          <ExpoRouter.Tabs.Screen
            name="players"
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
          <ExpoRouter.Tabs.Screen
            name="index"
            options={{
              href: null,
            }}
          />
        </ExpoRouter.Tabs>
      </Providers>
    </>
  )
}

export default Layout
