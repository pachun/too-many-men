import React from "react"
import * as ExpoRouter from "expo-router"
import * as ExpoVectorIcons from "@expo/vector-icons"
import * as ReactNavigationNative from "@react-navigation/native"
import NavigationHeaderToastNotification from "components/NavigationHeaderToastNotification"
import useOverTheAirUpdates from "hooks/useOverTheAirUpdates"

const theme = {
  ...ReactNavigationNative.DefaultTheme,
  colors: {
    ...ReactNavigationNative.DefaultTheme.colors,
    background: "#fff",
  },
}

const Layout = (): React.ReactElement => {
  useOverTheAirUpdates()

  return (
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
  )
}

export default Layout
