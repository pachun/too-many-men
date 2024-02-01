import * as ExpoRouter from "expo-router"
import * as ReactNavigationNative from "@react-navigation/native"
import * as ReactNativeSafeAreaContext from "react-native-safe-area-context"
import NavigationHeaderToastNotification from "components/NavigationHeaderToastNotification"

const Layout = (): React.ReactElement => {
  const theme = {
    ...ReactNavigationNative.DefaultTheme,
    colors: {
      ...ReactNavigationNative.DefaultTheme.colors,
      background: "#fff",
    },
  }

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
