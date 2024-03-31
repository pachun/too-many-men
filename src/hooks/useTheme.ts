import React from "react"
import * as ReactNative from "react-native"
import * as ReactNavigationNative from "@react-navigation/native"
import type { ColorScheme } from "types/ColorScheme"
import iosSystemColorWithOtherPlatformAlternative from "helpers/iosSystemColorWithOtherPlatformAlternative"
import color from "helpers/color"

export interface AppTheme extends ReactNavigationNative.Theme {
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
    listItemTapHighlightColor: string
    gameScoreBackgroundColor: {
      Win: string
      Loss: string
      Tie: string
      Unplayed: string
    }
    gameAttendanceButtonBackgroundColor: {
      going: string
      notGoing: string
      maybeGoing: string
    }
    foregroundItemBackgroundColor: string
  }
  foregroundItemWidth: "92%"
  foregroundItemHorizontalPadding: 15
  foregroundItemVerticalPadding: 20
  foregroundItemVerticalMargin: 20
  foregroundItemBorderRadius: 5
  fontSize: 20
}

const lightTheme: AppTheme = {
  ...ReactNavigationNative.DefaultTheme,
  colors: {
    ...ReactNavigationNative.DefaultTheme.colors,
    primary: color("blue"),
    secondaryLabel: iosSystemColorWithOtherPlatformAlternative({
      ios: "secondaryLabel",
      otherPlatforms: "gray",
    }),
    listItemTapHighlightColor: iosSystemColorWithOtherPlatformAlternative({
      ios: "tertiarySystemBackground",
      otherPlatforms: "white",
    }),
    gameScoreBackgroundColor: {
      Win: iosSystemColorWithOtherPlatformAlternative({
        ios: "systemGreen",
        otherPlatforms: "limegreen",
      }),
      Loss: color("red"),
      Tie: color("gray"),
      Unplayed: "transparent",
    },
    gameAttendanceButtonBackgroundColor: {
      going: iosSystemColorWithOtherPlatformAlternative({
        ios: "systemGreen",
        otherPlatforms: "limegreen",
      }),
      notGoing: color("red"),
      maybeGoing: iosSystemColorWithOtherPlatformAlternative({
        ios: "systemYellow",
        otherPlatforms: "#ffcc02",
      }),
    },
    foregroundItemBackgroundColor: iosSystemColorWithOtherPlatformAlternative({
      ios: "tertiarySystemBackground",
      otherPlatforms: "white",
    }),
  },
  foregroundItemWidth: "92%",
  foregroundItemHorizontalPadding: 15,
  foregroundItemVerticalPadding: 20,
  foregroundItemVerticalMargin: 20,
  foregroundItemBorderRadius: 5,
  fontSize: 20,
}

const darkTheme: AppTheme = {
  ...ReactNavigationNative.DarkTheme,
  colors: {
    ...ReactNavigationNative.DarkTheme.colors,
    primary: iosSystemColorWithOtherPlatformAlternative({
      ios: "systemBlue",
      otherPlatforms: "deepskyblue",
    }),
    secondaryLabel: iosSystemColorWithOtherPlatformAlternative({
      ios: "secondaryLabel",
      otherPlatforms: "gray",
    }),
    listItemTapHighlightColor: iosSystemColorWithOtherPlatformAlternative({
      ios: "tertiarySystemBackground",
      otherPlatforms: "#2c2c2e",
    }),
    gameScoreBackgroundColor: {
      Win: iosSystemColorWithOtherPlatformAlternative({
        ios: "systemGreen",
        otherPlatforms: "limegreen",
      }),
      Loss: color("red"),
      Tie: color("gray"),
      Unplayed: "transparent",
    },
    gameAttendanceButtonBackgroundColor: {
      going: iosSystemColorWithOtherPlatformAlternative({
        ios: "systemGreen",
        otherPlatforms: "limegreen",
      }),
      notGoing: color("red"),
      maybeGoing: color("yellow"),
    },
    foregroundItemBackgroundColor: iosSystemColorWithOtherPlatformAlternative({
      ios: "tertiarySystemBackground",
      otherPlatforms: "#2c2c2e",
    }),
  },
  foregroundItemWidth: "92%",
  foregroundItemHorizontalPadding: 15,
  foregroundItemVerticalPadding: 20,
  foregroundItemVerticalMargin: 20,
  foregroundItemBorderRadius: 5,
  fontSize: 20,
}

// We don't test otherPlatforms color schemes; it doesn't seem worth the effort.
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
