import * as ReactNative from "react-native"
import * as ReactNavigationNative from "@react-navigation/native"

const borderBottomColor = ReactNavigationNative.DefaultTheme.colors.border

interface ListItemSeparatorProps {
  paddingLeft: number
}

const ListItemSeparator = ({
  paddingLeft,
}: ListItemSeparatorProps): React.ReactElement => (
  <ReactNative.View
    style={{
      paddingLeft,
      width: "100%",
      flexDirection: "row",
      justifyContent: "flex-end",
      height: 1,
    }}
  >
    <ReactNative.View
      style={{
        flex: 1,
        height: 0.25,
        borderBottomWidth: 0.25,
        borderBottomColor,
      }}
    />
  </ReactNative.View>
)

export default ListItemSeparator
