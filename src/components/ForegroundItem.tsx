import * as ReactNative from "react-native"
import VerticalSpacing from "components/VerticalSpacing"
import useTheme from "hooks/useTheme"

interface ForegroundItemProps {
  children: React.ReactElement | React.ReactElement[]
  style?: ReactNative.StyleProp<ReactNative.ViewStyle>
}

const ForegroundItem = ({
  children,
  style = {},
}: ForegroundItemProps): React.ReactElement => {
  const theme = useTheme()

  const defaultForegroundItemStyle: ReactNative.StyleProp<ReactNative.ViewStyle> =
    {
      backgroundColor: theme.colors.foregroundItemBackgroundColor,
      width: theme.foregroundItemWidth,
      paddingLeft: theme.foregroundItemHorizontalPadding,
      paddingRight: theme.foregroundItemHorizontalPadding,
      paddingTop: theme.foregroundItemVerticalPadding,
      paddingBottom: theme.foregroundItemVerticalPadding,
      borderRadius: theme.foregroundItemBorderRadius,
    }

  return (
    <>
      <VerticalSpacing />
      <ReactNative.View style={{ width: "100%", alignItems: "center" }}>
        <ReactNative.View style={[defaultForegroundItemStyle, style]}>
          {children}
        </ReactNative.View>
      </ReactNative.View>
    </>
  )
}

export default ForegroundItem
