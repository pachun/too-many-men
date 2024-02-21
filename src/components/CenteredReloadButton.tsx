import * as ReactNative from "react-native"

const CenteredReloadButton = ({
  onPress,
}: {
  onPress: () => void
}): React.ReactElement => (
  <ReactNative.View
    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  >
    <ReactNative.Button
      onPress={onPress}
      title="Reload"
      testID="Reload Button"
    />
  </ReactNative.View>
)

export default CenteredReloadButton
