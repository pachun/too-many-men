import React from "react"
import * as ReactNative from "react-native"
import * as ReactNavigationNative from "@react-navigation/native"
import type { ColorScheme } from "types/ColorScheme"

export const color = ({
  ios,
  other,
}: {
  ios: string
  other: string
}): string => {
  return ReactNative.Platform.OS === "ios"
    ? (ReactNative.PlatformColor(ios) as unknown as string)
    : other
}

interface AppTheme extends ReactNavigationNative.Theme {
  // https://reactnavigation.org/docs/themes/#basic-usage
  dark: boolean
  colors: {
    primary: string
    background: string
    card: string
    text: string
    border: string
    notification: string

    // additions
    secondaryLabel: string
  }
}

const lightTheme: AppTheme = {
  ...ReactNavigationNative.DefaultTheme,
  colors: {
    ...ReactNavigationNative.DefaultTheme.colors,
    primary: color({ ios: "systemPurple", other: "purple" }),
    secondaryLabel: color({ ios: "secondaryLabel", other: "gray" }),
  },
}

const darkTheme: AppTheme = {
  ...ReactNavigationNative.DarkTheme,
  colors: {
    ...ReactNavigationNative.DarkTheme.colors,
    primary: color({ ios: "systemPurple", other: "purple" }),
    secondaryLabel: color({ ios: "secondaryLabel", other: "gray" }),
  },
}

// We don't test other color schemes; it doesn't seem worth the effort.
// By default, only light is tested.
//* c8 ignore start */
const themeFromColorScheme = (colorScheme: ColorScheme): AppTheme => {
  switch (colorScheme) {
    case "light":
      return lightTheme
    case "dark":
      return darkTheme
    default:
      return lightTheme
  }
}
//* c8 ignore end */

const useTheme = (): AppTheme => {
  const colorScheme: ColorScheme = ReactNative.useColorScheme()

  const theme = React.useMemo(
    () => themeFromColorScheme(colorScheme),
    [colorScheme],
  )

  return theme
}

export default useTheme
