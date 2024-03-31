import * as ReactNative from "react-native"

const iosSystemColorWithOtherPlatformAlternative = ({
  ios,
  otherPlatforms,
}: {
  ios: string
  otherPlatforms: string
}): string =>
  ReactNative.Platform.OS === "ios"
    ? (ReactNative.PlatformColor(ios) as unknown as string)
    : otherPlatforms

export default iosSystemColorWithOtherPlatformAlternative
