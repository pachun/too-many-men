import * as ReactNavigationNative from "@react-navigation/native"
import useTheme from "hooks/useTheme"
import type { Provider as ProviderType } from "types/Provider"

const ThemeProvider: ProviderType = ({ children }) => {
  const theme = useTheme()

  return (
    <ReactNavigationNative.ThemeProvider value={theme}>
      {children}
    </ReactNavigationNative.ThemeProvider>
  )
}

export default ThemeProvider
