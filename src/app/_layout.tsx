import React from "react"
import * as ExpoRouter from "expo-router"
import * as ReactNavigationNative from "@react-navigation/native"
import * as ReactNativeSafeAreaContext from "react-native-safe-area-context"
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
    <ReactNativeSafeAreaContext.SafeAreaProvider>
      <ReactNavigationNative.ThemeProvider value={theme}>
        <NavigationHeaderToastNotification.Provider>
          <ExpoRouter.Stack />
        </NavigationHeaderToastNotification.Provider>
      </ReactNavigationNative.ThemeProvider>
    </ReactNativeSafeAreaContext.SafeAreaProvider>
  )
}

export default Layout
