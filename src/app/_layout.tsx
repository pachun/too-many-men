import * as ExpoRouter from "expo-router"
import { ThemeProvider, DefaultTheme } from "@react-navigation/native"
import NavigationHeaderToastNotification from "components/NavigationHeaderToastNotification"

const Layout = (): React.ReactElement => {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "#fff",
    },
  }

  return (
    <ThemeProvider value={theme}>
      <NavigationHeaderToastNotification.Provider>
        <ExpoRouter.Stack />
      </NavigationHeaderToastNotification.Provider>
    </ThemeProvider>
  )
}

export default Layout
