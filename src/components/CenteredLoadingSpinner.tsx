import * as ReactNative from "react-native"

const CenteredLoadingSpinner = (): React.ReactElement => (
  <ReactNative.View
    testID="Loading Spinner"
    style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
  >
    <ReactNative.ActivityIndicator />
  </ReactNative.View>
)

export default CenteredLoadingSpinner
