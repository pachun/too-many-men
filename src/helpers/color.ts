// these work on iOS (when prefixed with `system${Color}` (https://reactnative.dev/docs/platformcolor):
// https://developer.apple.com/design/human-interface-guidelines/color#Specifications
//
// these work on all platforms:
// https://reactnative.dev/docs/colors#color-keywords

import iosSystemColorWithOtherPlatformAlternative from "helpers/iosSystemColorWithOtherPlatformAlternative"

type IosSystemColors =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "mint"
  | "teal"
  | "cyan"
  | "blue"
  | "indigo"
  | "purple"
  | "pink"
  | "brown"
  | "gray"

const color = (color: IosSystemColors): string => {
  const ios = `system${color.at(0)?.toUpperCase()}${color.slice(1)}`

  switch (color) {
    case "mint":
      return iosSystemColorWithOtherPlatformAlternative({
        ios,
        otherPlatforms: "lightcyan",
      })
    default:
      return iosSystemColorWithOtherPlatformAlternative({
        ios,
        otherPlatforms: color,
      })
  }
}

export default color
