import useTheme from "hooks/useTheme"
import * as ReactNative from "react-native"

const VerticalSpacing = (): React.ReactElement => {
  const theme = useTheme()

  return (
    <ReactNative.View style={{ height: theme.foregroundItemVerticalMargin }} />
  )
}

export default VerticalSpacing
