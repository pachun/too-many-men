import * as ReactNative from "react-native"
import useTheme from "hooks/useTheme"

interface ListItemSeparatorProps {
  paddingLeft: number
}

const ListItemSeparator = ({
  paddingLeft,
}: ListItemSeparatorProps): React.ReactElement => {
  const theme = useTheme()

  return (
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
          borderBottomColor: theme.colors.border,
        }}
      />
    </ReactNative.View>
  )
}

export default ListItemSeparator
