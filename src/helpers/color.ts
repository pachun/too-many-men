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
  const ios = `system${color.at(0)!.toUpperCase()}${color.slice(1)}`

  switch (color) {
    // this hasn't been useed yet, so it isn't tested;
    // we just want to call out that mint is the only iOS system
    // color that RN color keywords don't support, while continuing
    // to support the mint iOS system color with a RN alternative.
    //
    //* c8 ignore start */
    case "mint":
      return iosSystemColorWithOtherPlatformAlternative({
        ios,
        otherPlatforms: "lightcyan",
      })
    //* c8 ignore end */
    default:
      return iosSystemColorWithOtherPlatformAlternative({
        ios,
        otherPlatforms: color,
      })
  }
}

export default color
